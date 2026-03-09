'use server';

import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/requireAdmin';

export async function createContentItem(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const type = formData.get('type') as string;
  if (!type) return { success: false, error: 'Type is required' };
  redirect('/admin/content?created=1');
}

export async function updateContentItem(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const id = formData.get('id') as string;
  if (!id) return { success: false, error: 'Missing id' };
  redirect('/admin/content?updated=1');
}

export async function deleteContentItem(id: string): Promise<void> {
  await requireAdmin();
  if (!id) return;
  redirect('/admin/content?deleted=1');
}
