'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ActivityItem {
  icon: ReactNode;
  iconBg?: string;
  title: React.ReactNode;
  meta: string;
}

interface RecentActivityListProps {
  items: ActivityItem[];
  className?: string;
}

export function RecentActivityList({
  items,
  className,
}: RecentActivityListProps): React.ReactElement {
  return (
    <div className={className}>
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-4"
        >
          <div
            className={cn(
              'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
              item.iconBg ?? 'bg-slate-100'
            )}
          >
            {item.icon}
          </div>
          <div>
            <div className="text-sm text-slate-700">{item.title}</div>
            <div className="text-xs text-slate-600">{item.meta}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
