'use server';

import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import type { WebinarStatus } from '@/lib/data/mock-webinars';

export type WebinarFormState = {
  title: string;
  slug: string;
  expert: string;
  duration: string;
  price: string;
  status: WebinarStatus;
  statusLabel: string;
  scheduledAt: string;
  hasReplay: boolean;
};

export async function createWebinar(_prev: unknown, formData: FormData): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const title = (formData.get('title') as string)?.trim() ?? '';
  const slug = (formData.get('slug') as string)?.trim() ?? '';
  const expert = (formData.get('expert') as string)?.trim() ?? '';
  const duration = (formData.get('duration') as string)?.trim() ?? '';
  const price = (formData.get('price') as string)?.trim() ?? '';
  const status = (formData.get('status') as WebinarStatus) ?? 'upcoming';
  const statusLabel = (formData.get('statusLabel') as string)?.trim() ?? '';
  const scheduledAt = (formData.get('scheduledAt') as string) ?? '';
  const hasReplay = formData.get('hasReplay') === 'on';
  if (!title || !slug) return { success: false, error: 'Title and slug are required' };
  // Placeholder: no persistence. Redirect to list.
  redirect('/admin/webinars?created=1');
}

export async function updateWebinar(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const id = formData.get('id') as string;
  if (!id) return { success: false, error: 'Missing id' };
  // Placeholder: no persistence.
  redirect(`/admin/webinars?updated=1`);
}

export async function deleteWebinar(id: string): Promise<void> {
  await requireAdmin();
  if (!id) return;
  redirect('/admin/webinars?deleted=1');
}
