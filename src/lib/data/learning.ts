import { randomBytes } from 'crypto';
import type { Database } from '@/types/database';
import type { Json } from '@/types/database';
import { createServerClient } from '@/lib/supabase/server';

export type LearningCardType = 'Module' | 'Case Study';

export interface LearningCardItem {
  id: string;
  type: LearningCardType;
  title: string;
  description: string;
  meta: string;
  progress: number;
  progressLabel: string;
  cta: 'Continue' | 'Start';
  ctaVariant?: 'primary' | 'secondary';
  href: string;
  certified?: boolean;
}

export interface LessonItem {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  body: string;
  hasVideo?: boolean;
  videoDuration?: string;
  lessonType: 'content' | 'quiz';
  questions?: QuizQuestion[];
}

export interface ModuleItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  lessons: LessonItem[];
  progress: number;
  progressLabel: string;
  passThresholdPercent?: number;
}

export interface CaseStudyStep {
  id: string;
  title: string;
  narrative: string;
  choices: { id: string; label: string; nextStepId: string; correct?: boolean }[];
}

export interface CaseStudyItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  steps: CaseStudyStep[];
  outcome: { title: string; body: string };
}

export type ContentType = 'pdf' | 'quiz' | 'video';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  meta: string;
  estimatedTime?: string;
  downloadUrl?: string;
  videoUrl?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; label: string; correct: boolean }[];
}

export interface ContentQuizItem extends ContentItem {
  type: 'quiz';
  questions: QuizQuestion[];
}

type LearningModulesRow = Database['public']['Tables']['learning_modules']['Row'];
type LearningLessonsRow = Database['public']['Tables']['learning_lessons']['Row'];
type LearningCaseStudiesRow = Database['public']['Tables']['learning_case_studies']['Row'];
type LearningCaseStudyStepsRow = Database['public']['Tables']['learning_case_study_steps']['Row'];
type LearningCaseStudyChoicesRow = Database['public']['Tables']['learning_case_study_choices']['Row'];
type LearningContentItemsRow = Database['public']['Tables']['learning_content_items']['Row'];

type QuizQuestionRaw = { id?: string; question?: string; options?: { id?: string; label?: string; correct?: boolean }[] };

function parseQuizQuestions(quizQuestions: Json | null): QuizQuestion[] | undefined {
  if (!quizQuestions) return undefined;
  const raw = quizQuestions as QuizQuestionRaw | QuizQuestionRaw[];
  const list = Array.isArray(raw) ? raw : [raw];
  if (list.length === 0) return undefined;
  return list.map((q, i) => ({
    id: q.id ?? `q${i}`,
    question: q.question ?? '',
    options: (q.options ?? []).map((o, j) => ({
      id: o.id ?? `o${j}`,
      label: o.label ?? '',
      correct: o.correct ?? false,
    })),
  }));
}

function lessonRowToItem(row: LearningLessonsRow, completed: boolean): LessonItem {
  const lessonType = (row.lesson_type === 'quiz' ? 'quiz' : 'content') as 'content' | 'quiz';
  const questions = lessonType === 'quiz' ? parseQuizQuestions(row.quiz_questions ?? null) : undefined;
  return {
    id: row.id,
    title: row.title,
    duration: row.duration ?? 'TBA',
    completed,
    body: row.body ?? '',
    hasVideo: row.has_video ?? false,
    videoDuration: row.video_duration ?? undefined,
    lessonType,
    questions,
  };
}

export async function getModules(): Promise<{ id: string; slug: string; title: string; description: string; lesson_count: number }[]> {
  const supabase = await createServerClient();
  const { data: modules, error: modError } = await supabase
    .from('learning_modules')
    .select('id, slug, title, description, sort_order')
    .order('sort_order', { ascending: true });

  if (modError || !modules?.length) return [];

  const withCount = await Promise.all(
    (modules as LearningModulesRow[]).map(async (mod) => {
      const { count } = await supabase
        .from('learning_lessons')
        .select('*', { count: 'exact', head: true })
        .eq('module_id', mod.id);
      return {
        id: mod.id,
        slug: mod.slug,
        title: mod.title,
        description: mod.description ?? '',
        lesson_count: count ?? 0,
      };
    })
  );
  return withCount;
}

