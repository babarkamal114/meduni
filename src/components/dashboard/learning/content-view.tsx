'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { ContentItem, ContentQuizItem } from '@/lib/data/learning';
import { CheckCircle2, RotateCcw } from 'lucide-react';

type Content = ContentItem | ContentQuizItem;

function ContentPdf({ content }: { content: ContentItem }): React.ReactElement {
  return (
    <>
      <h1 className="font-serif text-2xl text-slate-900 mb-2">{content.title}</h1>
      <p className="text-slate-600 text-sm mb-6">{content.meta}</p>
      <div className="rounded-2xl border border-black/5 bg-white p-6 mb-6">
        <p className="text-slate-600 text-sm mb-4">
          Preview not available. Download the PDF to read offline.
        </p>
        <Button asChild>
          <Link href={content.downloadUrl ?? '#'} download>
            Download PDF
          </Link>
        </Button>
      </div>
      <Button asChild variant="secondary" size="sm">
        <Link href="/dashboard/learning">Back to My Learning</Link>
      </Button>
    </>
  );
}

function ContentQuiz({
  content,
  onComplete,
}: {
  content: ContentQuizItem;
  onComplete?: (score: number, total: number) => Promise<void>;
}): React.ReactElement {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const questions = content.questions;
  const current = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleSelect = (optionId: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [current.id]: optionId }));
  };

  const handleNext = async () => {
    if (isLast) {
      const score = questions.filter(
        (q) => answers[q.id] && q.options.find((o) => o.id === answers[q.id])?.correct
      ).length;
      const total = questions.length;
      if (onComplete) {
        setSubmitting(true);
        try {
          await onComplete(score, total);
          setSubmitted(true);
        } finally {
          setSubmitting(false);
        }
      } else {
        setSubmitted(true);
      }
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => setCurrentIndex((i) => Math.max(0, i - 1));

  const score = submitted
    ? questions.filter(
        (q) => answers[q.id] && q.options.find((o) => o.id === answers[q.id])?.correct
      ).length
    : 0;
  const total = questions.length;
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  if (submitted) {
    return (
      <>
        <h1 className="font-serif text-2xl text-slate-900 mb-2">
          {content.title}
        </h1>
        <p className="text-slate-600 text-sm mb-6">{content.meta}</p>
        <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-6 mb-6">
          <h2 className="font-serif text-lg text-teal-800 mb-2">Quiz complete</h2>
          <p className="text-slate-700 text-sm">
            You scored {score} out of {total} ({percent}%).
          </p>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link href="/dashboard/learning">Back to My Learning</Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <h1 className="font-serif text-2xl text-slate-900 mb-2">{content.title}</h1>
      <p className="text-slate-600 text-sm mb-6">{content.meta}</p>
      <div className="rounded-2xl border border-black/5 bg-white p-6 mb-6">
        <div className="text-xs font-mono text-slate-500 mb-4">
          Question {currentIndex + 1} of {total}
        </div>
        <h2 className="font-serif text-lg text-slate-800 mb-4">
          {current.question}
        </h2>
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
            {submitting ? 'Saving…' : isLast ? 'Submit' : 'Next'}
          </Button>
        </div>
      </div>
      <Button asChild variant="ghost" size="sm">
        <Link href="/dashboard/learning">Back to My Learning</Link>
      </Button>
    </>
  );
}

function ContentVideo({ content }: { content: ContentItem }): React.ReactElement {
  return (
    <>
      <h1 className="font-serif text-2xl text-slate-900 mb-2">{content.title}</h1>
      <p className="text-slate-600 text-sm mb-6">{content.meta}</p>
      <div className="rounded-2xl border border-black/5 bg-white overflow-hidden mb-6">
        {content.videoUrl ? (
          <video
            src={content.videoUrl}
            controls
            className="w-full aspect-video bg-black"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="aspect-video bg-slate-100 flex items-center justify-center text-slate-500 text-sm">
            Video placeholder · {content.estimatedTime}
          </div>
        )}
      </div>
      <Button asChild variant="secondary" size="sm">
        <Link href="/dashboard/learning">Back to My Learning</Link>
      </Button>
    </>
  );
}

function ContentQuizEmpty({ content }: { content: ContentQuizItem }): React.ReactElement {
  return (
    <>
      <h1 className="font-serif text-2xl text-slate-900 mb-2">{content.title}</h1>
      <p className="text-slate-600 text-sm mb-6">{content.meta}</p>
      <div className="rounded-2xl border border-black/5 bg-white p-6 mb-6">
        <p className="text-slate-600 text-sm">No questions yet. Check back later.</p>
      </div>
      <Button asChild variant="secondary" size="sm">
        <Link href="/dashboard/learning">Back to My Learning</Link>
      </Button>
    </>
  );
}

function ContentQuizPassedView({
  content,
  contentId,
}: {
  content: ContentQuizItem;
  contentId: string;
}): React.ReactElement {
  const retakeHref = `/dashboard/learning/content/${contentId}?retake=1`;
  return (
    <>
      <h1 className="font-serif text-2xl text-slate-900 mb-2">{content.title}</h1>
      <p className="text-slate-600 text-sm mb-6">{content.meta}</p>
      <div className="rounded-2xl border border-teal-200 bg-gradient-to-b from-teal-50 to-emerald-50/50 p-8 mb-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-100">
            <CheckCircle2 className="h-8 w-8 text-teal-600" strokeWidth={2} />
          </div>
        </div>
        <h2 className="font-serif text-xl text-teal-900 mb-2">You passed this quiz</h2>
        <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
          You have successfully completed this quiz. You can review it again anytime using the button below.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="secondary" size="sm">
            <Link href="/dashboard/learning">Back to My Learning</Link>
          </Button>
          <Button asChild size="sm" className="gap-1.5">
            <Link href={retakeHref}>
              <RotateCcw className="h-3.5 w-3.5" />
              Retake quiz
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}

export function ContentView({
  content,
  passedView = false,
  recordContentQuizAction,
}: {
  content: Content;
  passedView?: boolean;
  recordContentQuizAction?: (
    contentItemId: string,
    score: number,
    total: number
  ) => Promise<{ error: string | null; passed: boolean }>;
}): React.ReactElement {
  const router = useRouter();

  if (content.type === 'pdf') return <ContentPdf content={content} />;
  if (content.type === 'quiz') {
    const quizContent = content as ContentQuizItem;
    if (passedView) return <ContentQuizPassedView content={quizContent} contentId={content.id} />;
    if (!quizContent.questions?.length) return <ContentQuizEmpty content={quizContent} />;
    const onComplete =
      recordContentQuizAction &&
      (async (score: number, total: number) => {
        const result = await recordContentQuizAction(content.id, score, total);
        if (result.passed) router.push(`/dashboard/learning/content/${content.id}`);
      });
    return <ContentQuiz content={quizContent} onComplete={onComplete} />;
  }
  if (content.type === 'video') return <ContentVideo content={content} />;
  return (
    <p className="text-slate-600">This content type is not supported.</p>
  );
}
