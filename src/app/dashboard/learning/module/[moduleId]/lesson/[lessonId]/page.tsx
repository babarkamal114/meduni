import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LessonCompleteButton } from '@/components/dashboard/lesson-complete-button';
import { ModuleLessonQuiz } from '@/components/dashboard/module-lesson-quiz';
import { getLesson } from '@/lib/data/learning';
import { getUser } from '@/lib/auth/getUser';

interface LessonPageProps {
  params: Promise<{ moduleId: string; lessonId: string }>;
}

export default async function LessonPage({
  params,
}: LessonPageProps): Promise<React.ReactElement> {
  const { moduleId, lessonId } = await params;
  const user = await getUser();
  const data = await getLesson(moduleId, lessonId, user?.id ?? null);

  if (!data) notFound();

  const { lesson, module: moduleData } = data;
  const lessonIds = moduleData.lessons.map((l) => l.id);
  const index = lessonIds.indexOf(lessonId);
  const prevId = index > 0 ? lessonIds[index - 1] : null;
  const nextId = index < lessonIds.length - 1 ? lessonIds[index + 1] : null;
  const nextStepHref = nextId
    ? `/dashboard/learning/module/${moduleId}/lesson/${nextId}`
    : `/dashboard/learning/module/${moduleId}`;
  const isQuiz = lesson.lessonType === 'quiz';
  const passThresholdPercent = moduleData.passThresholdPercent ?? 80;

  return (
    <div className="px-6 lg:px-8 py-8 max-w-[900px]">
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          href={`/dashboard/learning/module/${moduleId}`}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Back to module
        </Link>
      </div>
      {isQuiz ? (
        <ModuleLessonQuiz
          lessonId={lessonId}
          moduleSlug={moduleId}
          title={lesson.title}
          intro={lesson.body || undefined}
          questions={lesson.questions ?? []}
          passThresholdPercent={passThresholdPercent}
          completed={lesson.completed}
          nextStepHref={nextStepHref}
        />
      ) : (
        <article className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
            <span>{lesson.duration}</span>
            {lesson.hasVideo && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Video className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {lesson.videoDuration} video
                </span>
              </>
            )}
          </div>
          <h1 className="font-serif text-2xl text-slate-900 mb-6">
            {lesson.title}
          </h1>
          {lesson.hasVideo && (
            <div className="rounded-xl bg-slate-100 aspect-video flex items-center justify-center mb-6 border border-black/5">
              <div className="text-center text-slate-500 text-sm">
                Video placeholder · {lesson.videoDuration}
              </div>
            </div>
          )}
          <div className="prose prose-slate prose-sm max-w-none text-slate-700">
            <p className="whitespace-pre-line">{lesson.body}</p>
          </div>
          {user && (
            <div className="mt-6 pt-6 border-t border-black/5">
              <LessonCompleteButton
                lessonId={lessonId}
                moduleSlug={moduleId}
                completed={lesson.completed}
              />
            </div>
          )}
        </article>
      )}
      <nav className="flex items-center justify-between pt-6 border-t border-black/5">
        <div className="w-28">
          {prevId ? (
            <Button asChild variant="outline" size="sm">
              <Link
                href={`/dashboard/learning/module/${moduleId}/lesson/${prevId}`}
                className="inline-flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                Previous
              </Link>
            </Button>
          ) : null}
        </div>
        <Link
          href={`/dashboard/learning/module/${moduleId}`}
          className="text-sm text-slate-600 hover:text-teal-600"
        >
          Module overview
        </Link>
        <div className="w-28 flex justify-end">
          {nextId ? (
            <Button asChild size="sm">
              <Link
                href={`/dashboard/learning/module/${moduleId}/lesson/${nextId}`}
                className="inline-flex items-center gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="secondary">
              <Link href={`/dashboard/learning/module/${moduleId}`}>
                Finish
              </Link>
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
}
