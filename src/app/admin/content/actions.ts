'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import {
  createContentItem as createContentItemDb,
  updateContentItem as updateContentItemDb,
  deleteContentItem as deleteContentItemDb,
} from '@/lib/data/learning';
import type { ContentType } from '@/lib/data/learning';
import { createNotification } from '@/lib/data/notifications';

type QuizQuestionPayload = {
  id: string;
  question: string;
  options: { id: string; label: string; correct: boolean }[];
};

function parseQuizQuestionsJson(raw: string | null): QuizQuestionPayload[] | undefined {
  if (!raw || typeof raw !== 'string') return undefined;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return undefined;
    const result: QuizQuestionPayload[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== 'object' || typeof (item as QuizQuestionPayload).question !== 'string') continue;
      const q = item as QuizQuestionPayload;
      const rawOptions = Array.isArray(q.options) ? q.options : [];
      const options = rawOptions
        .filter((o: unknown) => o && typeof o === 'object' && typeof (o as { label?: string }).label === 'string' && (o as { label: string }).label.trim())
        .map((o: unknown, i: number) => {
          const opt = o as { id?: string; label?: string; correct?: boolean };
          return {
            id: typeof opt.id === 'string' ? opt.id : `o${i}`,
            label: String(opt.label).trim(),
            correct: Boolean(opt.correct),
          };
        });
      if (options.length >= 2) {
        result.push({
          id: typeof q.id === 'string' ? q.id : `q${result.length}`,
          question: String(q.question).trim(),
          options,
        });
      }
    }
    return result.length > 0 ? result : undefined;
  } catch {
    return undefined;
  }
}

function parseContentFormData(formData: FormData): {
  type: ContentType;
  title: string;
  description?: string;
  meta?: string;
  estimated_time?: string;
  download_url?: string;
  video_url?: string;
  quiz_questions?: QuizQuestionPayload[];
} {
  const type = (formData.get('type') as string) || 'pdf';
  const validType: ContentType = type === 'quiz' || type === 'video' ? type : 'pdf';
  const title = (formData.get('title') as string)?.trim() ?? '';
  const description = (formData.get('description') as string)?.trim() ?? '';
  const meta = (formData.get('meta') as string)?.trim() ?? '';
  const estimatedTime = (formData.get('estimatedTime') as string)?.trim() ?? '';
  const downloadUrl = (formData.get('downloadUrl') as string)?.trim() ?? '';
  const videoUrl = (formData.get('videoUrl') as string)?.trim() ?? '';
  let quiz_questions: QuizQuestionPayload[] | undefined;
  if (validType === 'quiz') {
    const json = formData.get('quiz_questions_json') as string | null;
    quiz_questions = parseQuizQuestionsJson(json) ?? undefined;
  }
  return {
    type: validType,
    title,
    description: description || undefined,
    meta: meta || undefined,
    estimated_time: estimatedTime || undefined,
    download_url: downloadUrl || undefined,
    video_url: videoUrl || undefined,
    quiz_questions,
  };
}

export async function createContentItem(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const parsed = parseContentFormData(formData);
  if (!parsed.title) return { success: false, error: 'Title is required' };
  if (parsed.type === 'quiz' && (!parsed.quiz_questions || parsed.quiz_questions.length === 0)) {
    return { success: false, error: 'At least one question with two options is required.' };
  }
  const { id, error } = await createContentItemDb({
    ...parsed,
    quiz_questions: parsed.quiz_questions as import('@/types/database').Json | undefined,
  });
  if (error) return { success: false, error };
  if (id) {
    const label = parsed.type === 'quiz' ? 'New quiz' : parsed.type === 'video' ? 'New video' : 'New tutorial';
    await createNotification({
      type: 'content',
      title: `${label}: ${parsed.title}`,
      link: `/dashboard/learning/content/${id}`,
      reference_id: id,
    });
  }
  revalidatePath('/admin/content');
  revalidatePath('/dashboard/learning');
  redirect('/admin/content?created=1');
}

export async function updateContentItem(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const id = formData.get('id') as string;
  if (!id) return { success: false, error: 'Missing id' };
  const parsed = parseContentFormData(formData);
  if (!parsed.title) return { success: false, error: 'Title is required' };
  if (parsed.type === 'quiz' && (!parsed.quiz_questions || parsed.quiz_questions.length === 0)) {
    return { success: false, error: 'At least one question with two options is required.' };
  }
  const { error } = await updateContentItemDb(id, {
    type: parsed.type,
    title: parsed.title,
    description: parsed.description,
    meta: parsed.meta,
    estimated_time: parsed.estimated_time,
    download_url: parsed.download_url,
    video_url: parsed.video_url,
    quiz_questions: parsed.quiz_questions as import('@/types/database').Json | undefined,
  });
  if (error) return { success: false, error };
  revalidatePath('/admin/content');
  revalidatePath('/dashboard/learning');
  redirect('/admin/content?updated=1');
}

export async function deleteContentItem(id: string): Promise<void> {
  await requireAdmin();
  if (!id) return;
  const { error } = await deleteContentItemDb(id);
  if (error) {
    redirect('/admin/content?delete_error=1');
  }
  revalidatePath('/admin/content');
  revalidatePath('/dashboard/learning');
  redirect('/admin/content?deleted=1');
}
