'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { TicketPurchaseModal } from '@/components/dashboard/ticket-purchase-modal';
import type { TicketPurchaseModalData } from '@/components/dashboard/ticket-purchase-modal';
import type { MockWebinar } from '@/lib/data/mock-webinars';
import { getCardGradient } from '@/lib/data/mock-webinars';
import { getJoinWebinarUrl } from '@/app/dashboard/webinars/actions';
import { User, Calendar, Clock, ArrowLeft, Video, ExternalLink } from 'lucide-react';

interface WebinarDetailContentProps {
  webinar: MockWebinar;
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
  const showStartsIn = isLiveOrUpcoming && hasAccess && !joinError;

  return (
    <>
      <div className="px-6 lg:px-8 py-8 max-w-[900px]">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
          <Link href="/dashboard/webinars">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Webinars
          </Link>
        </Button>

        <div className="rounded-2xl border border-black/5 bg-white overflow-hidden">
          <div
            className={`h-32 bg-gradient-to-br ${getCardGradient(webinar.id)} flex items-center justify-center`}
          >
            <Video className="h-14 w-14 text-slate-600" strokeWidth={1} />
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
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
            <h1 className="font-serif text-2xl sm:text-3xl text-slate-900 mb-4">
              {webinar.title}
            </h1>
            <div className="space-y-3 mb-6">
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
                <span className="text-sm">{webinar.duration}</span>
              </div>
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
              {showStartsIn && !showJoinWebinar && (
                <p className="text-sm text-slate-500">
                  Join link available 15 minutes before start time.
                </p>
              )}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100">
              <span className="text-sm text-slate-500">Price </span>
              <span className="font-serif text-xl text-teal-600">{webinar.price}</span>
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
