import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { getModuleById } from '@/lib/mock/learning';

interface ModulePageProps {
  params: Promise<{ moduleId: string }>;
}

export default async function ModulePage({
  params,
}: ModulePageProps): Promise<React.ReactElement> {
  const { moduleId } = await params;
  const moduleData = getModuleById(moduleId);

  if (!moduleData) notFound();

  const nextLesson = moduleData.lessons.find((l) => !l.completed);
  const continueHref = nextLesson
    ? `/dashboard/learning/module/${moduleId}/lesson/${nextLesson.id}`
    : `/dashboard/learning/module/${moduleId}/lesson/${moduleData.lessons[0].id}`;
  const continueLabel = nextLesson ? 'Continue' : 'Start';

  return (
    <div className="px-6 lg:px-8 py-8 max-w-[1400px]">
      <Link
        href="/dashboard/learning"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to My Learning
      </Link>
      <div className="mb-8">
        <span className="text-xs font-mono uppercase tracking-wider text-teal-600">
          Module
        </span>
        <h1 className="font-serif text-3xl text-slate-900 mt-1 mb-2">
          {moduleData.title}
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl">{moduleData.description}</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1 max-w-xs">
            <ProgressBar value={moduleData.progress} />
          </div>
          <span className="text-xs font-medium text-teal-600">
            {moduleData.progressLabel}
          </span>
        </div>
        <Button asChild className="mt-4" size="sm">
          <Link href={continueHref}>{continueLabel}</Link>
        </Button>
      </div>
      <div className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-serif text-xl text-slate-900 mb-5">Lessons</h2>
        <ul className="space-y-2">
          {moduleData.lessons.map((lesson, index) => {
            const lessonHref = `/dashboard/learning/module/${moduleId}/lesson/${lesson.id}`;
            return (
              <li key={lesson.id}>
                <Link
                  href={lessonHref}
                  className="flex items-center gap-4 rounded-xl p-4 transition hover:bg-slate-50 border border-transparent hover:border-black/5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                    {lesson.completed ? (
                      <Check className="h-5 w-5 text-teal-600" strokeWidth={2} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-800">
                      {lesson.title}
                    </div>
                    <div className="text-xs text-slate-600">{lesson.duration}</div>
                  </div>
                  {lesson.completed ? (
                    <span className="text-xs text-teal-600">Done</span>
                  ) : (
                    <Play className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
