'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import {
  Video,
  BookOpen,
  Clock,
  Star,
  Ticket,
  type LucideIcon,
} from 'lucide-react';

const iconMap = {
  Video,
  BookOpen,
  Clock,
  Star,
  Ticket,
} as const;

type IconName = keyof typeof iconMap;

const iconColors: Record<IconName, string> = {
  Video: 'bg-teal-500/10 text-teal-600',
  BookOpen: 'bg-indigo-500/10 text-indigo-600',
  Clock: 'bg-indigo-500/10 text-indigo-600',
  Star: 'bg-amber-500/10 text-amber-600',
  Ticket: 'bg-rose-500/10 text-rose-500',
};

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconName;
  badge?: string;
  mono?: string;
  miniChart?: number[];
}

function animateValue(
  start: number,
  end: number,
  duration: number,
  callback: (value: number) => void
): void {
  const startTime = performance.now();
  function update(currentTime: number): void {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = start + (end - start) * easeOutQuart;
    callback(Math.floor(current));
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

export function StatsCard({
  title,
  value,
  icon,
  badge,
  mono,
  miniChart,
}: StatsCardProps): React.ReactElement {
  const [displayValue, setDisplayValue] = useState<string | number>(value);
  const Icon = iconMap[icon];

  useEffect(() => {
    if (typeof value === 'number') {
      setDisplayValue(0);
      animateValue(0, value, 1000, setDisplayValue);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  return (
    <div
      className={cn(
        'stat-card rounded-2xl border border-black/5 bg-white p-6 transition-all duration-300',
        'hover:-translate-y-1 hover:border-teal-500/15 hover:shadow-[0_12px_40px_rgba(13,148,136,0.08)]'
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl',
            iconColors[icon]
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </div>
        {badge && (
          <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-500">
            {badge}
          </span>
        )}
        {mono && !badge && (
          <span className="text-xs font-mono text-slate-600">{mono}</span>
        )}
        {miniChart && (
          <div className="flex items-end gap-0.5" style={{ height: 40 }}>
            {miniChart.map((h, i) => (
              <div
                key={i}
                className={cn(
                  'w-1.5 rounded-[3px] transition-colors duration-300',
                  i >= miniChart.length - 3
                    ? 'bg-teal-500'
                    : 'bg-teal-500/20'
                )}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="font-serif text-3xl text-slate-900">{displayValue}</div>
      <div className="text-sm text-slate-600">{title}</div>
    </div>
  );
}
