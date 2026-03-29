'use client';

import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs';
import { DashboardWebinarTicketCard } from '@/components/dashboard/dashboard-webinar-ticket-card';
import type { WebinarTicketStatus, WebinarForModal } from '@/components/dashboard/dashboard-webinar-ticket-card';
import { TicketPurchaseModal } from '@/components/dashboard/ticket-purchase-modal';
import type { TicketPurchaseModalData } from '@/components/dashboard/ticket-purchase-modal';
import { EmptyState } from '@/components/dashboard/empty-state';
import {
  useWebinars,
  usePurchaseWebinarTicket,
  getWebinarsQueryKey,
  getWebinarQueryKey,
} from '@/hooks/use-webinars';
import { Video, Loader2 } from 'lucide-react';
import type { Webinar } from '@/lib/data/webinars';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'recorded', label: 'Recorded' },
  { id: 'purchased', label: 'My Webinars' },
];

interface WebinarsContentProps {
  /** Optional initial data from server; when not provided, data is fetched via TanStack Query. */
  initialWebinars?: Webinar[];
  initialPurchasedSlugs?: string[];
}

function getCtaLabel(w: Webinar, hasAccess: boolean): string {
  if (w.status === 'recorded') {
    return hasAccess ? 'Watch Now' : 'Buy Ticket';
  }
  return hasAccess ? 'Join Webinar' : 'Buy Ticket';
}

function toWebinarForModal(w: Webinar): WebinarForModal {
  return {
    slug: w.slug,
    title: w.title,
    expert: w.expert,
    dateLabel: w.dateLabel,
    duration: w.duration,
    price: w.price,
    status: w.status as WebinarTicketStatus,
  };
}

function toModalData(w: Webinar): TicketPurchaseModalData {
  return {
    title: w.title,
    expert: w.expert,
    date: w.dateLabel,
    duration: w.duration,
    price: w.price,
    type: w.status === 'recorded' ? 'recorded' : w.status === 'live' ? 'live' : 'upcoming',
  };
}

export function WebinarsContent({
  initialWebinars: initialWebinarsProp,
  initialPurchasedSlugs: initialPurchasedSlugsProp = [],
}: WebinarsContentProps): React.ReactElement {
  const initialData =
    initialWebinarsProp?.length !== undefined && initialWebinarsProp.length > 0
      ? { webinars: initialWebinarsProp, purchasedSlugs: initialPurchasedSlugsProp }
      : undefined;
  const { data, isLoading, isError, error } = useWebinars(initialData);
  const purchaseMutation = usePurchaseWebinarTicket();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);

  const initialWebinars = data?.webinars ?? initialWebinarsProp ?? [];
  const initialPurchasedSlugs = data?.purchasedSlugs ?? initialPurchasedSlugsProp;

  const filtered = useMemo(() => {
    if (tab === 'all') return initialWebinars;
    if (tab === 'upcoming')
      return initialWebinars.filter((w) => w.status === 'live' || w.status === 'upcoming');
    if (tab === 'recorded') return initialWebinars.filter((w) => w.status === 'recorded');
    return initialWebinars.filter(
      (w) => w.purchased || initialPurchasedSlugs.includes(w.slug)
    );
  }, [tab, initialWebinars, initialPurchasedSlugs]);

  const handleGetTicket = (webinar: WebinarForModal) => {
    const full = initialWebinars.find((w) => w.slug === webinar.slug);
    if (full) {
      setSelectedWebinar(full);
      setModalOpen(true);
    }
  };

  const handlePurchaseSuccess = (slug: string) => {
    setModalOpen(false);
    setSelectedWebinar(null);
    queryClient.invalidateQueries({ queryKey: getWebinarsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getWebinarQueryKey(slug) });
  };

  const handlePurchase: (slug: string) => Promise<{ success: true; slug: string } | { success: false; error: string }> = async (slug) => {
    try {
      const result = await purchaseMutation.mutateAsync(slug);
      return { success: true, slug: result.slug };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Purchase failed' };
    }
  };

  return (
    <div className="px-6 lg:px-8 py-8 max-w-[1400px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-slate-900 mb-1">Webinars</h1>
          <p className="text-slate-600 text-sm">
            Browse, register, and attend expert-led sessions
          </p>
        </div>
      </div>
      <DashboardTabs tabs={TABS} value={tab} onChange={setTab} className="mb-8" />

      {isLoading && initialWebinars.length === 0 ? (
        <div className="flex items-center justify-center py-16" aria-busy="true">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : isError ? (
        <EmptyState
          icon={Video}
          title="Could not load webinars"
          description={error instanceof Error ? error.message : 'Something went wrong. Try again.'}
          actionLabel="Back to Overview"
          actionHref="/dashboard"
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Video}
          title="No webinars yet"
          description={
            tab === 'purchased'
              ? "You haven't registered for any webinars. Browse All or Upcoming to find one."
              : "No webinars match this filter. Check back later or try another tab."
          }
          actionLabel="Back to Overview"
          actionHref="/dashboard"
        />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((w, index) => {
              const hasAccess = w.purchased || initialPurchasedSlugs.includes(w.slug);
              return (
                <DashboardWebinarTicketCard
                  key={w.id}
                  slug={w.slug}
                  title={w.title}
                  expert={w.expert}
                  dateLabel={w.dateLabel}
                  duration={w.duration}
                  price={w.price}
                  status={w.status as WebinarTicketStatus}
                  statusLabel={w.statusLabel}
                  ctaLabel={getCtaLabel(w, hasAccess)}
                  description={w.outcomes?.[0] ?? (w.outcomes && w.outcomes.length > 1 ? w.outcomes.slice(0, 2).join(' · ') : null)}
                  variantIndex={index}
                  hasAccess={hasAccess}
                  onGetTicket={handleGetTicket}
                  webinarForModal={toWebinarForModal(w)}
                />
              );
            })}
          </div>
          <TicketPurchaseModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            data={selectedWebinar ? toModalData(selectedWebinar) : null}
            webinarSlug={selectedWebinar?.slug}
            onSuccess={handlePurchaseSuccess}
            onPurchase={handlePurchase}
          />
        </>
      )}
    </div>
  );
}
