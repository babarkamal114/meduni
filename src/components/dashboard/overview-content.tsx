'use client';

import Link from 'next/link';
import { StatsCard } from '@/components/dashboard/stats-card';
import { UpcomingWebinarRow } from '@/components/dashboard/upcoming-webinar-row';
import { LearningProgressBlock } from '@/components/dashboard/learning-progress-block';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { Button } from '@/components/ui/button';
import { Heart, Baby } from 'lucide-react';
import type { Webinar } from '@/lib/data/webinars';
import type { RecentActivityItem } from '@/lib/data/dashboard';

export interface DashboardStatsProps {
  webinarsAttended: number;
  learningHoursLabel: string;
  quizAveragePercent: number | null;
  activeTickets: number;
  activeTicketsUpcoming?: number;
}

interface OverviewContentProps {
  userName: string | null;
  stats: DashboardStatsProps;
  upcomingWebinars: Webinar[];
  progressItems: { label: string; percent: number }[];
  certificateCount: number;
  activities: RecentActivityItem[];
}

export function OverviewContent({
  userName,
  stats,
  upcomingWebinars,
  progressItems,
  certificateCount,
  activities,
}: OverviewContentProps): React.ReactElement {
  const name = userName?.split(' ')[0] ?? 'there';
  const quizDisplay =
    stats.quizAveragePercent != null ? `${stats.quizAveragePercent}%` : '—';
  const activeBadge =
    stats.activeTicketsUpcoming != null && stats.activeTicketsUpcoming > 0
      ? `${stats.activeTicketsUpcoming} upcoming`
      : undefined;

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
            value={stats.webinarsAttended}
            icon="Video"
          />
          <StatsCard
            title="Learning Hours"
            value={stats.learningHoursLabel}
            icon="Clock"
          />
          <StatsCard
            title="Quiz Average"
            value={quizDisplay}
            icon="Star"
          />
          <StatsCard
            title="Active Tickets"
            value={stats.activeTickets}
            icon="Ticket"
            badge={activeBadge}
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
              {upcomingWebinars.length === 0 ? (
                <p className="text-sm text-slate-500 py-2">No upcoming webinars.</p>
              ) : (
                upcomingWebinars.map((w) => (
                  <UpcomingWebinarRow
                    key={w.slug}
                    title={w.title}
                    expert={w.expert}
                    date={w.dateLabel}
                    status={w.status === 'live' ? 'live' : 'upcoming'}
                    statusLabel={w.statusLabel}
                    icon={
                      w.status === 'live' ? (
                        <Heart className="h-6 w-6 text-red-400" strokeWidth={1.5} />
                      ) : (
                        <Baby className="h-6 w-6 text-teal-500" strokeWidth={1.5} />
                      )
                    }
                    href={`/dashboard/webinars/${w.slug}`}
                  />
                ))
              )}
            </div>
          </div>
          <div className="lg:col-span-2 rounded-2xl border border-black/5 bg-white p-6">
            <h2 className="font-serif text-xl text-slate-900 mb-5">
              Learning Progress
            </h2>
            {progressItems.length === 0 ? (
              <p className="text-sm text-slate-500 py-2">No modules yet. Start learning from the Learning page.</p>
            ) : (
              <LearningProgressBlock
                items={progressItems}
                callout={
                  certificateCount > 0
                    ? {
                        title: `${certificateCount} certificate${certificateCount === 1 ? '' : 's'} earned!`,
                        subtitle: 'Complete more modules to unlock your next.',
                      }
                    : undefined
                }
              />
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl text-slate-900">Recent Activity</h2>
            <Button variant="secondary" size="sm" className="text-xs" asChild>
              <Link href="/dashboard/activity">View all</Link>
            </Button>
          </div>
          {activities.length === 0 ? (
            <p className="text-sm text-slate-500 py-2">No recent activity.</p>
          ) : (
            <ActivityFeed activities={activities} className="space-y-4" />
          )}
        </div>
      </div>
    </>
  );
}
