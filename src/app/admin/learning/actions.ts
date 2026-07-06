'use server';

import type { Json } from '@/types/database';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import {
  createModule as createModuleDb,
  updateModule as updateModuleDb,
  deleteModule as deleteModuleDb,
  createLesson as createLessonDb,
  updateLesson as updateLessonDb,
  deleteLesson as deleteLessonDb,
  createCaseStudy as createCaseStudyDb,
  updateCaseStudy as updateCaseStudyDb,
  deleteCaseStudy as deleteCaseStudyDb,
  getModuleById,
} from '@/lib/data/learning';
import { createNotification } from '@/lib/data/notifications';
import { titleToSlug } from '@/lib/utils/slug';
import { moduleSchema, lessonSchema, caseStudySchema, formatZodFieldErrors } from '@/lib/validations/admin';
import type { AdminActionResult } from '@/types/actions';

function parseLessonQuizFormData(formData: FormData): Json | null {
  const countRaw = formData.get('quiz_question_count');
  const count = Math.min(50, Math.max(1, parseInt(String(countRaw ?? 1), 10) || 1));
  const questions: { id: string; question: string; options: { id: string; label: string; correct: boolean }[] }[] = [];
  for (let n = 1; n <= count; n++) {
    const questionText = (formData.get(`question_${n}`) as string)?.trim();
    if (!questionText) continue;
    const optionCountRaw = formData.get(`q${n}_option_count`);
    const optionCount = Math.min(6, Math.max(2, parseInt(String(optionCountRaw ?? 2), 10) || 2));
    const options: { id: string; label: string; correct: boolean }[] = [];
    for (let optionIndex = 1; optionIndex <= optionCount; optionIndex++) {
      const label = (formData.get(`q${n}_option_${optionIndex}_label`) as string)?.trim();
      if (!label) continue;
      options.push({
        id: String.fromCharCode(96 + optionIndex),
        label,
        correct: formData.get(`q${n}_option_${optionIndex}_correct`) === 'on',
      });
    }
    if (options.length < 2) continue;
    questions.push({
      id: `q${n}`,
      question: questionText,
      options,
    });
  }
  if (questions.length === 0) return null;
  return questions as Json;
}

export async function createModule(_prev: unknown, formData: FormData): Promise<AdminActionResult> {
  await requireAdmin();
  const raw = {
    title: ((formData.get('title') as string) ?? '').trim(),
    description: ((formData.get('description') as string) ?? '').trim(),
    pass_threshold_percent: formData.get('pass_threshold_percent') ? parseInt(String(formData.get('pass_threshold_percent')), 10) : 80,
  };
  const parsed = moduleSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Please fix the errors below.', fieldErrors: formatZodFieldErrors(parsed.error) };
  }
  const { title, description, pass_threshold_percent } = parsed.data;
  const slug = titleToSlug(title);
  if (!slug) return { success: false, error: 'Title must contain at least one letter or number.' };
  const { id, error } = await createModuleDb({ slug, title, description: description || undefined, pass_threshold_percent });
  if (error) return { success: false, error };
  await createNotification({
    type: 'module',
    title: `New module: ${title}`,
    link: `/dashboard/learning/module/${slug}`,
    reference_id: id,
  });
  try {
    const { sendMarketingEmailToAll } = await import('@/lib/email/send-marketing-email');
    await sendMarketingEmailToAll({
      contentType: 'module',
      contentTitle: title,
      contentDescription: description || undefined,
      ctaUrl: `/dashboard/learning/module/${slug}`,
      ctaLabel: 'Start Learning',
    });
  } catch (err) {
    console.error('[marketing-email] module email failed:', err);
  }
  redirect(`/admin/learning/modules/${id}/lessons?module_created=1`);
}

export async function updateModule(_prev: unknown, formData: FormData): Promise<AdminActionResult> {
  await requireAdmin();
  const id = formData.get('id') as string;
  if (!id) return { success: false, error: 'Missing id' };
  const raw = {
    title: ((formData.get('title') as string) ?? '').trim(),
    description: ((formData.get('description') as string) ?? '').trim(),
    pass_threshold_percent: formData.get('pass_threshold_percent') ? parseInt(String(formData.get('pass_threshold_percent')), 10) : 80,
  };
  const parsed = moduleSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Please fix the errors below.', fieldErrors: formatZodFieldErrors(parsed.error) };
  }
  const { title, description, pass_threshold_percent } = parsed.data;
  const slug = ((formData.get('slug') as string) ?? '').trim().toLowerCase().replace(/\s+/g, '-') || titleToSlug(title);
  const updatePayload: { slug: string; title: string; description?: string; pass_threshold_percent?: number } = {
    slug,
    title,
    description: description || undefined,
    pass_threshold_percent,
  };
  const { error } = await updateModuleDb(id, updatePayload);
  if (error) return { success: false, error };
  redirect('/admin/learning/modules?updated=1');
}

