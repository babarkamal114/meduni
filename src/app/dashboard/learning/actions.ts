'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth/requireUser';
import {
  markLessonComplete as markLessonCompleteDb,
  recordQuizAttempt,
  recordContentQuizAttempt,
  checkAndGrantModuleCertification,
  getModulePassThreshold,
  getLessonById,
  ensureCertificateShareToken,
} from '@/lib/data/learning';
import { siteConfig } from '@/config/site';

export async function markLessonComplete(lessonId: string): Promise<{ error: string | null }> {
  const user = await requireUser();
  const result = await markLessonCompleteDb(user.id, lessonId);
  if (result.error) return result;

  const lessonData = await getLessonById(lessonId, user.id);
  if (lessonData) {
    await checkAndGrantModuleCertification(user.id, lessonData.module.id);
    revalidatePath('/dashboard/certificates');
  }
  return result;
}

export async function markLessonCompleteAndRevalidate(lessonId: string, moduleSlug: string): Promise<{ error: string | null }> {
  const result = await markLessonComplete(lessonId);
  if (!result.error) {
    revalidatePath('/dashboard/learning');
    revalidatePath(`/dashboard/learning/module/${moduleSlug}`);
    revalidatePath(`/dashboard/learning/module/${moduleSlug}/lesson/${lessonId}`);
  }
  return result;
}

export async function submitQuizAttempt(lessonId: string, scorePercent: number): Promise<{ error: string | null; passed: boolean }> {
  const user = await requireUser();
  const lessonData = await getLessonById(lessonId, user.id);
  if (!lessonData) return { error: 'Lesson not found', passed: false };
  const moduleId = lessonData.module.id;
  const threshold = await getModulePassThreshold(moduleId);
  const passed = scorePercent >= threshold;

  const recordResult = await recordQuizAttempt(user.id, lessonId, scorePercent, threshold);
  if (recordResult.error) return { error: typeof recordResult.error === 'string' ? recordResult.error : String(recordResult.error), passed: false };

  if (passed) {
    const markResult = await markLessonCompleteDb(user.id, lessonId);
    if (markResult.error) return { error: typeof markResult.error === 'string' ? markResult.error : String(markResult.error), passed: false };
    await checkAndGrantModuleCertification(user.id, moduleId);
  }

  const moduleSlug = lessonData.module.slug;
  revalidatePath('/dashboard/learning');
  revalidatePath(`/dashboard/learning/module/${moduleSlug}`);
  revalidatePath(`/dashboard/learning/module/${moduleSlug}/lesson/${lessonId}`);
  return { error: null, passed };
}

export async function submitContentQuizAttempt(
  contentItemId: string,
  score: number,
  total: number
): Promise<{ error: string | null; passed: boolean }> {
  const user = await requireUser();
  const scorePercent = total > 0 ? Math.round((score / total) * 100) : 0;
  const result = await recordContentQuizAttempt(user.id, contentItemId, scorePercent);
  if (result.error) return { error: result.error, passed: false };
  revalidatePath('/dashboard/learning');
  revalidatePath(`/dashboard/learning/content/${contentItemId}`);
  return { error: null, passed: scorePercent >= 100 };
}

export async function getOrCreateShareLink(moduleId: string): Promise<{ url?: string; error?: string }> {
  const user = await requireUser();
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const { token, error } = await ensureCertificateShareToken(user.id, moduleId);
  if (error) return { error };
  return { url: `${baseUrl}/certificate/${token}` };
}