export async function getCompletedLessonIds(userId: string): Promise<Set<string>> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('user_lesson_completions')
    .select('lesson_id')
    .eq('user_id', userId);
  const set = new Set<string>();
  (data ?? []).forEach((r: { lesson_id: string }) => set.add(r.lesson_id));
  return set;
}

export async function getModuleBySlug(slug: string, userId?: string | null): Promise<ModuleItem | null> {
  const supabase = await createServerClient();
  const { data: mod, error: modError } = await supabase
    .from('learning_modules')
    .select('*')
    .eq('slug', slug)
    .single();

  if (modError || !mod) return null;

  const { data: lessons, error: lessError } = await supabase
    .from('learning_lessons')
    .select('*')
    .eq('module_id', (mod as LearningModulesRow).id)
    .order('sort_order', { ascending: true });

  if (lessError) return null;

  const completedSet = userId ? await getCompletedLessonIds(userId) : new Set<string>();
  const lessonItems = (lessons as LearningLessonsRow[]).map((l) =>
    lessonRowToItem(l, completedSet.has(l.id))
  );
  const completedCount = lessonItems.filter((l) => l.completed).length;
  const total = lessonItems.length;
  const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const modRow = mod as LearningModulesRow;
  return {
    id: modRow.id,
    slug: modRow.slug,
    title: modRow.title,
    description: modRow.description ?? '',
    lessons: lessonItems,
    progress,
    progressLabel: total > 0 ? `${completedCount}/${total} lessons` : '0% complete',
    passThresholdPercent: modRow.pass_threshold_percent ?? 80,
  };
}

export async function getModuleById(id: string, userId?: string | null): Promise<ModuleItem | null> {
  const supabase = await createServerClient();
  const { data: mod, error: modError } = await supabase
    .from('learning_modules')
    .select('*')
    .eq('id', id)
    .single();

  if (modError || !mod) return null;
  return getModuleBySlug((mod as LearningModulesRow).slug, userId);
}

export async function getLessonById(lessonId: string, userId?: string | null): Promise<{ lesson: LessonItem; module: { id: string; slug: string; title: string } } | null> {
  const supabase = await createServerClient();
  const { data: lesson, error: lessError } = await supabase
    .from('learning_lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  if (lessError || !lesson) return null;

  const { data: mod, error: modError } = await supabase
    .from('learning_modules')
    .select('id, slug, title')
    .eq('id', (lesson as LearningLessonsRow).module_id)
    .single();

  if (modError || !mod) return null;

  const completedSet = userId ? await getCompletedLessonIds(userId) : new Set<string>();
  const modRow = mod as LearningModulesRow;
  return {
    lesson: lessonRowToItem(lesson as LearningLessonsRow, completedSet.has(lessonId)),
    module: { id: modRow.id, slug: modRow.slug, title: modRow.title },
  };
}

export async function getLesson(moduleSlug: string, lessonId: string, userId?: string | null): Promise<{ lesson: LessonItem; module: ModuleItem } | null> {
  const moduleData = await getModuleBySlug(moduleSlug, userId);
  if (!moduleData) return null;
  const lesson = moduleData.lessons.find((l) => l.id === lessonId);
  if (!lesson) return null;
  return { lesson, module: moduleData };
}

export async function getCaseStudies(): Promise<{ id: string; slug: string; title: string; description: string }[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('learning_case_studies')
    .select('id, slug, title, description')
    .order('sort_order', { ascending: true });

  if (error || !data) return [];
  return data as { id: string; slug: string; title: string; description: string }[];
}

export async function getCaseStudyById(id: string): Promise<CaseStudyItem | null> {
  const supabase = await createServerClient();
  const { data: cs, error: csError } = await supabase
    .from('learning_case_studies')
    .select('*')
    .eq('id', id)
    .single();

  if (csError || !cs) return null;

  const { data: steps, error: stepsError } = await supabase
    .from('learning_case_study_steps')
    .select('*')
    .eq('case_study_id', (cs as LearningCaseStudiesRow).id)
    .order('sort_order', { ascending: true });

  if (stepsError) return null;

  const stepIds = (steps as LearningCaseStudyStepsRow[]).map((s) => s.id);
  const { data: choices } = await supabase
    .from('learning_case_study_choices')
    .select('*')
    .in('step_id', stepIds.length ? stepIds : [''])
    .order('sort_order', { ascending: true });

  const choicesByStep = new Map<string, LearningCaseStudyChoicesRow[]>();
  (choices ?? []).forEach((c: LearningCaseStudyChoicesRow) => {
    const list = choicesByStep.get(c.step_id) ?? [];
    list.push(c);
    choicesByStep.set(c.step_id, list);
  });

  const stepsWithChoices: CaseStudyStep[] = (steps as LearningCaseStudyStepsRow[]).map((s) => ({
    id: s.step_key,
    title: s.title,
    narrative: s.narrative ?? '',
    choices: (choicesByStep.get(s.id) ?? []).map((c) => ({
      id: c.id,
      label: c.label,
      nextStepId: c.next_step_key,
      correct: c.correct ?? undefined,
    })),
  }));

  const row = cs as LearningCaseStudiesRow;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? '',
    steps: stepsWithChoices,
    outcome: {
      title: row.outcome_title ?? 'Complete',
      body: row.outcome_body ?? '',
    },
  };
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudyItem | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('learning_case_studies')
    .select('id')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return getCaseStudyById((data as { id: string }).id);
}

