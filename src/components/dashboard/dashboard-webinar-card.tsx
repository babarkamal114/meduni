'use client';

import { cn } from '@/lib/utils/cn';
import { formatDuration } from '@/lib/utils/formatDuration';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Button } from '@/components/ui/button';
import type { ReactNode } from 'react';

export type WebinarStatus = 'live' | 'upcoming' | 'recorded';

export interface DashboardWebinarCardProps {
  title: string;
  expert: string;
  duration: string;
  price: string;
  status: WebinarStatus;
  statusLabel: string;
  gradientClass: string;
  icon: ReactNode;
  ctaLabel: string;
  onClick?: () => void;
}

export function DashboardWebinarCard({
  title,
  expert,
  duration,
  price,
  status,
  statusLabel,
  gradientClass,
  icon,
  ctaLabel,
  onClick,
}: DashboardWebinarCardProps): React.ReactElement {
  return (
    <div
      className={cn(
        'group overflow-hidden rounded-2xl border border-slate-200/80 transition-all duration-300',
        'bg-gradient-to-b from-slate-50 to-white',
        'shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
        'hover:-translate-y-1 hover:border-teal-300/60 hover:shadow-[0_16px_48px_rgba(13,148,136,0.14)]',
        'cursor-pointer'
      )}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      role="button"
      tabIndex={0}
    >
      <div
        className={cn(
          'relative flex h-44 items-center justify-center bg-gradient-to-br',
          gradientClass
        )}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, currentColor 1px, transparent 1px),
                             radial-gradient(circle at 80% 20%, currentColor 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
        <StatusBadge
          status={status === 'recorded' ? 'recorded' : status}
          className="absolute left-3 top-3 z-10"
        >
          {statusLabel}
        </StatusBadge>
        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/70 shadow-md backdrop-blur-sm [&>svg]:h-10 [&>svg]:w-10 [&>svg]:text-slate-600 group-hover:bg-white/90 group-hover:shadow-lg group-hover:[&>svg]:text-slate-700">
          {icon}
        </div>
      </div>
      <div className="p-5 bg-gradient-to-b from-white/80 to-slate-50/50">
        <h3 className="font-serif text-lg text-slate-800 mb-1">{title}</h3>
        <p className="text-xs text-slate-600 mb-3">
          {expert} · {formatDuration(duration)}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-serif text-xl text-teal-600">£{price}</span>
          <Button
            size="sm"
            className="text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            {ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
