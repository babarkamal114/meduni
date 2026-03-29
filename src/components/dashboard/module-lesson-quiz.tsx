'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { QuizQuestion } from '@/lib/data/learning';
import { submitQuizAttempt } from '@/app/dashboard/learning/actions';

interface ModuleLessonQuizProps {
  lessonId: string;
  moduleSlug: string;
  title: string;
  intro?: string;
  questions: QuizQuestion[];
  passThresholdPercent: number;
  completed: boolean;
  /** When passed, link to this URL for "Continue to next step" (or module overview if last). */
  nextStepHref?: string | null;
}

export function ModuleLessonQuiz({
  lessonId,
  moduleSlug,
  title,
  intro,
  questions,
  passThresholdPercent,
  completed,
  nextStepHref,
}: ModuleLessonQuizProps): React.ReactElement {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ passed: boolean; percent: number; error?: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const total = questions.length;
  const current = total > 0 ? questions[currentIndex] : null;
  const isLast = currentIndex === total - 1;

  const handleSelect = (optionId: string) => {
    if (submitted || submitResult) return;
    setAnswers((prev) => ({ ...prev, [current!.id]: optionId }));
  };

  const handleNext = () => {
    if (isLast && current) {
      setSubmitted(true);
      const score = questions.filter(
        (q) => answers[q.id] && q.options.find((o) => o.id === answers[q.id])?.correct
      ).length;
      const percent = total > 0 ? Math.round((score / total) * 100) : 0;
      setSubmitting(true);
      submitQuizAttempt(lessonId, percent).then((res) => {
        setSubmitting(false);
        const errStr =
          res.error == null ? undefined : typeof res.error === 'string' ? res.error : (res.error as { message?: string })?.message ?? String(res.error);
        setSubmitResult({ passed: res.passed, percent, error: errStr });
        if (res.passed && !res.error) router.refresh();
      });
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => setCurrentIndex((i) => Math.max(0, i - 1));

  if (completed && !submitResult) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 mb-6">
        <h2 className="font-serif text-lg text-emerald-800 mb-2">Quiz passed</h2>
        <p className="text-slate-700 text-sm mb-4">You have completed this quiz. Continue to the next step below.</p>
        {nextStepHref && (
          <Button size="sm" asChild>
            <Link href={nextStepHref} className="inline-flex items-center gap-2">
              Next step
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </Button>
        )}
      </div>
    );
  }

  if (submitResult) {
    const passed = submitResult.passed;
    const hasError = !!submitResult.error;
    return (
      <div
        className={`rounded-2xl border p-6 mb-6 ${
          hasError
            ? 'border-red-200 bg-red-50/50'
            : passed
              ? 'border-emerald-200 bg-emerald-50/60'
              : 'border-amber-200 bg-amber-50/50'
        }`}
      >
        {hasError && (
          <p className="text-red-700 text-sm mb-4">
            Could not save completion. {typeof submitResult.error === 'string' ? submitResult.error : ''} Try again or continue below.
          </p>
        )}
        <h2 className={`font-serif text-lg mb-2 ${passed ? 'text-emerald-800' : 'text-amber-900'}`}>
          {passed ? 'Quiz passed' : 'Quiz complete'}
        </h2>
        <p className="text-slate-700 text-sm mb-4">
          You scored {submitResult.percent}% (need {passThresholdPercent}% to pass).
          {passed ? ' You can continue to the next step.' : ' You may retake the quiz below.'}
        </p>
        {passed && nextStepHref ? (
          <Button size="sm" asChild>
            <Link href={nextStepHref} className="inline-flex items-center gap-2">
              Continue to next step
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </Button>
        ) : !passed ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSubmitResult(null);
              setSubmitted(false);
              setAnswers({});
              setCurrentIndex(0);
            }}
          >
            Retake quiz
          </Button>
        ) : null}
      </div>
    );
  }

  if (!current || total === 0) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-6 mb-6">
        <p className="text-slate-600 text-sm">No questions in this quiz.</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h1 className="font-serif text-2xl text-slate-900 mb-2">{title}</h1>
      {intro && <p className="text-slate-600 text-sm mb-6 whitespace-pre-line">{intro}</p>}
      <div className="rounded-2xl border border-black/5 bg-white p-6 mb-6">
        <div className="text-xs font-mono text-slate-500 mb-4">
          Question {currentIndex + 1} of {total}
        </div>
        <h2 className="font-serif text-lg text-slate-800 mb-4">{current.question}</h2>
        <div className="space-y-2">
          {current.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              className={`w-full text-left rounded-lg border px-4 py-3 text-sm transition ${
                answers[current.id] === opt.id
                  ? 'border-teal-500 bg-teal-50 text-teal-800'
                  : 'border-black/10 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>
          <Button
            size="sm"
            onClick={handleNext}
            disabled={!answers[current.id] || submitting}
          >
            {submitting ? 'Submitting…' : isLast ? 'Submit' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
