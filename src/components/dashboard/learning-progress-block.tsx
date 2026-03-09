'use client';

import { ProgressBar } from '@/components/ui/progress-bar';
import { cn } from '@/lib/utils/cn';

export interface ProgressItem {
  label: string;
  percent: number;
}

interface LearningProgressBlockProps {
  items: ProgressItem[];
  callout?: { title: string; subtitle: string };
  className?: string;
}

export function LearningProgressBlock({
  items,
  callout,
  className,
}: LearningProgressBlockProps): React.ReactElement {
  return (
    <div className={cn('space-y-5', className)}>
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-600">{item.label}</span>
            <span className="text-xs font-mono text-teal-600">
              {item.percent}%
            </span>
          </div>
          <ProgressBar value={item.percent} />
        </div>
      ))}
      {callout && (
        <div className="mt-6 rounded-xl border border-teal-100 bg-teal-50 p-4">
          <div className="flex items-center gap-3">
            <svg
              className="h-5 w-5 shrink-0 text-teal-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .982-3.172M8.25 8.25a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Z"
              />
            </svg>
            <div>
              <div className="text-sm font-semibold text-teal-700">
                {callout.title}
              </div>
              <div className="text-xs text-teal-700">{callout.subtitle}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
