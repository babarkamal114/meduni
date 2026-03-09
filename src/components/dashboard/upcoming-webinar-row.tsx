'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { StatusBadge } from '@/components/dashboard/status-badge';
import type { ReactNode } from 'react';

export interface UpcomingWebinarRowProps {
  title: string;
  expert: string;
  date: string;
  status: 'live' | 'upcoming';
  statusLabel: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
}

const rowContent = (
  title: string,
  expert: string,
  date: string,
  status: 'live' | 'upcoming',
  statusLabel: string,
  icon: ReactNode
) => (
  <>
    <div
      className={cn(
        'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
        status === 'live' ? 'bg-red-50' : 'bg-teal-50'
      )}
    >
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <div className="truncate text-sm font-semibold text-slate-800">{title}</div>
      <div className="text-xs text-slate-600">
        {expert} · {date}
      </div>
    </div>
    <StatusBadge status={status}>{statusLabel}</StatusBadge>
  </>
);

export function UpcomingWebinarRow({
  title,
  expert,
  date,
  status,
  statusLabel,
  icon,
  href,
  onClick,
}: UpcomingWebinarRowProps): React.ReactElement {
  const className =
    'flex w-full cursor-pointer items-center gap-4 rounded-xl p-3 text-left transition hover:bg-slate-50';
  const content = rowContent(title, expert, date, status, statusLabel, icon);
  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  );
}
