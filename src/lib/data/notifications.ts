import { createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export type NotificationType = 'webinar' | 'module' | 'lesson' | 'content' | 'case_study';

export interface NotificationRow {
  id: string;
  type: NotificationType;
  title: string;
  link: string;
  reference_id: string | null;
  created_at: string;
}

export interface NotificationWithRead {
  id: string;
  type: NotificationType;
  title: string;
  link: string;
  reference_id: string | null;
  created_at: string;
  read_at: string | null;
}

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Insert a broadcast notification (call from admin context only; uses service role). */
export async function createNotification(payload: {
  type: NotificationType;
  title: string;
  link: string;
  reference_id?: string | null;
}): Promise<{ id: string; error: string | null }> {
  const admin = createAdminClient();
  const { data, error } = await (admin as any)
    .from('notifications')
    .insert({
      type: payload.type,
      title: payload.title,
      link: payload.link,
      reference_id: payload.reference_id ?? null,
    })
    .select('id')
    .single();
  if (error) return { id: '', error: error.message };
  return { id: (data as { id: string }).id, error: null };
}

/** Fetch notifications from the last 7 days with read status for the current user. */
export async function getWeeklyNotificationsForUser(userId: string): Promise<NotificationWithRead[]> {
  const supabase = await createServerClient();
  const since = new Date(Date.now() - ONE_WEEK_MS).toISOString();

  const { data: notifications, error: notifError } = await supabase
    .from('notifications')
    .select('id, type, title, link, reference_id, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: false });

  if (notifError || !notifications?.length) return [];

  const ids = (notifications as NotificationRow[]).map((n) => n.id);
  const { data: reads } = await supabase
    .from('notification_reads')
    .select('notification_id, read_at')
    .eq('user_id', userId)
    .in('notification_id', ids);

  const readMap = new Map<string, string | null>();
  (reads ?? []).forEach((r: { notification_id: string; read_at: string | null }) => {
    readMap.set(r.notification_id, r.read_at);
  });

  return (notifications as NotificationRow[]).map((n) => ({
    ...n,
    read_at: readMap.get(n.id) ?? null,
  }));
}

/** Mark a notification as read for the current user. */
export async function markNotificationRead(userId: string, notificationId: string): Promise<{ error: string | null }> {
  const supabase = await createServerClient();
  const { error } = await (supabase as any)
    .from('notification_reads')
    .upsert(
      { user_id: userId, notification_id: notificationId, read_at: new Date().toISOString() },
      { onConflict: 'user_id,notification_id' }
    );
  return { error: error?.message ?? null };
}