export async function createLesson(
  _prev: unknown,
  formData: FormData
): Promise<AdminActionResult> {
  await requireAdmin();
  const moduleId = formData.get('moduleId') as string;
  if (!moduleId) return { success: false, error: 'Missing moduleId' };
  const raw = {
    title: ((formData.get('title') as string) ?? '').trim(),
    stepType: (formData.get('stepType') as string) === 'quiz' ? 'quiz' as const : 'content' as const,
    duration: ((formData.get('duration') as string) ?? '').trim(),
    body: ((formData.get('body') as string) ?? '').trim(),
    hasVideo: formData.get('hasVideo') === 'on' || formData.get('hasVideo') === 'true',
    videoUrl: ((formData.get('videoUrl') as string) ?? '').trim(),
    videoDuration: ((formData.get('videoDuration') as string) ?? '').trim(),
  };
  const parsed = lessonSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Please fix the errors below.', fieldErrors: formatZodFieldErrors(parsed.error) };
  }
  const { title, stepType, duration, body, hasVideo, videoUrl, videoDuration } = parsed.data;
  const quiz_questions = stepType === 'quiz' ? parseLessonQuizFormData(formData) : undefined;
  if (stepType === 'quiz' && !quiz_questions) {
    return { success: false, error: 'At least one question with two options and a correct answer is required.' };
  }
  const { error } = await createLessonDb({
    module_id: moduleId,
    title,
    duration: duration || undefined,
    body: body || undefined,
    has_video: hasVideo,
    video_url: videoUrl || undefined,
    video_duration: videoDuration || undefined,
    lesson_type: stepType,
    quiz_questions: quiz_questions ?? undefined,
  });
  if (error) return { success: false, error };
  const moduleData = await getModuleById(moduleId);
  if (moduleData) {
    await createNotification({
      type: 'lesson',
      title: stepType === 'quiz' ? `New quiz: ${title}` : `New lesson: ${title}`,
      link: `/dashboard/learning/module/${moduleData.slug}`,
      reference_id: moduleId,
    });
    try {
      const { sendMarketingEmailToAll } = await import('@/lib/email/send-marketing-email');
      await sendMarketingEmailToAll({
        contentType: 'lesson',
        contentTitle: title,
        ctaUrl: `/dashboard/learning/module/${moduleData.slug}`,
        ctaLabel: stepType === 'quiz' ? 'Take the Quiz' : 'View Lesson',
      });
    } catch (err) {
      console.error('[marketing-email] lesson email failed:', err);
    }
  }
  redirect(`/admin/learning/modules/${moduleId}/lessons?created=1`);
}

export async function updateLesson(
  _prev: unknown,
  formData: FormData
): Promise<AdminActionResult> {
  await requireAdmin();
  const moduleId = formData.get('moduleId') as string;
  const lessonId = formData.get('lessonId') as string;
  if (!moduleId || !lessonId) return { success: false, error: 'Missing moduleId or lessonId' };
  const raw = {
    title: ((formData.get('title') as string) ?? '').trim(),
    stepType: (formData.get('stepType') as string) === 'quiz' ? 'quiz' as const : 'content' as const,
    duration: ((formData.get('duration') as string) ?? '').trim(),
    body: ((formData.get('body') as string) ?? '').trim(),
    hasVideo: formData.get('hasVideo') === 'on' || formData.get('hasVideo') === 'true',
    videoUrl: ((formData.get('videoUrl') as string) ?? '').trim(),
    videoDuration: ((formData.get('videoDuration') as string) ?? '').trim(),
  };
  const parsed = lessonSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Please fix the errors below.', fieldErrors: formatZodFieldErrors(parsed.error) };
  }
  const { title, stepType, duration, body, hasVideo, videoUrl, videoDuration } = parsed.data;
  const quiz_questions = stepType === 'quiz' ? parseLessonQuizFormData(formData) : undefined;
  if (stepType === 'quiz' && !quiz_questions) {
    return { success: false, error: 'At least one question with two options and a correct answer is required.' };
  }
  const payload: {
    title: string;
    duration?: string;
    body?: string;
    has_video: boolean;
    video_url?: string;
    video_duration?: string;
    lesson_type: 'content' | 'quiz';
    quiz_questions?: Json | null;
  } = {
    title,
    duration: duration || undefined,
    body: body || undefined,
    has_video: hasVideo,
    video_url: videoUrl || undefined,
    video_duration: videoDuration || undefined,
    lesson_type: stepType,
  };
  if (stepType === 'quiz') payload.quiz_questions = quiz_questions ?? null;
  else payload.quiz_questions = null;
  const { error } = await updateLessonDb(lessonId, payload);
  if (error) return { success: false, error };
  redirect(`/admin/learning/modules/${moduleId}/lessons?updated=1`);
}

