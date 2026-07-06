'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { TicketPurchaseModal } from '@/components/dashboard/ticket-purchase-modal';
import type { TicketPurchaseModalData } from '@/components/dashboard/ticket-purchase-modal';
import { GlowButton } from '@/components/marketing/glow-button';
import type { Webinar } from '@/lib/data/webinars';
import { formatDuration } from '@/lib/utils/formatDuration';
import { getJoinWebinarUrl } from '@/app/dashboard/webinars/actions';
import { User, Calendar, Clock, ArrowLeft, Video, ExternalLink } from 'lucide-react';

interface WebinarDetailContentProps {
  webinar: Webinar;
  hasAccess: boolean;
  isLoggedIn: boolean;
}

export function WebinarDetailContent({
  webinar,
  hasAccess,
  isLoggedIn,
}: WebinarDetailContentProps): React.ReactElement {
  const [modalOpen, setModalOpen] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const modalData: TicketPurchaseModalData = {
    title: webinar.title,
    expert: webinar.expert,
    date: webinar.dateLabel,
    duration: webinar.duration,
    price: webinar.price,
    type:
      webinar.status === 'recorded'
        ? 'recorded'
        : webinar.status === 'live'
          ? 'live'
          : 'upcoming',
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
  const showAuthCTAs = !isLoggedIn;
  const showBuyTicket = isLoggedIn && isLiveOrUpcoming && !hasAccess;
  const showBuyReplay = isLoggedIn && webinar.status === 'recorded' && !hasAccess;
  const showJoinWebinar = isLiveOrUpcoming && hasAccess;
  const showWatchReplay = webinar.status === 'recorded' && hasAccess && webinar.hasReplay;
  const showViewInDashboard = hasAccess;

  const signInUrl = `/sign-in?redirect=${encodeURIComponent(`/webinars/${webinar.slug}`)}`;
  const signUpUrl = `/sign-up?redirect=${encodeURIComponent(`/webinars/${webinar.slug}`)}`;

  return (
    <>
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
        <Link
          href="/webinars"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Webinars
        </Link>

        <div className="card rounded-2xl overflow-hidden border border-black/5">
          <div
            className={`h-32 bg-gradient-to-br ${webinar.gradientClass} flex items-center justify-center`}
          >
            <Video className="h-14 w-14 text-slate-600" strokeWidth={1} />
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <StatusBadge
                status={
                  webinar.status === 'recorded' ? 'recorded' : webinar.status
                }
              >
                {webinar.statusLabel}
              </StatusBadge>
              {hasAccess && (
                <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-800">
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
                <span className="text-sm">{formatDuration(webinar.duration)}</span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Price</span>
                <span className="font-serif text-2xl text-teal-600">
                  £{webinar.price}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {showAuthCTAs && (
                <>
                  <GlowButton href={signInUrl} className="inline-flex gap-2">
                    Sign in to get ticket
                    <ExternalLink className="w-4 h-4" />
                  </GlowButton>
                  <Link
                    href={signUpUrl}
                    className="px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-500/30 transition-all font-medium text-sm"
                  >
                    Create account
                  </Link>
                </>
              )}
              {(showBuyTicket || showBuyReplay) && (
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="glow-btn inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-full relative z-10 text-sm"
                >
                  {webinar.status === 'recorded' ? 'Buy replay' : 'Get ticket'}
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
              {showJoinWebinar && (
                <>
                  <button
                    type="button"
                    onClick={handleJoinWebinar}
                    disabled={joinLoading}
                    className="glow-btn inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-full relative z-10 text-sm disabled:opacity-70"
                  >
                    {joinLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Opening...
                      </>
                    ) : (
                      <>
                        Join webinar
                        <ExternalLink className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  {joinError && (
                    <p className="text-sm text-amber-600 w-full">{joinError}</p>
                  )}
                </>
              )}
              {showWatchReplay && (
                <Link
                  href={`/dashboard/webinars/${webinar.slug}/replay`}
                  className="glow-btn inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-full relative z-10 text-sm"
                >
                  Watch replay
                  <Video className="w-4 h-4" />
                </Link>
              )}
              {showViewInDashboard && (
                <Link
                  href={`/dashboard/webinars/${webinar.slug}`}
                  className="px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-500/30 transition-all font-medium text-sm"
                >
                  View in dashboard
                </Link>
              )}
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
