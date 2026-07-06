import type { Database } from '@/types/database';
import type { Json } from '@/types/database';
import type { WebinarStatus } from '@/lib/data/mock-webinars';
import { createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export type { WebinarStatus };

const GRADIENT_BY_STATUS: Record<WebinarStatus, string[]> = {
  live: ['from-teal-500 to-teal-700', 'from-emerald-500 to-emerald-700', 'from-cyan-500 to-cyan-700'],
  upcoming: ['from-indigo-500 to-indigo-600', 'from-violet-500 to-violet-600', 'from-blue-500 to-blue-600'],
  recorded: ['from-slate-500 to-slate-600', 'from-zinc-500 to-zinc-600', 'from-stone-500 to-stone-600'],
};

function getWebinarGradientClass(id: string, status: WebinarStatus): string {
  const variants = GRADIENT_BY_STATUS[status];
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return variants[Math.abs(index) % variants.length];
}

export interface Webinar {
  id: string;
  slug: string;
  title: string;
  expert: string;
  discipline?: string;
  outcomes?: string[];
  duration: string;
  price: string;
  status: WebinarStatus;
  statusLabel: string;
  gradientClass: string;
  ctaLabel: string;
  purchased: boolean;
  dateLabel: string;
  hasReplay: boolean;
  scheduledAt: string | null;
  joinUrl?: string | null;
  replayUrl?: string | null;
  zoomWebinarId?: string | null;
  zoomHostId?: string | null;
  zoomStartUrl?: string | null;
}

export interface WebinarRegistration {
  id: string;
  userId: string;
  webinarId: string;
  zoomRegistrantId?: string | null;
  zoomJoinUrl?: string | null;
  zoomRegisteredAt?: string | null;
  createdAt: string;
}

type WebinarsRow = Database['public']['Tables']['webinars']['Row'];

function getRelativeStatusLabel(scheduledAt: string | null, status: WebinarStatus): string {
  if (status === 'recorded') return 'Recorded';
  if (!scheduledAt) return 'TBA';
  const now = new Date();
  const scheduled = new Date(scheduledAt);
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const scheduledDate = new Date(scheduled.getFullYear(), scheduled.getMonth(), scheduled.getDate());
  const diffMs = scheduledDate.getTime() - nowDate.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'Started';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 6) return `In ${diffDays} days`;
  if (diffDays <= 13) return diffDays === 7 ? 'In 1 week' : `In ${diffDays} days`;
  const weeks = Math.round(diffDays / 7);
  return weeks === 1 ? 'In 1 week' : `In ${weeks} weeks`;
}

function formatDateLabel(scheduledAt: string | null, status: WebinarStatus): string {
  if (status === 'recorded') return 'Recorded';
  if (!scheduledAt) return 'TBA';
  const d = new Date(scheduledAt);
  const dateStr = d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
  return `${dateStr} - ${timeStr}`;
}

function getCtaLabel(status: WebinarStatus): string {
  switch (status) {
    case 'live':
      return 'Join now';
    case 'recorded':
      return 'Watch Now';
    default:
      return 'Register Now';
  }
}

function rowToWebinar(row: WebinarsRow, purchased: boolean): Webinar {
  const outcomes = Array.isArray(row.outcomes) ? (row.outcomes as string[]) : [];
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    expert: row.expert ?? '',
    discipline: row.discipline ?? undefined,
    outcomes: outcomes.length > 0 ? outcomes : undefined,
    duration: row.duration ?? 'TBA',
    price: row.price ?? 'TBA',
    status: row.status as WebinarStatus,
    statusLabel: getRelativeStatusLabel(row.scheduled_at, row.status as WebinarStatus),
    gradientClass: getWebinarGradientClass(row.id, row.status as WebinarStatus),
    ctaLabel: getCtaLabel(row.status as WebinarStatus),
    purchased,
    dateLabel: formatDateLabel(row.scheduled_at, row.status as WebinarStatus),
    hasReplay: row.has_replay ?? false,
    scheduledAt: row.scheduled_at,
    joinUrl: row.join_url ?? undefined,
    replayUrl: row.replay_url ?? undefined,
    zoomWebinarId: row.zoom_webinar_id ?? undefined,
    zoomHostId: row.zoom_host_id ?? undefined,
    zoomStartUrl: row.zoom_start_url ?? undefined,
  };
}

