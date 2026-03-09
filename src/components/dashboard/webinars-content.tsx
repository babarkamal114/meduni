'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs';
import { DashboardWebinarCard } from '@/components/dashboard/dashboard-webinar-card';
import type { WebinarStatus } from '@/components/dashboard/dashboard-webinar-card';
import { MOCK_WEBINARS, getCardGradient } from '@/lib/data/mock-webinars';
import {
  Heart,
  Baby,
  Brain,
  Play,
  Stethoscope,
  Scissors,
} from 'lucide-react';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'recorded', label: 'Recorded' },
  { id: 'purchased', label: 'My Webinars' },
];

const ICON_BY_ID: Record<string, React.ReactNode> = {
  '1': <Heart className="h-12 w-12" strokeWidth={1} />,
  '2': <Baby className="h-12 w-12" strokeWidth={1} />,
  '3': <Brain className="h-12 w-12" strokeWidth={1} />,
  '4': <Play className="h-12 w-12" strokeWidth={1} />,
  '5': <Stethoscope className="h-12 w-12" strokeWidth={1} />,
  '6': <Scissors className="h-12 w-12" strokeWidth={1} />,
};

interface WebinarsContentProps {
  initialPurchasedSlugs?: string[];
}

export function WebinarsContent({ initialPurchasedSlugs = [] }: WebinarsContentProps): React.ReactElement {
  const router = useRouter();
  const [tab, setTab] = useState('all');

  const filtered = useMemo(() => {
    if (tab === 'all') return MOCK_WEBINARS;
    if (tab === 'upcoming')
      return MOCK_WEBINARS.filter((w) => w.status === 'live' || w.status === 'upcoming');
    if (tab === 'recorded') return MOCK_WEBINARS.filter((w) => w.status === 'recorded');
    return MOCK_WEBINARS.filter(
      (w) => w.purchased || initialPurchasedSlugs.includes(w.slug)
    );
  }, [tab, initialPurchasedSlugs]);

  const goToDetail = (slug: string) => {
    router.push(`/dashboard/webinars/${slug}`);
  };

  function getCtaLabel(
    w: (typeof MOCK_WEBINARS)[0],
    hasAccess: boolean
  ): string {
    if (w.status === 'recorded') {
      return hasAccess ? 'Watch Now' : 'Buy Ticket';
    }
    return hasAccess ? 'Join Webinar' : 'Buy Ticket';
  }

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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((w) => {
          const hasAccess = w.purchased || initialPurchasedSlugs.includes(w.slug);
          return (
            <DashboardWebinarCard
              key={w.id}
              title={w.title}
              expert={w.expert}
              duration={w.duration}
              price={w.price}
              status={w.status as WebinarStatus}
              statusLabel={w.statusLabel}
              gradientClass={getCardGradient(w.id)}
              icon={ICON_BY_ID[w.id] ?? null}
              ctaLabel={getCtaLabel(w, hasAccess)}
              onClick={() => goToDetail(w.slug)}
            />
          );
        })}
      </div>
    </div>
  );
}
