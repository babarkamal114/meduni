'use server';

import type { Json } from '@/types/database';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import {
  createModule as createModuleDb,
  updateModule as updateModuleDb,
  createLesson as createLessonDb,
  updateLesson as updateLessonDb,
  createCaseStudy as createCaseStudyDb,
  updateCaseStudy as updateCaseStudyDb,
  getModuleById,
} from '@/lib/data/learning';
import { createNotification } from '@/lib/data/notifications';

function parseLessonQuizFormData(formData: FormData): Json | null {
  const countRaw = formData.get('quiz_question_count');
  const count = Math.min(50, Math.max(1, parseInt(String(countRaw ?? 1), 10) || 1));
  const questions: { id: string; question: string; options: { id: string; label: string; correct: boolean }[] }[] = [];
  for (let n = 1; n <= count; n++) {
    const questionText = (formData.get(`question_${n}`) as string)?.trim();
    if (!questionText) continue;
    const o1Label = (formData.get(`q${n}_option_1_label`) as string)?.trim();
    const o2Label = (formData.get(`q${n}_option_2_label`) as string)?.trim();
    const o1Correct = formData.get(`q${n}_option_1_correct`) === 'on';
    const o2Correct = formData.get(`q${n}_option_2_correct`) === 'on';
    questions.push({
      id: `q${n}`,
      question: questionText,
      options: [
        { id: 'a', label: o1Label || 'Option A', correct: o1Correct },
        { id: 'b', label: o2Label || 'Option B', correct: o2Correct },
      ],
    });
  }
  if (questions.length === 0) return null;
  return questions as Json;
}

export async function createModule(_prev: unknown, formData: FormData): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const title = (formData.get('title') as string)?.trim() ?? '';
  const slug = (formData.get('slug') as string)?.trim()?.toLowerCase().replace(/\s+/g, '-') ?? '';
  const description = (formData.get('description') as string)?.trim() ?? '';
  const passThresholdRaw = formData.get('pass_threshold_percent');
  const pass_threshold_percent = passThresholdRaw ? Math.min(100, Math.max(1, parseInt(String(passThresholdRaw), 10) || 80)) : 80;
  if (!title || !slug) return { success: false, error: 'Title and slug are required' };
  const { id, error } = await createModuleDb({ slug, title, description: description || undefined, pass_threshold_percent });
  if (error) return { success: false, error };
  await createNotification({
    type: 'module',
    title: `New module: ${title}`,
    link: `/dashboard/learning/module/${slug}`,
    reference_id: id,
  });
  redirect('/admin/learning/modules?created=1');
}

export async function updateModule(_prev: unknown, formData: FormData): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const id = formData.get('id') as string;
  const title = (formData.get('title') as string)?.trim() ?? '';
  const slug = (formData.get('slug') as string)?.trim()?.toLowerCase().replace(/\s+/g, '-') ?? '';
  const description = (formData.get('description') as string)?.trim() ?? '';
  const passThresholdRaw = formData.get('pass_threshold_percent');
  const pass_threshold_percent = passThresholdRaw ? Math.min(100, Math.max(1, parseInt(String(passThresholdRaw), 10) || 80)) : undefined;
  if (!id) return { success: false, error: 'Missing id' };
  if (!title || !slug) return { success: false, error: 'Title and slug are required' };
  const updatePayload: { slug: string; title: string; description?: string; pass_threshold_percent?: number } = { slug, title, description: description || undefined };
  if (pass_threshold_percent !== undefined) updatePayload.pass_threshold_percent = pass_threshold_percent;
  const { error } = await updateModuleDb(id, updatePayload);
  if (error) return { success: false, error };
  redirect('/admin/learning/modules?updated=1');
}

export async function createLesson(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const moduleId = formData.get('moduleId') as string;
  const title = (formData.get('title') as string)?.trim() ?? '';
  const stepType = (formData.get('stepType') as string) === 'quiz' ? 'quiz' : 'content';
  if (!moduleId) return { success: false, error: 'Missing moduleId' };
  if (!title) return { success: false, error: 'Title is required' };
  const duration = (formData.get('duration') as string)?.trim() ?? '';
  const body = (formData.get('body') as string)?.trim() ?? '';
  const hasVideo = formData.get('hasVideo') === 'on' || formData.get('hasVideo') === 'true';
  const videoUrl = (formData.get('videoUrl') as string)?.trim() ?? '';
  const videoDuration = (formData.get('videoDuration') as string)?.trim() ?? '';
  const quiz_questions = stepType === 'quiz' ? parseLessonQuizFormData(formData) : undefined;
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
  }
  redirect(`/admin/learning/modules/${moduleId}/lessons?created=1`);
}

export async function updateLesson(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const moduleId = formData.get('moduleId') as string;
  const lessonId = formData.get('lessonId') as string;
  const title = (formData.get('title') as string)?.trim() ?? '';
  const stepType = (formData.get('stepType') as string) === 'quiz' ? 'quiz' : 'content';
  if (!moduleId || !lessonId) return { success: false, error: 'Missing moduleId or lessonId' };
  if (!title) return { success: false, error: 'Title is required' };
  const duration = (formData.get('duration') as string)?.trim() ?? '';
  const body = (formData.get('body') as string)?.trim() ?? '';
  const hasVideo = formData.get('hasVideo') === 'on' || formData.get('hasVideo') === 'true';
  const videoUrl = (formData.get('videoUrl') as string)?.trim() ?? '';
  const videoDuration = (formData.get('videoDuration') as string)?.trim() ?? '';
  const quiz_questions = stepType === 'quiz' ? parseLessonQuizFormData(formData) : undefined;
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
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const slug = (formData.get('slug') as string)?.trim()?.toLowerCase().replace(/\s+/g, '-') ?? '';
  const title = (formData.get('title') as string)?.trim() ?? '';
  const description = (formData.get('description') as string)?.trim() ?? '';
  const outcomeTitle = (formData.get('outcome_title') as string)?.trim() ?? '';
  const outcomeBody = (formData.get('outcome_body') as string)?.trim() ?? '';
  if (!slug || !title) return { success: false, error: 'Slug and title are required' };
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
    outcome_title: outcomeTitle || undefined,
    outcome_body: outcomeBody || undefined,
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
  }
  redirect('/admin/learning/case-studies?created=1');
}

export async function updateCaseStudy(
  _prev: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const id = formData.get('id') as string;
  const slug = (formData.get('slug') as string)?.trim()?.toLowerCase().replace(/\s+/g, '-') ?? '';
  const title = (formData.get('title') as string)?.trim() ?? '';
  const description = (formData.get('description') as string)?.trim() ?? '';
  const outcomeTitle = (formData.get('outcome_title') as string)?.trim() ?? '';
  const outcomeBody = (formData.get('outcome_body') as string)?.trim() ?? '';
  if (!id) return { success: false, error: 'Missing id' };
  if (!slug || !title) return { success: false, error: 'Slug and title are required' };
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
    outcome_title: outcomeTitle || undefined,
    outcome_body: outcomeBody || undefined,
    steps: steps.length ? steps : undefined,
  });
  if (error) return { success: false, error };
  redirect('/admin/learning/case-studies?updated=1');
}
