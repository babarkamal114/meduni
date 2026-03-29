import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, Play, HelpCircle, Award, Download } from 'lucide-react';
import { ProgressBar } from '@/components/ui/progress-bar';
import { getModuleBySlug, getUserCertifications } from '@/lib/data/learning';
import { getUser } from '@/lib/auth/getUser';

interface ModulePageProps {
  params: Promise<{ moduleId: string }>;
}

export default async function ModulePage({
  params,
}: ModulePageProps): Promise<React.ReactElement> {
  const { moduleId } = await params;
  const user = await getUser();
  const [moduleData, certifications] = await Promise.all([
    getModuleBySlug(moduleId, user?.id ?? null),
    user?.id ? getUserCertifications(user.id) : Promise.resolve([]),
  ]);

  if (!moduleData) notFound();

  const certified = certifications.some((c) => c.module_id === moduleData.id);
  const nextLesson = moduleData.lessons.find((l) => !l.completed);
  const firstLesson = moduleData.lessons[0];
  const continueHref = nextLesson
    ? `/dashboard/learning/module/${moduleId}/lesson/${nextLesson.id}`
    : firstLesson
      ? `/dashboard/learning/module/${moduleId}/lesson/${firstLesson.id}`
      : null;
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
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono uppercase tracking-wider text-teal-600">
            Module
          </span>
          {certified && (
            <span className="inline-flex items-center rounded-md bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800">
              Certified
            </span>
          )}
        </div>
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
        {continueHref && (
          <Link
            href={continueHref}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            {continueLabel}
          </Link>
        )}
      </div>
      <div className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-serif text-xl text-slate-900 mb-5">Steps</h2>
        {moduleData.lessons.length === 0 ? (
          <p className="text-sm text-slate-500 py-4">No steps in this module yet.</p>
        ) : (
          <ul className="space-y-2">
            {moduleData.lessons.map((lesson, index) => {
              const lessonHref = `/dashboard/learning/module/${moduleId}/lesson/${lesson.id}`;
              const isQuiz = lesson.lessonType === 'quiz';
              return (
                <li key={lesson.id}>
                  <Link
                    href={lessonHref}
                    className="flex items-center gap-4 rounded-xl p-4 transition hover:bg-slate-50 border border-transparent hover:border-black/5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                      {lesson.completed ? (
                        <Check className="h-5 w-5 text-teal-600" strokeWidth={2} />
                      ) : isQuiz ? (
                        <HelpCircle className="h-5 w-5 text-amber-600" strokeWidth={1.5} />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-800">
                          {lesson.title}
                        </span>
                        {isQuiz && (
                          <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">
                            Quiz
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-600">{isQuiz ? 'Quiz' : lesson.duration}</div>
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
        )}
      </div>
      {certified && (
        <div className="mt-8 rounded-2xl border border-teal-200 bg-teal-50/30 p-6">
          <h2 className="font-serif text-xl text-slate-900 mb-2 flex items-center gap-2">
            <Award className="h-5 w-5 text-teal-600" strokeWidth={1.5} />
            Certificate
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            You have completed this module. View or download your certificate.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/dashboard/learning/certificate/${moduleId}`}
              className="inline-flex items-center justify-center rounded-md bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              View certificate
            </Link>
            <a
              href={`/api/certificates/${moduleId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              <Download className="h-4 w-4" strokeWidth={1.5} />
              Download PDF
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
