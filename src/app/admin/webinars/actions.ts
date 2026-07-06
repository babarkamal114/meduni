'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import type { WebinarStatus } from '@/lib/data/webinars';
import {
  createWebinar as createWebinarDb,
  updateWebinar as updateWebinarDb,
  deleteWebinar as deleteWebinarDb,
} from '@/lib/data/webinars';
import { titleToSlug } from '@/lib/utils/slug';
import { createNotification } from '@/lib/data/notifications';
import {
  ZoomApiError,
  createZoomMeeting,
  toZoomDurationMinutes,
} from '@/lib/integrations/zoom';
import { webinarSchema, formatZodFieldErrors } from '@/lib/validations/admin';
import type { AdminActionResult } from '@/types/actions';

export type WebinarFormState = {
  title: string;
  slug: string;
  expert: string;
  duration: string;
  price: string;
  status: WebinarStatus;
  scheduledAt: string;
  hasReplay: boolean;
  outcomes: string;
};

export type WebinarFormResult = AdminActionResult;

function extractWebinarFields(formData: FormData) {
  return {
    title: ((formData.get('title') as string) ?? '').trim(),
    expert: ((formData.get('expert') as string) ?? '').trim(),
    duration: ((formData.get('duration') as string) ?? '').trim(),
    price: ((formData.get('price') as string) ?? '').trim(),
    status: ((formData.get('status') as string) ?? '').trim() as WebinarStatus,
    scheduledAt: ((formData.get('scheduledAt') as string) ?? '').trim(),
    hasReplay: formData.get('hasReplay') === 'on',
    outcomes: ((formData.get('outcomes') as string) ?? '').trim(),
  };
}

export async function createWebinar(
  _prev: unknown,
  formData: FormData
): Promise<WebinarFormResult> {
  await requireAdmin();
  const raw = extractWebinarFields(formData);
  const parsed = webinarSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Please fix the errors below.', fieldErrors: formatZodFieldErrors(parsed.error) };
  }
  const { title, expert, duration, price, status, scheduledAt, hasReplay, outcomes: outcomesRaw } = parsed.data;
  const outcomes = outcomesRaw
    ? outcomesRaw.split('\n').map((s) => s.trim()).filter(Boolean)
    : [];

  const slug = titleToSlug(title);
  if (!slug) {
    return { success: false, error: 'Title must contain at least one letter or number.', fieldErrors: { title: ['Title must contain at least one letter or number.'] } };
  }

  const scheduled_at = new Date(scheduledAt).toISOString();
  let zoomPayload: {
    zoom_host_id: string;
    zoom_start_url: string | null;
    join_url: string | null;
  } | null = null;

  try {
    const zoomMeeting = await createZoomMeeting({
      topic: title,
      startTime: scheduled_at,
      durationMinutes: toZoomDurationMinutes(duration),
      agenda: outcomes.length > 0 ? outcomes.join('\n') : undefined,
    });

    zoomPayload = {
      zoom_host_id: zoomMeeting.hostId,
      zoom_start_url: zoomMeeting.startUrl,
      join_url: zoomMeeting.joinUrl,
    };
  } catch (error) {
    if (error instanceof ZoomApiError) {
      return { success: false, error: `Zoom error: ${error.message}` };
    }
    return { success: false, error: 'Failed to create Zoom webinar. Check Zoom configuration.' };
  }

  const { error } = await createWebinarDb({
    slug,
    title,
    expert,
    duration,
    price,
    status,
    status_label: null,
    has_replay: hasReplay,
    scheduled_at,
    outcomes,
    zoom_host_id: zoomPayload.zoom_host_id,
    zoom_start_url: zoomPayload.zoom_start_url,
    join_url: zoomPayload.join_url,
  });
  if (error) return { success: false, error };
  const notif = await createNotification({
    type: 'webinar',
    title: `New webinar: ${title}`,
    link: `/dashboard/webinars/${slug}`,
  });
  if (notif.error) {
    console.error('[notifications] Failed to create webinar notification:', notif.error);
  }
  try {
    const { sendMarketingEmailToAll } = await import('@/lib/email/send-marketing-email');
    await sendMarketingEmailToAll({
      contentType: 'webinar',
      contentTitle: title,
      ctaUrl: `/webinars/${slug}`,
      ctaLabel: 'View Webinar',
    });
  } catch (err) {
    console.error('[marketing-email] webinar email failed:', err);
  }
  revalidatePath('/admin/webinars');
  revalidatePath('/');
  revalidatePath('/webinars');
  revalidatePath('/dashboard/webinars');
  redirect('/admin/webinars?created=1');
}

export async function updateWebinar(
  _prev: unknown,
  formData: FormData
): Promise<WebinarFormResult> {
  await requireAdmin();
  const id = formData.get('id') as string;
  if (!id) return { success: false, error: 'Missing id' };

  const raw = extractWebinarFields(formData);
  const slug = ((formData.get('slug') as string) ?? '').trim();
  const parsed = webinarSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Please fix the errors below.', fieldErrors: formatZodFieldErrors(parsed.error) };
  }
  const { title, expert, duration, price, status, scheduledAt, hasReplay, outcomes: outcomesRaw } = parsed.data;
  const outcomes = outcomesRaw
    ? outcomesRaw.split('\n').map((s) => s.trim()).filter(Boolean)
    : [];

  const scheduled_at = scheduledAt ? new Date(scheduledAt).toISOString() : null;
  const { error } = await updateWebinarDb(id, {
    slug: slug || titleToSlug(title),
    title,
    expert,
    duration,
    price,
    status,
    status_label: null,
    has_replay: hasReplay,
    scheduled_at,
    outcomes,
  });
  if (error) return { success: false, error };
  revalidatePath('/admin/webinars');
  revalidatePath('/');
  revalidatePath('/webinars');
  revalidatePath('/dashboard/webinars');
  redirect(`/admin/webinars?updated=1`);
}

export async function deleteWebinar(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = (formData.get('id') as string)?.trim();
  if (!id) return;
  const { error } = await deleteWebinarDb(id);
  if (error) {
    redirect('/admin/webinars?delete_error=1');
  }
  revalidatePath('/admin/webinars');
  revalidatePath('/');
  revalidatePath('/webinars');
  revalidatePath('/dashboard/webinars');
  redirect('/admin/webinars?deleted=1');
}
