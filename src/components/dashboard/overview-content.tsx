'use client';

import Link from 'next/link';
import { StatsCard } from '@/components/dashboard/stats-card';
import { UpcomingWebinarRow } from '@/components/dashboard/upcoming-webinar-row';
import { LearningProgressBlock } from '@/components/dashboard/learning-progress-block';
import { RecentActivityList } from '@/components/dashboard/recent-activity-list';
import { Button } from '@/components/ui/button';
import { Heart, Baby, Brain, Check, CreditCard, Play } from 'lucide-react';

interface OverviewContentProps {
  userName: string | null;
}

export function OverviewContent({ userName }: OverviewContentProps): React.ReactElement {
  const upcoming = [
    {
      slug: 'cardiology-update-2025',
      title: 'Cardiology Update 2025',
      date: 'Tomorrow, 7:00 PM',
      expert: 'Dr. James Carter',
      duration: '1.5 hours',
      price: '£29.99',
      type: 'live' as const,
      statusLabel: 'Live',
    },
    {
      slug: 'paediatric-emergencies',
      title: 'Paediatric Emergencies',
      date: 'Fri 24 Jan, 6:30 PM',
      expert: 'Dr. Lisa Nguyen',
      duration: '2 hours',
      price: '£34.99',
      type: 'upcoming' as const,
      statusLabel: 'In 5 days',
    },
    {
      slug: 'mental-health-primary-care',
      title: 'Mental Health in Primary Care',
      date: 'Mon 3 Feb, 7:00 PM',
      expert: 'Prof. Alan Brooks',
      duration: '1.5 hours',
      price: '£24.99',
      type: 'upcoming' as const,
      statusLabel: 'In 2 weeks',
    },
  ];

  const progressItems = [
    { label: 'Cardiology Module', percent: 85 },
    { label: 'Neurology Basics', percent: 62 },
    { label: 'Paediatrics Review', percent: 40 },
    { label: 'Dermatology Cases', percent: 95 },
  ];

  const activities = [
    {
      icon: <Check className="h-4 w-4 text-green-500" strokeWidth={2} />,
      iconBg: 'bg-green-50',
      title: (
        <>
          <strong>Completed</strong> Dermatology Case Study Quiz
        </>
      ),
      meta: 'Score: 92% · 2 hours ago',
    },
    {
      icon: <CreditCard className="h-4 w-4 text-teal-500" strokeWidth={2} />,
      iconBg: 'bg-teal-50',
      title: (
        <>
          <strong>Purchased</strong> ticket for Cardiology Update 2025
        </>
      ),
      meta: '£29.99 · Yesterday',
    },
    {
      icon: <Play className="h-4 w-4 text-indigo-500" strokeWidth={2} />,
      iconBg: 'bg-indigo-50',
      title: (
        <>
          <strong>Watched</strong> replay: Emergency Medicine Masterclass
        </>
      ),
      meta: 'Duration: 1h 45m · 3 days ago',
    },
  ];

  const name = userName?.split(' ')[0] ?? 'there';

  return (
    <>
      <div className="px-6 lg:px-8 py-8 max-w-[1400px]">
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl text-slate-900 mb-1">
            Good morning, {name}
          </h1>
          <p className="text-slate-600">Here&apos;s your learning overview for this week.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Webinars Attended"
            value={12}
            icon="Video"
            badge="+3 this month"
          />
          <StatsCard
            title="Learning Hours"
            value="18.5h"
            icon="Clock"
            mono="42h total"
          />
          <StatsCard
            title="Quiz Average"
            value="87%"
            icon="Star"
            miniChart={[40, 60, 80, 50, 90, 70, 95]}
          />
          <StatsCard
            title="Active Tickets"
            value={5}
            icon="Ticket"
            badge="3 upcoming"
          />
        </div>

        <div className="grid lg:grid-cols-5 gap-6 mb-8">
          <div className="lg:col-span-3 rounded-2xl border border-black/5 bg-white p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl text-slate-900">Upcoming Webinars</h2>
              <Button variant="secondary" size="sm" className="text-xs" asChild>
                <Link href="/dashboard/webinars">View All</Link>
              </Button>
            </div>
            <div className="space-y-3">
              {upcoming.map((w) => (
                <UpcomingWebinarRow
                  key={w.slug}
                  title={w.title}
                  expert={w.expert}
                  date={w.date}
                  status={w.type === 'live' ? 'live' : 'upcoming'}
                  statusLabel={w.statusLabel}
                  icon={
                    w.type === 'live' ? (
                      <Heart className="h-6 w-6 text-red-400" strokeWidth={1.5} />
                    ) : (
                      <Baby className="h-6 w-6 text-teal-500" strokeWidth={1.5} />
                    )
                  }
                  href={`/dashboard/webinars/${w.slug}`}
                />
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 rounded-2xl border border-black/5 bg-white p-6">
            <h2 className="font-serif text-xl text-slate-900 mb-5">
              Learning Progress
            </h2>
            <LearningProgressBlock
              items={progressItems}
              callout={{
                title: '2 certificates earned!',
                subtitle: 'Complete 1 more module to unlock your next.',
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-6">
          <h2 className="font-serif text-xl text-slate-900 mb-5">Recent Activity</h2>
          <RecentActivityList items={activities} className="space-y-4" />
        </div>
      </div>
    </>
  );
}
