'use server';

import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/requireAdmin';

export async function createModule(_prev: unknown, formData: FormData): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const title = (formData.get('title') as string)?.trim() ?? '';
  const slug = (formData.get('slug') as string)?.trim() ?? '';
  if (!title || !slug) return { success: false, error: 'Title and slug are required' };
  redirect('/admin/learning/modules?created=1');
}

export async function updateModule(_prev: unknown, formData: FormData): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const id = formData.get('id') as string;
  if (!id) return { success: false, error: 'Missing id' };
  redirect(`/admin/learning/modules?updated=1`);
}

export async function createLesson(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const moduleId = formData.get('moduleId') as string;
  if (!moduleId) return { success: false, error: 'Missing moduleId' };
  redirect(`/admin/learning/modules/${moduleId}/lessons?created=1`);
}

export async function updateLesson(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const moduleId = formData.get('moduleId') as string;
  if (!moduleId) return { success: false, error: 'Missing moduleId' };
  redirect(`/admin/learning/modules/${moduleId}/lessons?updated=1`);
}

export async function createCaseStudy(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  redirect('/admin/learning/case-studies?created=1');
}

export async function updateCaseStudy(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const id = formData.get('id') as string;
  if (!id) return { success: false, error: 'Missing id' };
  redirect('/admin/learning/case-studies?updated=1');
}