export async function getContentItems(): Promise<(ContentItem | ContentQuizItem)[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('learning_content_items')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error || !data) return [];
  return (data as LearningContentItemsRow[]).map(contentRowToItem);
}

export async function getContentById(id: string): Promise<ContentItem | ContentQuizItem | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('learning_content_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return contentRowToItem(data as LearningContentItemsRow);
}

function contentRowToItem(row: LearningContentItemsRow): ContentItem | ContentQuizItem {
  const base: ContentItem = {
    id: row.id,
    type: row.type as ContentType,
    title: row.title,
    description: row.description ?? '',
    meta: row.meta ?? '',
    estimatedTime: row.estimated_time ?? undefined,
    downloadUrl: row.download_url ?? undefined,
    videoUrl: row.video_url ?? undefined,
  };
  if (row.type === 'quiz' && row.quiz_questions && Array.isArray(row.quiz_questions)) {
    const questions = (row.quiz_questions as Json[]).map((q: any) => ({
      id: q.id ?? '',
      question: q.question ?? '',
      options: (q.options ?? []).map((o: any) => ({
        id: o.id ?? '',
        label: o.label ?? '',
        correct: !!o.correct,
      })),
    }));
    return { ...base, type: 'quiz', questions };
  }
  return base;
}

export async function getLearningCards(userId?: string | null): Promise<LearningCardItem[]> {
  const [modules, caseStudies, certifications] = await Promise.all([
    getModules(),
    getCaseStudies(),
    userId ? getUserCertifications(userId) : Promise.resolve([]),
  ]);
  const certifiedSet = new Set(certifications.map((c) => c.module_id));

  const cards: LearningCardItem[] = [];

  for (const mod of modules) {
    const full = await getModuleBySlug(mod.slug, userId);
    if (!full) continue;
    const completedCount = full.lessons.filter((l) => l.completed).length;
    const total = full.lessons.length;
    const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    cards.push({
      id: full.id,
      type: 'Module',
      title: full.title,
      description: full.description,
      meta: `${completedCount}/${total} lessons`,
      progress,
      progressLabel: total > 0 ? `${progress}% complete` : 'Not started',
      cta: progress > 0 ? 'Continue' : 'Start',
      ctaVariant: 'secondary',
      href: `/dashboard/learning/module/${full.slug}`,
      certified: certifiedSet.has(full.id),
    });
  }

  for (const cs of caseStudies) {
    cards.push({
      id: cs.id,
      type: 'Case Study',
      title: cs.title,
      description: cs.description,
      meta: 'New',
      progress: 0,
      progressLabel: 'Not started',
      cta: 'Start',
      ctaVariant: 'primary',
      href: `/dashboard/learning/case-study/${cs.id}`,
    });
  }

  return cards.sort((a, b) => (a.type === 'Module' ? -1 : 1) - (b.type === 'Module' ? -1 : 1));
}

export async function getWeeklyMaterials(): Promise<(ContentItem | ContentQuizItem)[]> {
  return getContentItems();
}

const CONTENT_QUIZ_PASS_PERCENT = 100;

