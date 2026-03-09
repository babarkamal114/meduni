'use client';

import Link from 'next/link';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

export interface LearningCardProps {
  type: 'Module' | 'Case Study';
  title: string;
  description: string;
  meta: string;
  progress: number;
  progressLabel: string;
  cta: 'Continue' | 'Start';
  ctaVariant?: 'primary' | 'secondary';
  href?: string;
}

export function LearningCard({
  type,
  title,
  description,
  meta,
  progress,
  progressLabel,
  cta,
  ctaVariant = 'secondary',
  href,
}: LearningCardProps): React.ReactElement {
  const cardClassName = cn(
    'block rounded-2xl border border-black/5 bg-white p-5 transition-all duration-300',
    'hover:-translate-y-0.5 hover:border-teal-500/10 hover:shadow-[0_8px_30px_rgba(13,148,136,0.06)]',
    href && 'cursor-pointer'
  );

  const inner = (
    <>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-teal-600">
          {type}
        </span>
        <span className="text-xs font-mono text-slate-600">{meta}</span>
      </div>
      <h3 className="font-serif text-lg text-slate-800 mb-2">{title}</h3>
      <p className="text-xs text-slate-600 mb-4">{description}</p>
      <div className="mb-3">
        <ProgressBar value={progress} />
      </div>
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'text-xs font-medium',
            progress > 0 ? 'text-teal-600' : 'text-slate-600'
          )}
        >
          {progressLabel}
        </span>
        {href ? (
          <span
            className={cn(
              'inline-flex items-center justify-center rounded-md text-xs font-medium py-1.5 px-3',
              ctaVariant === 'primary'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            )}
          >
            {cta}
          </span>
        ) : (
          <Button
            variant={ctaVariant === 'primary' ? 'default' : 'secondary'}
            size="sm"
            className="text-xs py-1.5 px-3"
          >
            {cta}
          </Button>
        )}
      </div>
    </>
  );

  if (href) {
    return <Link href={href} className={cardClassName}>{inner}</Link>;
  }
  return <div className={cardClassName}>{inner}</div>;
}
