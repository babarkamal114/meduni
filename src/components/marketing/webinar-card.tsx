import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import type { Webinar } from '@/lib/data/webinars';
import { cn } from '@/lib/utils/cn';
import { formatDuration } from '@/lib/utils/formatDuration';

export interface MarketingWebinarCardProps {
  webinar: Webinar;
}

export function MarketingWebinarCard({ webinar }: MarketingWebinarCardProps): React.ReactElement {
  return (
    <Link
      href={`/webinars/${webinar.slug}`}
      className={cn(
        'card rounded-2xl overflow-hidden block text-left transition-all hover:border-teal-500/30 group',
        'border border-black/5'
      )}
    >
      <div
        className={cn(
          'h-1.5 w-full bg-gradient-to-r',
          webinar.gradientClass ?? 'from-teal-400/60 to-teal-200/60'
        )}
      />
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-teal-600 uppercase tracking-wider">
            {webinar.statusLabel}
          </span>
          {webinar.discipline ? (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
              {webinar.discipline}
            </span>
          ) : null}
        </div>
        <h3 className="font-serif text-xl text-slate-800 mt-2 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
          {webinar.title}
        </h3>
        <p className="text-sm text-slate-600 mb-4">{webinar.expert}</p>
        <div className="flex items-center gap-4 text-xs text-slate-600 mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {webinar.dateLabel}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatDuration(webinar.duration)}
          </span>
        </div>
        {webinar.outcomes?.length ? (
          <ul className="space-y-2 mb-5">
            {webinar.outcomes.slice(0, 4).map((outcome) => (
              <li key={outcome} className="text-sm text-slate-600 leading-relaxed">
                <span className="text-teal-600 mr-2">•</span>
                {outcome}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="flex items-center justify-between">
          <span className="font-serif text-lg text-teal-600">£{webinar.price}</span>
          <span className="text-sm text-teal-600 flex items-center gap-1 group-hover:gap-2 transition-all">
            Learn more
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