export async function getContentQuizPassedIds(userId: string | null): Promise<Set<string>> {
  if (!userId) return new Set();
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('user_content_quiz_attempts')
    .select('content_item_id')
    .eq('user_id', userId)
    .eq('passed', true);
  const set = new Set<string>();
  (data ?? []).forEach((r: { content_item_id: string }) => set.add(r.content_item_id));
  return set;
}

export async function recordContentQuizAttempt(
  userId: string,
  contentItemId: string,
  scorePercent: number
): Promise<{ error: string | null }> {
  const passed = scorePercent >= CONTENT_QUIZ_PASS_PERCENT;
  const supabase = await createServerClient();
  const { error } = await (supabase as any).from('user_content_quiz_attempts').insert({
    user_id: userId,
    content_item_id: contentItemId,
    score_percent: scorePercent,
    passed,
    completed_at: new Date().toISOString(),
  });
  const msg = error?.message ?? (error ? String(error) : null);
  return { error: typeof msg === 'string' ? msg : null };
}

export async function markLessonComplete(userId: string, lessonId: string): Promise<{ error: string | null }> {
  const supabase = await createServerClient();
  const { error } = await (supabase as any).from('user_lesson_completions').upsert(
    { user_id: userId, lesson_id: lessonId, completed_at: new Date().toISOString() },
    { onConflict: 'user_id,lesson_id' }
  );
  const msg = error?.message ?? (error ? String(error) : null);
  return { error: typeof msg === 'string' ? msg : null };
}

export async function recordQuizAttempt(
  userId: string,
  lessonId: string,
  scorePercent: number,
  modulePassThreshold: number
): Promise<{ error: string | null }> {
  const supabase = await createServerClient();
  const passed = scorePercent >= modulePassThreshold;
  const { error } = await (supabase as any).from('user_quiz_attempts').insert({
    user_id: userId,
    lesson_id: lessonId,
    score_percent: scorePercent,
    passed,
    completed_at: new Date().toISOString(),
  });
  const msg = error?.message ?? (error ? String(error) : null);
  return { error: typeof msg === 'string' ? msg : null };
}

export async function checkAndGrantModuleCertification(userId: string, moduleId: string): Promise<{ error: string | null }> {
  const supabase = await createServerClient();
  const { data: lessons } = await supabase
    .from('learning_lessons')
    .select('id, lesson_type')
    .eq('module_id', moduleId);
  const steps = (lessons ?? []) as { id: string; lesson_type: string }[];
  if (steps.length === 0) return { error: null };

  const completed = await getCompletedLessonIds(userId);
  const quizStepIds = steps.filter((s) => s.lesson_type === 'quiz').map((s) => s.id);
  const allQuizPassedSync = await Promise.all(
    quizStepIds.map(async (lid) => {
      const { data: attempts } = await supabase
        .from('user_quiz_attempts')
        .select('passed')
        .eq('user_id', userId)
        .eq('lesson_id', lid);
      return (attempts ?? []).some((a: { passed: boolean }) => a.passed);
    })
  ).then((arr) => arr.every(Boolean));

  const allStepsComplete = steps.every((s) => completed.has(s.id));
  if (!allStepsComplete) return { error: null };
  if (quizStepIds.length > 0 && !allQuizPassedSync) return { error: null };

  const { error } = await (supabase as any).from('user_module_certifications').upsert(
    { user_id: userId, module_id: moduleId, certified_at: new Date().toISOString() },
    { onConflict: 'user_id,module_id' }
  );
  return { error: error?.message ?? null };
}

export async function getUserCertifications(userId: string): Promise<{ module_id: string; certified_at: string }[]> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('user_module_certifications')
    .select('module_id, certified_at')
    .eq('user_id', userId);
  return (data ?? []) as { module_id: string; certified_at: string }[];
}

export interface CertificationWithDetails {
  module_id: string;
  module_slug: string;
  module_title: string;
  certified_at: string;
}

export async function getCertificationsWithDetails(userId: string): Promise<CertificationWithDetails[]> {
  const certs = await getUserCertifications(userId);
  if (certs.length === 0) return [];
  const supabase = await createServerClient();
  const results: CertificationWithDetails[] = [];
  for (const c of certs) {
    const { data: mod } = await supabase
      .from('learning_modules')
      .select('id, slug, title')
      .eq('id', c.module_id)
      .single();
    if (mod) {
      const row = mod as { id: string; slug: string; title: string };
      results.push({
        module_id: row.id,
        module_slug: row.slug,
        module_title: row.title,
        certified_at: c.certified_at,
      });
    }
  }
  return results;
}

