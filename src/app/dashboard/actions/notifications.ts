'use server';

import { revalidatePath } from 'next/cache';
import { getUser } from '@/lib/auth/getUser';
import {
  getWeeklyNotificationsForUser,
  markNotificationRead as markReadDb,
  type NotificationWithRead,
} from '@/lib/data/notifications';

export async function getNotifications(): Promise<NotificationWithRead[]> {
  const user = await getUser();
  if (!user?.id) return [];
  return getWeeklyNotificationsForUser(user.id);
}

export async function markNotificationRead(notificationId: string): Promise<{ error?: string }> {
  const user = await getUser();
  if (!user?.id) return { error: 'Unauthorized' };
  const { error } = await markReadDb(user.id, notificationId);
  if (error) return { error };
  revalidatePath('/dashboard');
  return {};
}
