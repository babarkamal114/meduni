'use client';

import { cn } from '@/lib/utils/cn';

interface ProgressBarProps {
  value: number;
  className?: string;
  animate?: boolean;
}

export function ProgressBar({
  value,
  className,
  animate = true,
}: ProgressBarProps): React.ReactElement {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn(
        'h-1.5 rounded-[3px] bg-slate-200 overflow-hidden',
        className
      )}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          'h-full rounded-[3px] bg-gradient-to-r from-teal-500 to-teal-400',
          animate && 'transition-[width] duration-1000 ease-out'
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