export interface CertificateData {
  userName: string;
  moduleTitle: string;
  moduleSlug: string;
  certifiedAt: string;
}

export async function getCertificateData(userId: string, moduleIdOrSlug: string): Promise<CertificateData | null> {
  const supabase = await createServerClient();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(moduleIdOrSlug);
  const moduleQuery = isUuid
    ? supabase.from('learning_modules').select('id, slug, title').eq('id', moduleIdOrSlug).single()
    : supabase.from('learning_modules').select('id, slug, title').eq('slug', moduleIdOrSlug).single();
  const { data: mod, error: modError } = await moduleQuery;
  if (modError || !mod) return null;
  const modRow = mod as { id: string; slug: string; title: string };
  const { data: cert } = await supabase
    .from('user_module_certifications')
    .select('certified_at')
    .eq('user_id', userId)
    .eq('module_id', modRow.id)
    .single();
  if (!cert) return null;
  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', userId).single();
  const fullName = (profile as { full_name: string | null } | null)?.full_name ?? 'Learner';
  return {
    userName: fullName,
    moduleTitle: modRow.title,
    moduleSlug: modRow.slug,
    certifiedAt: (cert as { certified_at: string }).certified_at,
  };
}

/** Public certificate by share token (no auth). Used for shareable links. */
export async function getCertificateByShareToken(token: string): Promise<CertificateData | null> {
  if (!token?.trim()) return null;
  const supabase = await createServerClient();
  const { data, error } = await (supabase as any).rpc('get_certificate_by_share_token', { p_token: token.trim() });
  if (error || data == null) return null;
  const raw = data as { userName?: string; moduleTitle?: string; moduleSlug?: string; certifiedAt?: string };
  if (!raw.moduleSlug || !raw.certifiedAt) return null;
  return {
    userName: raw.userName ?? 'Learner',
    moduleTitle: raw.moduleTitle ?? '',
    moduleSlug: raw.moduleSlug,
    certifiedAt: raw.certifiedAt,
  };
}

/** Ensure a share token exists for this certification; returns the token. */
export async function ensureCertificateShareToken(userId: string, moduleIdOrSlug: string): Promise<{ token: string; error: string | null }> {
  const supabase = await createServerClient();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(moduleIdOrSlug);
  const moduleQuery = isUuid
    ? supabase.from('learning_modules').select('id').eq('id', moduleIdOrSlug).single()
    : supabase.from('learning_modules').select('id').eq('slug', moduleIdOrSlug).single();
  const { data: mod, error: modError } = await moduleQuery;
  if (modError || !mod) return { token: '', error: 'Module not found' };
  const moduleId = (mod as { id: string }).id;
  const { data: existing } = await supabase
    .from('user_module_certifications')
    .select('share_token')
    .eq('user_id', userId)
    .eq('module_id', moduleId)
    .single();
  const existingToken = (existing as { share_token: string | null } | null)?.share_token;
  if (existingToken) return { token: existingToken, error: null };
  const token = randomBytes(16).toString('base64url');
  const { error: updateError } = await (supabase as any)
    .from('user_module_certifications')
    .update({ share_token: token })
    .eq('user_id', userId)
    .eq('module_id', moduleId);
  if (updateError) return { token: '', error: updateError.message };
  return { token, error: null };
}

// --- Admin mutations ---

export async function createModule(payload: { slug: string; title: string; description?: string; pass_threshold_percent?: number }): Promise<{ id: string; error: string | null }> {
  const supabase = await createServerClient();
  const { data, error } = await (supabase as any)
    .from('learning_modules')
    .insert({
      slug: payload.slug,
      title: payload.title,
      description: payload.description ?? null,
      pass_threshold_percent: payload.pass_threshold_percent ?? 80,
    })
    .select('id')
    .single();
  if (error) return { id: '', error: error.message };
  return { id: (data as { id: string }).id, error: null };
}

