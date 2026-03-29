import Link from 'next/link';
import { LearningCard } from '@/components/dashboard/learning-card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/dashboard/empty-state';
import { FileText, HelpCircle, Video, BookOpen, CheckCircle2 } from 'lucide-react';
import { getLearningCards, getWeeklyMaterials, getContentQuizPassedIds } from '@/lib/data/learning';
import { getUser } from '@/lib/auth/getUser';

const contentHref = (id: string, retake?: boolean) =>
  `/dashboard/learning/content/${id}${retake ? '?retake=1' : ''}`;

const iconByType = {
  pdf: FileText,
  quiz: HelpCircle,
  video: Video,
} as const;

const iconBgByType = {
  pdf: 'bg-red-50',
  quiz: 'bg-indigo-50',
  video: 'bg-amber-50',
} as const;

const iconColorByType = {
  pdf: 'text-red-400',
  quiz: 'text-indigo-400',
  video: 'text-amber-400',
} as const;

export default async function DashboardLearningPage(): Promise<React.ReactElement> {
  const user = await getUser();
  const [cards, weeklyMaterials, quizPassedIds] = await Promise.all([
    getLearningCards(user?.id ?? null),
    getWeeklyMaterials(),
    user ? getContentQuizPassedIds(user.id) : Promise.resolve(new Set<string>()),
  ]);

  return (
    <div className="px-6 lg:px-8 py-8 max-w-[1400px]">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-slate-900 mb-1">My Learning</h1>
        <p className="text-slate-600 text-sm">
          Continue your courses, case studies, and weekly materials
        </p>
      </div>

      {cards.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No learning content yet"
          description="Check back later or contact your administrator to add modules and case studies."
          actionLabel="Back to Dashboard"
          actionHref="/dashboard"
          className="mb-8"
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cards.map((card) => (
            <LearningCard
              key={card.id}
              type={card.type}
              title={card.title}
              description={card.description}
              meta={card.meta}
              progress={card.progress}
              progressLabel={card.progressLabel}
              cta={card.cta}
              ctaVariant={card.ctaVariant}
              href={card.href}
              certified={card.certified}
            />
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-serif text-xl text-slate-900 mb-5">
          Weekly Materials
        </h2>
        {weeklyMaterials.length === 0 ? (
          <p className="text-sm text-slate-500 py-4">No weekly materials yet. Check back later.</p>
        ) : (
          <div className="space-y-3">
            {weeklyMaterials.map((item) => {
              const Icon = iconByType[item.type];
              const iconBg = iconBgByType[item.type];
              const iconColor = iconColorByType[item.type];
              const isQuiz = item.type === 'quiz';
              const passed = isQuiz && quizPassedIds.has(item.id);
              const primaryLabel = isQuiz
                ? passed
                  ? 'View'
                  : 'Take Quiz'
                : item.type === 'video'
                  ? 'Watch'
                  : 'Download';
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-slate-50"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
                  >
                    <Icon
                      className={`h-5 w-5 ${iconColor}`}
                      strokeWidth={1.5}
                    />
                  </div>
                  <Link
                    href={contentHref(item.id)}
                    className="flex-1 min-w-0"
                  >
                    <div className="text-sm font-medium text-slate-700">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-600 flex items-center gap-1.5">
                      {passed && (
                        <span className="inline-flex items-center gap-1 text-teal-600 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Passed
                        </span>
                      )}
                      {passed && item.meta ? '·' : null}
                      {item.meta}
                    </div>
                  </Link>
                  <Button
                    asChild
                    variant={item.type === 'pdf' ? 'outline' : 'secondary'}
                    size="sm"
                    className="text-xs py-1.5 px-3"
                  >
                    <Link href={contentHref(item.id)}>{primaryLabel}</Link>
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
