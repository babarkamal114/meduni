'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { ContentItem, ContentQuizItem } from '@/lib/mock/learning';

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
          <a href={content.downloadUrl ?? '#'} download>
            Download PDF
          </a>
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
}: {
  content: ContentQuizItem;
}): React.ReactElement {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = content.questions;
  const current = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleSelect = (optionId: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [current.id]: optionId }));
  };

  const handleNext = () => {
    if (isLast) setSubmitted(true);
    else setCurrentIndex((i) => i + 1);
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
            disabled={!answers[current.id]}
          >
            {isLast ? 'Submit' : 'Next'}
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

export function ContentView({
  content,
}: {
  content: Content;
}): React.ReactElement {
  if (content.type === 'pdf') return <ContentPdf content={content} />;
  if (content.type === 'quiz')
    return <ContentQuiz content={content as ContentQuizItem} />;
  if (content.type === 'video') return <ContentVideo content={content} />;
  return (
    <p className="text-slate-600">This content type is not supported.</p>
  );
}