type WebinarRegistrationsRow = Database['public']['Tables']['webinar_registrations']['Row'];

function rowToWebinarRegistration(row: WebinarRegistrationsRow): WebinarRegistration {
  return {
    id: row.id,
    userId: row.user_id,
    webinarId: row.webinar_id,
    zoomRegistrantId: row.zoom_registrant_id ?? undefined,
    zoomJoinUrl: row.zoom_join_url ?? undefined,
    zoomRegisteredAt: row.zoom_registered_at ?? undefined,
    createdAt: row.created_at,
  };
}

export async function getWebinars(): Promise<Webinar[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('webinars')
    .select('*')
    .order('scheduled_at', { ascending: true, nullsFirst: false });

  if (error) {
    console.error('getWebinars error', error);
    return [];
  }
  return (data ?? []).map((row) => rowToWebinar(row, false));
}

export async function getWebinarBySlug(slug: string): Promise<Webinar | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('webinars')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return rowToWebinar(data, false);
}

export async function getWebinarById(id: string): Promise<Webinar | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('webinars')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return rowToWebinar(data, false);
}

export async function getPurchasedWebinarSlugsForUser(userId: string): Promise<string[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('webinar_registrations')
    .select('webinar_id')
    .eq('user_id', userId);

  if (error || !data?.length) return [];

  const webinarIds = (data as { webinar_id: string }[]).map((r) => r.webinar_id);
  const { data: webinars } = await supabase
    .from('webinars')
    .select('slug')
    .in('id', webinarIds);

  return (webinars ?? []).map((w) => (w as { slug: string }).slug);
}

export function withPurchased(webinars: Webinar[], purchasedSlugs: string[]): Webinar[] {
  return webinars.map((w) => ({
    ...w,
    purchased: purchasedSlugs.includes(w.slug),
  }));
}

type WebinarsInsert = Database['public']['Tables']['webinars']['Insert'];
type WebinarsUpdate = Database['public']['Tables']['webinars']['Update'];

export async function createWebinar(payload: {
  slug: string;
  title: string;
  expert?: string;
  discipline?: string | null;
  outcomes?: string[];
  duration?: string;
  price?: string;
  status: WebinarStatus;
  status_label?: string | null;
  has_replay?: boolean;
  scheduled_at?: string | null;
  join_url?: string | null;
  replay_url?: string | null;
  zoom_webinar_id?: string | null;
  zoom_host_id?: string | null;
  zoom_start_url?: string | null;
}): Promise<{ data: Webinar | null; error: string | null }> {
  const supabase = await createServerClient();
  const insert: WebinarsInsert = {
    slug: payload.slug,
    title: payload.title,
    expert: payload.expert ?? null,
    discipline: payload.discipline ?? null,
    outcomes: payload.outcomes ?? [],
    duration: payload.duration ?? null,
    price: payload.price ?? null,
    status: payload.status,
    status_label: payload.status_label ?? null,
    has_replay: payload.has_replay ?? false,
    scheduled_at: payload.scheduled_at ?? null,
    join_url: payload.join_url ?? null,
    replay_url: payload.replay_url ?? null,
    zoom_webinar_id: payload.zoom_webinar_id ?? null,
    zoom_host_id: payload.zoom_host_id ?? null,
    zoom_start_url: payload.zoom_start_url ?? null,
  };
  const { data, error } = await supabase.from('webinars').insert(insert as any).select('*').single();
  if (error) return { data: null, error: error.message };
  return { data: rowToWebinar(data as WebinarsRow, false), error: null };
}

