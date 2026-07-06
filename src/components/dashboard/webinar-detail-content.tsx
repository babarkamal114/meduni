'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { TicketPurchaseModal } from '@/components/dashboard/ticket-purchase-modal';
import type { TicketPurchaseModalData } from '@/components/dashboard/ticket-purchase-modal';
import type { Webinar } from '@/lib/data/webinars';
import { formatDuration } from '@/lib/utils/formatDuration';
import { getJoinWebinarUrl } from '@/app/dashboard/webinars/actions';
import { User, Calendar, Clock, ArrowLeft, Video, ExternalLink, CheckCircle2 } from 'lucide-react';

interface WebinarDetailContentProps {
  webinar: Webinar;
  hasAccess: boolean;
}

export function WebinarDetailContent({ webinar, hasAccess }: WebinarDetailContentProps): React.ReactElement {
  const [modalOpen, setModalOpen] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const modalData: TicketPurchaseModalData = {
    title: webinar.title,
    expert: webinar.expert,
    date: webinar.dateLabel,
    duration: webinar.duration,
    price: webinar.price,
    type: webinar.status === 'recorded' ? 'recorded' : webinar.status === 'live' ? 'live' : 'upcoming',
  };

  const handleJoinWebinar = async () => {
    setJoinError(null);
    setJoinLoading(true);
    try {
      const result = await getJoinWebinarUrl(webinar.slug);
      if ('url' in result) {
        window.location.href = result.url;
        return;
      }
      setJoinError(result.error);
    } finally {
      setJoinLoading(false);
    }
  };

  const handlePurchaseSuccess = () => {
    setModalOpen(false);
    window.location.href = `/dashboard/webinars/${webinar.slug}`;
  };

  const isLiveOrUpcoming = webinar.status === 'live' || webinar.status === 'upcoming';
  const showBuyTicket = isLiveOrUpcoming && !hasAccess;
  const showJoinWebinar = isLiveOrUpcoming && hasAccess;
  const showWatchReplay = webinar.status === 'recorded' && hasAccess && webinar.hasReplay;
  const hasOutcomes = webinar.outcomes && webinar.outcomes.length > 0;

  return (
    <>
      <div className="px-6 lg:px-8 py-8 max-w-[900px]">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
          <Link href="/dashboard/webinars" className='text-teal-600 flex items-center gap-2'>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Webinars
          </Link>
        </Button>

        <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
          {/* Hero */}
          <div
            className={`h-36 sm:h-40 bg-gradient-to-br ${webinar.gradientClass} flex items-center justify-center`}
          >
            <Video className="h-16 w-16 text-white/90" strokeWidth={1} />
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Status + title */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge
                  status={webinar.status === 'recorded' ? 'recorded' : webinar.status}
                >
                  {webinar.statusLabel}
                </StatusBadge>
                {hasAccess && (
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    You have access
                  </span>
                )}
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-slate-900 leading-tight">
                {webinar.title}
              </h1>
            </div>

            {/* Meta */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-600">
                <User className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span className="text-sm">{webinar.expert}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Calendar className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span className="text-sm">{webinar.dateLabel}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Clock className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span className="text-sm">{formatDuration(webinar.duration)}</span>
              </div>
            </div>

            {/* Outcomes */}
            {hasOutcomes && (
              <div className="rounded-xl bg-slate-50 p-5">
                <h2 className="text-sm font-semibold text-slate-700 mb-3">What you&apos;ll learn</h2>
                <ul className="space-y-2">
                  {webinar.outcomes!.map((outcome, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600 mt-0.5" strokeWidth={1.5} />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price + CTAs */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-6 space-y-4">
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-sm text-slate-500">Price </span>
                  <span className="font-serif text-xl text-teal-600">£{webinar.price}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {showBuyTicket && (
                    <Button onClick={() => setModalOpen(true)}>
                      Buy Ticket
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                  {showJoinWebinar && (
                    <>
                      <Button onClick={handleJoinWebinar} disabled={joinLoading}>
                        {joinLoading ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Opening...
                          </>
                        ) : (
                          <>
                            Join Webinar
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                      {joinError && (
                        <p className="text-sm text-amber-600 w-full">{joinError}</p>
                      )}
                    </>
                  )}
                  {showWatchReplay && (
                    <Button asChild>
                      <Link href={`/dashboard/webinars/${webinar.slug}/replay`}>
                        Watch Replay
                        <Video className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TicketPurchaseModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        data={modalData}
        webinarSlug={webinar.slug}
        onSuccess={handlePurchaseSuccess}
      />
    </>
  );
}
