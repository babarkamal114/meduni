import { createServerClient } from '@/lib/supabase/server';
import {
  getWebinars,
  getPurchasedWebinarSlugsForUser,
  withPurchased,
  type Webinar,
} from '@/lib/data/webinars';

/**
 * Parse lesson duration string to minutes. Supports "15 min", "90 min", "1 hour", "1.5 hours", "1", "TBA".
 */
export function parseLessonDurationToMinutes(duration: string | null): number {
  if (!duration || !duration.trim()) return 0;
  const s = duration.trim().toLowerCase();
  if (s === 'tba' || s === '') return 0;
  const minMatch = s.match(/^(\d+(?:\.\d+)?)\s*(?:min|mins?|minutes?\.?)$/);
  if (minMatch) return Math.round(parseFloat(minMatch[1]));
  const hourMatch = s.match(/^(\d+(?:\.\d+)?)\s*(?:hr|hrs|hour|hours?\.?)$/);
  if (hourMatch) return Math.round(parseFloat(hourMatch[1]) * 60);
  const numOnly = /^(\d+(?:\.\d+)?)$/.exec(s);
  if (numOnly) {
    const n = parseFloat(numOnly[1]);
    return n <= 30 ? n : Math.round(n * 60);
  }
  return 0;
}

export interface DashboardStats {
  webinarsAttended: number;
  learningHoursLabel: string;
  quizAveragePercent: number | null;
  activeTickets: number;
  activeTicketsUpcoming?: number;
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const supabase = await createServerClient();

  const [regResult, completionsResult, lessonRows, quizAttempts, contentQuizAttempts, regsForActive] =
    await Promise.all([
      supabase
        .from('webinar_registrations')
        .select('id')
        .eq('user_id', userId),
      supabase
        .from('user_lesson_completions')
        .select('lesson_id')
        .eq('user_id', userId),
      supabase.from('learning_lessons').select('id, duration'),
      supabase
        .from('user_quiz_attempts')
        .select('score_percent')
        .eq('user_id', userId),
      supabase
        .from('user_content_quiz_attempts')
        .select('score_percent')
        .eq('user_id', userId),
      supabase
        .from('webinar_registrations')
        .select('webinar_id')
        .eq('user_id', userId),
    ]);

  const webinarsAttended = (regResult.data ?? []).length;

  const completedLessonIds = new Set((completionsResult.data ?? []).map((r: { lesson_id: string }) => r.lesson_id));
  const lessonsById = new Map(
    (lessonRows.data ?? []).map((l: { id: string; duration: string | null }) => [l.id, l.duration])
  );
  let totalMinutes = 0;
  completedLessonIds.forEach((id) => {
    totalMinutes += parseLessonDurationToMinutes(lessonsById.get(id) ?? null);
  });
  const learningHours = totalMinutes / 60;
  const learningHoursLabel =
    learningHours === 0 ? '0h' : learningHours % 1 === 0 ? `${learningHours}h` : `${learningHours.toFixed(1)}h`;

  const lessonScores = (quizAttempts.data ?? []).map((a: { score_percent: number }) => a.score_percent);
  const contentScores = (contentQuizAttempts.data ?? []).map((a: { score_percent: number }) => a.score_percent);
  const allScores = [...lessonScores, ...contentScores];
  const quizAveragePercent =
    allScores.length > 0
      ? Math.round(allScores.reduce((s, n) => s + n, 0) / allScores.length)
      : null;

  let activeTickets = 0;
  let activeTicketsUpcoming = 0;
  const regWebinarIds = (regsForActive.data ?? []).map((r: { webinar_id: string }) => r.webinar_id);
  if (regWebinarIds.length > 0) {
    const { data: webinars } = await supabase
      .from('webinars')
      .select('id, status')
      .in('id', regWebinarIds);
    (webinars ?? []).forEach((w: { status: string }) => {
      if (w.status === 'live' || w.status === 'upcoming') {
        activeTickets++;
        if (w.status === 'upcoming') activeTicketsUpcoming++;
      }
    });
  }

  return {
    webinarsAttended,
    learningHoursLabel,
    quizAveragePercent,
    activeTickets,
    activeTicketsUpcoming,
  };
}

export async function getUpcomingWebinarsForDashboard(
  userId: string,
  limit = 5
): Promise<Webinar[]> {
  const [webinars, purchasedSlugs] = await Promise.all([
    getWebinars(),
    getPurchasedWebinarSlugsForUser(userId),
  ]);
  const webinarsWithPurchased = withPurchased(webinars, purchasedSlugs);
  const upcoming = webinarsWithPurchased
    .filter((w) => w.status === 'live' || w.status === 'upcoming')
    .sort((a, b) => {
      if (!a.scheduledAt && !b.scheduledAt) return 0;
      if (!a.scheduledAt) return 1;
      if (!b.scheduledAt) return -1;
      return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
    })
    .slice(0, limit);
  return upcoming;
}