export async function updateWebinar(
  id: string,
  payload: {
    slug?: string;
    title?: string;
    expert?: string | null;
    discipline?: string | null;
    outcomes?: string[];
    duration?: string | null;
    price?: string | null;
    status?: WebinarStatus;
    status_label?: string | null;
    has_replay?: boolean;
    scheduled_at?: string | null;
    join_url?: string | null;
    replay_url?: string | null;
    zoom_webinar_id?: string | null;
    zoom_host_id?: string | null;
    zoom_start_url?: string | null;
  }
): Promise<{ data: Webinar | null; error: string | null }> {
  const supabase = await createServerClient();
  const update: WebinarsUpdate = {
    ...(payload.slug !== undefined && { slug: payload.slug }),
    ...(payload.title !== undefined && { title: payload.title }),
    ...(payload.expert !== undefined && { expert: payload.expert }),
    ...(payload.discipline !== undefined && { discipline: payload.discipline }),
    ...(payload.outcomes !== undefined && { outcomes: payload.outcomes as Json }),
    ...(payload.duration !== undefined && { duration: payload.duration }),
    ...(payload.price !== undefined && { price: payload.price }),
    ...(payload.status !== undefined && { status: payload.status }),
    ...(payload.status_label !== undefined && { status_label: payload.status_label }),
    ...(payload.has_replay !== undefined && { has_replay: payload.has_replay }),
    ...(payload.scheduled_at !== undefined && { scheduled_at: payload.scheduled_at }),
    ...(payload.join_url !== undefined && { join_url: payload.join_url }),
    ...(payload.replay_url !== undefined && { replay_url: payload.replay_url }),
    ...(payload.zoom_webinar_id !== undefined && { zoom_webinar_id: payload.zoom_webinar_id }),
    ...(payload.zoom_host_id !== undefined && { zoom_host_id: payload.zoom_host_id }),
    ...(payload.zoom_start_url !== undefined && { zoom_start_url: payload.zoom_start_url }),
  };
  const { data, error } = await supabase
    .from('webinars')
    .update(update as never)
    .eq('id', id)
    .select('*')
    .single();
  if (error) return { data: null, error: error.message };
  return { data: rowToWebinar(data as WebinarsRow, false), error: null };
}

export async function deleteWebinar(id: string): Promise<{ error: string | null }> {
  const supabase = await createServerClient();
  const { error } = await supabase.from('webinars').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function registerUserForWebinar(
  userId: string,
  webinarId: string,
  stripePaymentIntentId?: string | null,
): Promise<{ error: string | null }> {
  const supabase = await createServerClient();
  const row: Record<string, string> = { user_id: userId, webinar_id: webinarId };
  if (stripePaymentIntentId) row.stripe_payment_intent_id = stripePaymentIntentId;
  const { error } = await supabase
    .from('webinar_registrations')
    .insert(row as never);
  if (error?.code === '23505') return { error: null };
  return { error: error?.message ?? null };
}

/** Service-role insert for trusted server contexts (e.g. Stripe webhook) where there is no user session. */
export async function registerUserForWebinarAsAdmin(
  userId: string,
  webinarId: string,
  stripePaymentIntentId?: string | null,
): Promise<{ error: string | null }> {
  const supabase = createAdminClient();
  const row: Record<string, string> = { user_id: userId, webinar_id: webinarId };
  if (stripePaymentIntentId) row.stripe_payment_intent_id = stripePaymentIntentId;
  const { error } = await supabase
    .from('webinar_registrations')
    .insert(row as never);
  if (error?.code === '23505') return { error: null };
  return { error: error?.message ?? null };
}

export async function getWebinarRegistration(
  userId: string,
  webinarId: string
): Promise<WebinarRegistration | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('webinar_registrations')
    .select('*')
    .eq('user_id', userId)
    .eq('webinar_id', webinarId)
    .maybeSingle();

  if (error || !data) return null;
  return rowToWebinarRegistration(data as WebinarRegistrationsRow);
}

export async function setWebinarRegistrationZoomDetails(
  userId: string,
  webinarId: string,
  payload: {
    zoom_registrant_id: string;
    zoom_join_url: string;
    zoom_registered_at?: string;
  }
): Promise<{ data: WebinarRegistration | null; error: string | null }> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('webinar_registrations')
    .update({
      zoom_registrant_id: payload.zoom_registrant_id,
      zoom_join_url: payload.zoom_join_url,
      zoom_registered_at: payload.zoom_registered_at ?? new Date().toISOString(),
    } as never)
    .eq('user_id', userId)
    .eq('webinar_id', webinarId)
    .select('*')
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: 'Registration not found' };
  return { data: rowToWebinarRegistration(data as WebinarRegistrationsRow), error: null };
}
