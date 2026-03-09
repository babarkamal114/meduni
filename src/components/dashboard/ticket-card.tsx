'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export type TicketStatus = 'live' | 'upcoming' | 'completed';

export interface TicketCardProps {
  slug: string;
  title: string;
  expert: string;
  date: string;
  meta: string;
  orderId: string;
  status: TicketStatus;
  statusLabel: string;
  actionLabel: string;
  gradient?: string;
}

const defaultGradients: Record<TicketStatus, string> = {
  live: 'from-teal-500 to-teal-700',
  upcoming: 'from-indigo-500 to-indigo-600',
  completed: 'from-slate-500 to-slate-600',
};

export function TicketCard({
  slug,
  title,
  expert,
  date,
  meta,
  orderId,
  status,
  statusLabel,
  actionLabel,
  gradient,
}: TicketCardProps): React.ReactElement {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[20px] p-7 text-white',
        !gradient && `bg-gradient-to-br ${defaultGradients[status]}`
      )}
      style={gradient ? { background: gradient } : undefined}
    >
      <div className="absolute -right-5 -top-5 h-[120px] w-[120px] rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -left-8 h-[100px] w-[100px] rounded-full bg-white/5" />
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-white/90">
            Webinar Ticket
          </span>
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">
            {statusLabel}
          </span>
        </div>
        <h3 className="font-serif text-2xl mb-1">{title}</h3>
        <p className="text-sm text-white/95 mb-4">
          {expert} · {date}
        </p>
        <div className="mb-5 text-sm text-white/95">
          {meta}
        </div>
        <div className="flex items-center justify-between border-t border-white/20 pt-4">
          <div>
            <div className="text-xs text-white/90">Order ID</div>
            <div className="font-mono text-sm">{orderId}</div>
          </div>
          <Link
            href={`/dashboard/webinars/${slug}`}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-semibold transition inline-block',
              status === 'live'
                ? 'bg-white text-teal-700 hover:bg-white/90'
                : 'bg-white/20 text-white hover:bg-white/30'
            )}
          >
            {actionLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
