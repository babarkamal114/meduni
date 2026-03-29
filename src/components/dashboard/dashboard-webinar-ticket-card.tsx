'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { formatDuration } from '@/lib/utils/formatDuration';
import { Button } from '@/components/ui/button';
import { User, Clock, Calendar } from 'lucide-react';

export type WebinarTicketStatus = 'live' | 'upcoming' | 'recorded';

const GRADIENT_VARIANTS: Record<WebinarTicketStatus, string[]> = {
  live: ['from-teal-500 to-teal-700', 'from-emerald-500 to-emerald-700', 'from-cyan-500 to-cyan-700'],
  upcoming: ['from-indigo-500 to-indigo-600', 'from-violet-500 to-violet-600', 'from-blue-500 to-blue-600'],
  recorded: ['from-slate-500 to-slate-600', 'from-zinc-500 to-zinc-600', 'from-stone-500 to-stone-600'],
};

export interface WebinarForModal {
  slug: string;
  title: string;
  expert: string;
  dateLabel: string;
  duration: string;
  price: string;
  status: WebinarTicketStatus;
}

export interface DashboardWebinarTicketCardProps {
  slug: string;
  title: string;
  expert: string;
  dateLabel: string;
  duration: string;
  price: string;
  status: WebinarTicketStatus;
  statusLabel: string;
  ctaLabel: string;
  /** Short description or summary (e.g. from outcomes). */
  description?: string | null;
  variantIndex?: number;
  hasAccess: boolean;
  onGetTicket?: (webinar: WebinarForModal) => void;
  webinarForModal: WebinarForModal;
}

export function DashboardWebinarTicketCard({
  slug,
  title,
  expert,
  dateLabel,
  duration,
  price,
  status,
  statusLabel,
  ctaLabel,
  description,
  variantIndex = 0,
  hasAccess,
  onGetTicket,
  webinarForModal,
}: DashboardWebinarTicketCardProps): React.ReactElement {
  const variants = GRADIENT_VARIANTS[status];
  const gradientClass = variants[Math.abs(variantIndex) % variants.length];
  const isLive = status === 'live';

  return (
    <div className="relative flex flex-col overflow-hidden rounded-[20px] bg-white border border-slate-200/80 shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md">
      {/* Gradient header with title (no image) */}
      <Link href={`/dashboard/webinars/${slug}`} className="block">
        <div
          className={cn(
            'relative overflow-hidden px-6 pt-6 pb-5 bg-gradient-to-br',
            gradientClass
          )}
        >
          <div className="absolute -right-5 -top-5 h-[100px] w-[100px] rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-6 h-[80px] w-[80px] rounded-full bg-white/5" />
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs uppercase tracking-wider text-white/90">Webinar</span>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white shrink-0">
                {statusLabel}
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-white leading-tight">{title}</h3>
          </div>
        </div>
      </Link>

      {/* Mandatory info: author, timing, duration, price, description */}
      <div className="flex flex-1 flex-col p-5 min-h-0">
        <Link href={`/dashboard/webinars/${slug}`} className="flex flex-1 flex-col min-h-0">
          <div className="space-y-2.5 mb-4">
            <div className="flex items-center gap-2 text-slate-600">
              <User className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.5} />
              <span className="text-sm font-medium text-slate-800">{expert || '—'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.5} />
              <span className="text-sm">{dateLabel}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.5} />
              <span className="text-sm">{formatDuration(duration)}</span>
            </div>
          </div>

          {description ? (
            <p className="text-sm text-slate-600 line-clamp-2 mb-4">{description}</p>
          ) : null}

          <div className="mt-auto pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">Price</span>
            <p className="font-serif text-3xl text-teal-600">£{price}</p>
          </div>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-3">
          {hasAccess ? (
            <Link
              href={`/dashboard/webinars/${slug}`}
              className={cn(
                'rounded-lg px-5 py-3 text-base font-semibold transition inline-block',
                isLive
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              {ctaLabel}
            </Link>
          ) : onGetTicket ? (
            <Button
              type="button"
              size="default"
              className="rounded-lg px-6 py-3 text-base font-semibold bg-teal-600 hover:bg-teal-700 text-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onGetTicket(webinarForModal);
              }}
            >
              Get ticket
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
