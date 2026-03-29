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

const REQUIRED_STATUSES: WebinarStatus[] = ['live', 'upcoming', 'recorded'];

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

export type WebinarFormResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof WebinarFormState | 'scheduledAt', string>>;
};

export async function createWebinar(
  _prev: unknown,
  formData: FormData
): Promise<WebinarFormResult> {
  await requireAdmin();
  const title = (formData.get('title') as string)?.trim() ?? '';
  const expert = (formData.get('expert') as string)?.trim() ?? '';
  const duration = (formData.get('duration') as string)?.trim() ?? '';
  const price = (formData.get('price') as string)?.trim() ?? '';
  const status = (formData.get('status') as string)?.trim() as WebinarStatus;
  const scheduledAtRaw = (formData.get('scheduledAt') as string)?.trim() ?? '';
  const hasReplay = formData.get('hasReplay') === 'on';
  const outcomesRaw = (formData.get('outcomes') as string)?.trim() ?? '';
  const outcomes = outcomesRaw
    ? outcomesRaw.split('\n').map((s) => s.trim()).filter(Boolean)
    : [];

  const fieldErrors: WebinarFormResult['fieldErrors'] = {};
  if (!title) fieldErrors.title = 'Title is required';
  if (!expert) fieldErrors.expert = 'Expert is required';
  if (!duration) fieldErrors.duration = 'Duration is required';
  if (!price) fieldErrors.price = 'Price is required';
  if (!status || !REQUIRED_STATUSES.includes(status)) fieldErrors.status = 'Status is required';
  if (!scheduledAtRaw) fieldErrors.scheduledAt = 'Scheduled date and time is required';
  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: 'Please fix the errors below.', fieldErrors };
  }

  const slug = titleToSlug(title);
  if (!slug) {
    return { success: false, error: 'Title must contain at least one letter or number.', fieldErrors: { title: 'Title must contain at least one letter or number.' } };
  }

  const scheduled_at = new Date(scheduledAtRaw).toISOString();
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
  revalidatePath('/admin/webinars');
  revalidatePath('/');
  revalidatePath('/webinars');
  revalidatePath('/dashboard/webinars');
  redirect('/admin/webinars?created=1');
}

export async function updateWebinar(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const id = formData.get('id') as string;
  if (!id) return { success: false, error: 'Missing id' };

  const title = (formData.get('title') as string)?.trim() ?? '';
  const slug = (formData.get('slug') as string)?.trim() ?? '';
  const expert = (formData.get('expert') as string)?.trim() ?? '';
  const duration = (formData.get('duration') as string)?.trim() ?? '';
  const price = (formData.get('price') as string)?.trim() ?? '';
  const status = (formData.get('status') as WebinarStatus) ?? 'upcoming';
  const scheduledAtRaw = (formData.get('scheduledAt') as string)?.trim() ?? '';
  const hasReplay = formData.get('hasReplay') === 'on';
  const outcomesRaw = (formData.get('outcomes') as string)?.trim() ?? '';
  const outcomes = outcomesRaw
    ? outcomesRaw.split('\n').map((s) => s.trim()).filter(Boolean)
    : [];

  const scheduled_at = scheduledAtRaw ? new Date(scheduledAtRaw).toISOString() : null;
  const { error } = await updateWebinarDb(id, {
    slug,
    title,
    expert: expert || null,
    duration: duration || null,
    price: price || null,
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
  if (error) throw new Error(error);
  revalidatePath('/admin/webinars');
  revalidatePath('/');
  revalidatePath('/webinars');
  revalidatePath('/dashboard/webinars');
  redirect('/admin/webinars?deleted=1');
}