export async function createCaseStudy(
  _prev: unknown,
  formData: FormData
): Promise<AdminActionResult> {
  await requireAdmin();
  const raw = {
    slug: ((formData.get('slug') as string) ?? '').trim().toLowerCase().replace(/\s+/g, '-'),
    title: ((formData.get('title') as string) ?? '').trim(),
    description: ((formData.get('description') as string) ?? '').trim(),
    outcome_title: ((formData.get('outcome_title') as string) ?? '').trim(),
    outcome_body: ((formData.get('outcome_body') as string) ?? '').trim(),
  };
  const parsed = caseStudySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Please fix the errors below.', fieldErrors: formatZodFieldErrors(parsed.error) };
  }
  const { slug, title, description, outcome_title, outcome_body } = parsed.data;
  const stepsJson = formData.get('steps') as string | null;
  let steps: { step_key: string; title: string; narrative?: string; choices: { label: string; next_step_key: string; correct?: boolean }[] }[] = [];
  if (stepsJson) {
    try {
      steps = JSON.parse(stepsJson) as typeof steps;
    } catch {
      // ignore
    }
  }
  const { id, error } = await createCaseStudyDb({
    slug,
    title,
    description: description || undefined,
    outcome_title: outcome_title || undefined,
    outcome_body: outcome_body || undefined,
    steps: steps.length ? steps : undefined,
  });
  if (error) return { success: false, error };
  if (id) {
    await createNotification({
      type: 'case_study',
      title: `New case study: ${title}`,
      link: `/dashboard/learning/case-study/${id}`,
      reference_id: id,
    });
    try {
      const { sendMarketingEmailToAll } = await import('@/lib/email/send-marketing-email');
      await sendMarketingEmailToAll({
        contentType: 'case study',
        contentTitle: title,
        contentDescription: description || undefined,
        ctaUrl: `/dashboard/learning/case-study/${id}`,
        ctaLabel: 'Explore Case Study',
      });
    } catch (err) {
      console.error('[marketing-email] case study email failed:', err);
    }
  }
  redirect('/admin/learning/case-studies?created=1');
}

export async function updateCaseStudy(
  _prev: unknown,
  formData: FormData
): Promise<AdminActionResult> {
  await requireAdmin();
  const id = formData.get('id') as string;
  if (!id) return { success: false, error: 'Missing id' };
  const raw = {
    slug: ((formData.get('slug') as string) ?? '').trim().toLowerCase().replace(/\s+/g, '-'),
    title: ((formData.get('title') as string) ?? '').trim(),
    description: ((formData.get('description') as string) ?? '').trim(),
    outcome_title: ((formData.get('outcome_title') as string) ?? '').trim(),
    outcome_body: ((formData.get('outcome_body') as string) ?? '').trim(),
  };
  const parsed = caseStudySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Please fix the errors below.', fieldErrors: formatZodFieldErrors(parsed.error) };
  }
  const { slug, title, description, outcome_title, outcome_body } = parsed.data;
  const stepsJson = formData.get('steps') as string | null;
  let steps: { step_key: string; title: string; narrative?: string; choices: { label: string; next_step_key: string; correct?: boolean }[] }[] = [];
  if (stepsJson) {
    try {
      steps = JSON.parse(stepsJson) as typeof steps;
    } catch {
      // ignore
    }
  }
  const { error } = await updateCaseStudyDb(id, {
    slug,
    title,
    description: description || undefined,
    outcome_title: outcome_title || undefined,
    outcome_body: outcome_body || undefined,
    steps: steps.length ? steps : undefined,
  });
  if (error) return { success: false, error };
  redirect('/admin/learning/case-studies?updated=1');
}

export async function deleteModule(id: string): Promise<void> {
  await requireAdmin();
  if (!id) return;
  const { error } = await deleteModuleDb(id);
  if (error) {
    redirect('/admin/learning/modules?delete_error=1');
  }
  revalidatePath('/admin/learning/modules');
  revalidatePath('/dashboard/learning');
  redirect('/admin/learning/modules?deleted=1');
}

export async function deleteLesson(moduleId: string, lessonId: string): Promise<void> {
  await requireAdmin();
  if (!moduleId || !lessonId) return;
  const { error } = await deleteLessonDb(lessonId);
  if (error) {
    redirect(`/admin/learning/modules/${moduleId}/lessons?delete_error=1`);
  }
  revalidatePath(`/admin/learning/modules/${moduleId}/lessons`);
  revalidatePath('/dashboard/learning');
  redirect(`/admin/learning/modules/${moduleId}/lessons?deleted=1`);
}

export async function deleteCaseStudy(id: string): Promise<void> {
  await requireAdmin();
  if (!id) return;
  const { error } = await deleteCaseStudyDb(id);
  if (error) {
    redirect('/admin/learning/case-studies?delete_error=1');
  }
  revalidatePath('/admin/learning/case-studies');
  revalidatePath('/dashboard/learning');
  redirect('/admin/learning/case-studies?deleted=1');
}