export async function updateModule(id: string, payload: { slug?: string; title?: string; description?: string; pass_threshold_percent?: number }): Promise<{ error: string | null }> {
  const supabase = await createServerClient();
  const { error } = await (supabase as any).from('learning_modules').update(payload).eq('id', id);
  return { error: error?.message ?? null };
}

export async function getModulePassThreshold(moduleId: string): Promise<number> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('learning_modules')
    .select('pass_threshold_percent')
    .eq('id', moduleId)
    .single();
  return (data as { pass_threshold_percent?: number } | null)?.pass_threshold_percent ?? 80;
}

export async function deleteModule(id: string): Promise<{ error: string | null }> {
  const supabase = await createServerClient();
  const { error } = await (supabase as any).from('learning_modules').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function createLesson(payload: {
  module_id: string;
  title: string;
  duration?: string;
  body?: string;
  has_video?: boolean;
  video_url?: string;
  video_duration?: string;
  lesson_type?: 'content' | 'quiz';
  quiz_questions?: Json;
  sort_order?: number;
}): Promise<{ id: string; error: string | null }> {
  const supabase = await createServerClient();
  const lessonType = payload.lesson_type ?? 'content';
  let sortOrder = payload.sort_order;
  if (sortOrder === undefined) {
    const { data: maxRow } = await supabase
      .from('learning_lessons')
      .select('sort_order')
      .eq('module_id', payload.module_id)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();
    sortOrder = maxRow ? (maxRow as { sort_order: number }).sort_order + 1 : 0;
  }
  const { data, error } = await (supabase as any)
    .from('learning_lessons')
    .insert({
      module_id: payload.module_id,
      title: payload.title,
      duration: payload.duration ?? null,
      body: payload.body ?? null,
      has_video: payload.has_video ?? false,
      video_url: payload.video_url ?? null,
      video_duration: payload.video_duration ?? null,
      lesson_type: lessonType,
      quiz_questions: lessonType === 'quiz' ? (payload.quiz_questions ?? null) : null,
      sort_order: sortOrder,
    })
    .select('id')
    .single();
  if (error) return { id: '', error: error.message };
  return { id: (data as { id: string }).id, error: null };
}

export async function updateLesson(id: string, payload: Partial<{
  title: string;
  duration: string;
  body: string;
  has_video: boolean;
  video_url: string;
  video_duration: string;
  lesson_type: 'content' | 'quiz';
  quiz_questions: Json;
  sort_order: number;
}>): Promise<{ error: string | null }> {
  const supabase = await createServerClient();
  const { error } = await (supabase as any).from('learning_lessons').update(payload).eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteLesson(id: string): Promise<{ error: string | null }> {
  const supabase = await createServerClient();
  const { error } = await (supabase as any).from('learning_lessons').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function createCaseStudy(payload: {
  slug: string;
  title: string;
  description?: string;
  outcome_title?: string;
  outcome_body?: string;
  steps?: { step_key: string; title: string; narrative?: string; choices: { label: string; next_step_key: string; correct?: boolean }[] }[];
}): Promise<{ id: string; error: string | null }> {
  const supabase = await createServerClient();
  const { data: cs, error: csError } = await (supabase as any)
    .from('learning_case_studies')
    .insert({
      slug: payload.slug,
      title: payload.title,
      description: payload.description ?? null,
      outcome_title: payload.outcome_title ?? null,
      outcome_body: payload.outcome_body ?? null,
    })
    .select('id')
    .single();

  if (csError || !cs) return { id: '', error: csError?.message ?? 'Failed' };

  const caseStudyId = (cs as { id: string }).id;
  const steps = payload.steps ?? [];
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    const { data: stepRow, error: stepError } = await (supabase as any)
      .from('learning_case_study_steps')
      .insert({ case_study_id: caseStudyId, step_key: s.step_key, title: s.title, narrative: s.narrative ?? null, sort_order: i })
      .select('id')
      .single();
    if (stepError || !stepRow) return { id: '', error: stepError?.message ?? 'Failed to create step' };
    const stepId = (stepRow as { id: string }).id;
    for (let j = 0; j < (s.choices ?? []).length; j++) {
      const c = s.choices[j];
      const { error: choiceError } = await (supabase as any)
        .from('learning_case_study_choices')
        .insert({ step_id: stepId, label: c.label, next_step_key: c.next_step_key, correct: c.correct ?? null, sort_order: j });
      if (choiceError) return { id: '', error: choiceError.message };
    }
  }
  return { id: caseStudyId, error: null };
}

export async function updateCaseStudy(id: string, payload: {
  slug?: string;
  title?: string;
  description?: string;
  outcome_title?: string;
  outcome_body?: string;
  steps?: { step_key: string; title: string; narrative?: string; choices: { label: string; next_step_key: string; correct?: boolean }[] }[];
}): Promise<{ error: string | null }> {
  const supabase = await createServerClient();
  const updatePayload: Record<string, unknown> = {};
  if (payload.slug !== undefined) updatePayload.slug = payload.slug;
  if (payload.title !== undefined) updatePayload.title = payload.title;
  if (payload.description !== undefined) updatePayload.description = payload.description;
  if (payload.outcome_title !== undefined) updatePayload.outcome_title = payload.outcome_title;
  if (payload.outcome_body !== undefined) updatePayload.outcome_body = payload.outcome_body;
  if (Object.keys(updatePayload).length > 0) {
    const { error } = await (supabase as any).from('learning_case_studies').update(updatePayload).eq('id', id);
    if (error) return { error: error.message };
  }
  if (payload.steps !== undefined) {
    const { data: existingSteps } = await supabase.from('learning_case_study_steps').select('id').eq('case_study_id', id);
    for (const row of existingSteps ?? []) {
      await (supabase as any).from('learning_case_study_choices').delete().eq('step_id', (row as { id: string }).id);
    }
    await (supabase as any).from('learning_case_study_steps').delete().eq('case_study_id', id);
    for (let i = 0; i < payload.steps.length; i++) {
      const s = payload.steps[i];
      const { data: stepRow, error: stepError } = await (supabase as any)
        .from('learning_case_study_steps')
        .insert({ case_study_id: id, step_key: s.step_key, title: s.title, narrative: s.narrative ?? null, sort_order: i })
        .select('id')
        .single();
      if (stepError || !stepRow) return { error: stepError?.message ?? 'Failed step' };
      const stepId = (stepRow as { id: string }).id;
      for (let j = 0; j < (s.choices ?? []).length; j++) {
        const c = s.choices[j];
        const { error: choiceError } = await (supabase as any)
          .from('learning_case_study_choices')
          .insert({ step_id: stepId, label: c.label, next_step_key: c.next_step_key, correct: c.correct ?? null, sort_order: j });
        if (choiceError) return { error: choiceError.message };
      }
    }
  }
  return { error: null };
}

export async function deleteCaseStudy(id: string): Promise<{ error: string | null }> {
  const supabase = await createServerClient();
  const { error } = await (supabase as any).from('learning_case_studies').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function createContentItem(payload: {
  type: ContentType;
  title: string;
  description?: string;
  meta?: string;
  estimated_time?: string;
  download_url?: string;
  video_url?: string;
  quiz_questions?: Json;
}): Promise<{ id: string; error: string | null }> {
  const supabase = await createServerClient();
  const { data: maxRow } = await supabase
    .from('learning_content_items')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSortOrder = maxRow ? (maxRow as { sort_order: number }).sort_order + 1 : 0;
  const { data, error } = await (supabase as any)
    .from('learning_content_items')
    .insert({
      type: payload.type,
      title: payload.title,
      description: payload.description ?? null,
      meta: payload.meta ?? null,
      estimated_time: payload.estimated_time ?? null,
      download_url: payload.download_url ?? null,
      video_url: payload.video_url ?? null,
      quiz_questions: payload.quiz_questions ?? null,
      sort_order: nextSortOrder,
    })
    .select('id')
    .single();
  if (error) return { id: '', error: error.message };
  return { id: (data as { id: string }).id, error: null };
}

export async function updateContentItem(id: string, payload: Partial<{
  type: ContentType;
  title: string;
  description: string;
  meta: string;
  estimated_time: string;
  download_url: string;
  video_url: string;
  quiz_questions: Json;
}>): Promise<{ error: string | null }> {
  const supabase = await createServerClient();
  const { error } = await (supabase as any).from('learning_content_items').update(payload).eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteContentItem(id: string): Promise<{ error: string | null }> {
  const supabase = await createServerClient();
  const { error } = await (supabase as any).from('learning_content_items').delete().eq('id', id);
  return { error: error?.message ?? null };
}