export type RecentActivityType = 'lesson' | 'webinar_purchase' | 'quiz' | 'content_quiz';

export interface RecentActivityItem {
  type: RecentActivityType;
  title: string;
  meta: string;
  at: string;
}

function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

const ACTIVITY_PAGE_SIZE = 25;

export async function getRecentActivity(
  userId: string,
  limit = 10,
  offset = 0
): Promise<RecentActivityItem[]> {
  const supabase = await createServerClient();
  const fetchLimit = offset + limit;

  const [completionsRes, regsRes, quizRes, contentQuizRes] = await Promise.all([
    supabase
      .from('user_lesson_completions')
      .select('lesson_id, completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(fetchLimit),
    supabase
      .from('webinar_registrations')
      .select('webinar_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(fetchLimit),
    supabase
      .from('user_quiz_attempts')
      .select('lesson_id, score_percent, completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(fetchLimit),
    supabase
      .from('user_content_quiz_attempts')
      .select('content_item_id, score_percent, completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(fetchLimit),
  ]);

  const items: { at: string; type: RecentActivityType; title: string; meta: string }[] = [];

  const completionRows = completionsRes.data ?? [];
  if (completionRows.length > 0) {
    const lessonIds = [...new Set(completionRows.map((r: { lesson_id: string }) => r.lesson_id))];
    const { data: lessons } = await supabase
      .from('learning_lessons')
      .select('id, title')
      .in('id', lessonIds);
    const titleById = new Map(
      (lessons ?? []).map((l: { id: string; title: string }) => [l.id, l.title])
    );
    completionRows.forEach((r: { lesson_id: string; completed_at: string }) => {
      items.push({
        at: r.completed_at,
        type: 'lesson',
        title: titleById.get(r.lesson_id) ?? 'Lesson',
        meta: formatRelativeTime(r.completed_at),
      });
    });
  }

  const regRows = regsRes.data ?? [];
  if (regRows.length > 0) {
    const webinarIds = regRows.map((r: { webinar_id: string }) => r.webinar_id);
    const { data: webinars } = await supabase
      .from('webinars')
      .select('id, title, price')
      .in('id', webinarIds);
    const webinarById = new Map(
      (webinars ?? []).map((w: { id: string; title: string; price: string | null }) => [
        w.id,
        { title: w.title, price: w.price ?? '' },
      ])
    );
    regRows.forEach((r: { webinar_id: string; created_at: string }) => {
      const w = webinarById.get(r.webinar_id);
      items.push({
        at: r.created_at,
        type: 'webinar_purchase',
        title: w?.title ?? 'Webinar',
        meta: `${w?.price ? w.price + ' · ' : ''}${formatRelativeTime(r.created_at)}`,
      });
    });
  }

  const quizRows = quizRes.data ?? [];
  if (quizRows.length > 0) {
    const lessonIds = [...new Set(quizRows.map((r: { lesson_id: string }) => r.lesson_id))];
    const { data: lessons } = await supabase
      .from('learning_lessons')
      .select('id, title')
      .in('id', lessonIds);
    const titleById = new Map(
      (lessons ?? []).map((l: { id: string; title: string }) => [l.id, l.title])
    );
    quizRows.forEach((r: { lesson_id: string; score_percent: number; completed_at: string }) => {
      items.push({
        at: r.completed_at,
        type: 'quiz',
        title: titleById.get(r.lesson_id) ?? 'Quiz',
        meta: `Score: ${r.score_percent}% · ${formatRelativeTime(r.completed_at)}`,
      });
    });
  }

  const contentQuizRows = contentQuizRes.data ?? [];
  if (contentQuizRows.length > 0) {
    const contentIds = contentQuizRows.map((r: { content_item_id: string }) => r.content_item_id);
    const { data: contents } = await supabase
      .from('learning_content_items')
      .select('id, title')
      .in('id', contentIds);
    const titleById = new Map(
      (contents ?? []).map((c: { id: string; title: string }) => [c.id, c.title])
    );
    contentQuizRows.forEach(
      (r: { content_item_id: string; score_percent: number; completed_at: string }) => {
        items.push({
          at: r.completed_at,
          type: 'content_quiz',
          title: titleById.get(r.content_item_id) ?? 'Content quiz',
          meta: `Score: ${r.score_percent}% · ${formatRelativeTime(r.completed_at)}`,
        });
      }
    );
  }

  items.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  return items
    .slice(offset, offset + limit)
    .map(({ type, title, meta, at }) => ({ type, title, meta, at }));
}

export { ACTIVITY_PAGE_SIZE };
