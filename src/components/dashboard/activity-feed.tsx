'use client';

import { RecentActivityList, type ActivityItem } from '@/components/dashboard/recent-activity-list';
import { Check, CreditCard, Star } from 'lucide-react';
import type { RecentActivityItem } from '@/lib/data/dashboard';

function activityToItem(a: RecentActivityItem): ActivityItem {
  const meta = a.meta;
  switch (a.type) {
    case 'lesson':
      return {
        icon: <Check className="h-4 w-4 text-green-500" strokeWidth={2} />,
        iconBg: 'bg-green-50',
        title: (
          <>
            <strong>Completed</strong> {a.title}
          </>
        ),
        meta,
      };
    case 'webinar_purchase':
      return {
        icon: <CreditCard className="h-4 w-4 text-teal-500" strokeWidth={2} />,
        iconBg: 'bg-teal-50',
        title: (
          <>
            <strong>Purchased</strong> ticket for {a.title}
          </>
        ),
        meta,
      };
    case 'quiz':
    case 'content_quiz':
      return {
        icon: <Star className="h-4 w-4 text-indigo-500" strokeWidth={2} />,
        iconBg: 'bg-indigo-50',
        title: (
          <>
            <strong>Quiz</strong> {a.title}
          </>
        ),
        meta,
      };
    default:
      return {
        icon: <Check className="h-4 w-4 text-slate-500" strokeWidth={2} />,
        iconBg: 'bg-slate-100',
        title: a.title,
        meta,
      };
  }
}

interface ActivityFeedProps {
  activities: RecentActivityItem[];
  className?: string;
}

export function ActivityFeed({ activities, className }: ActivityFeedProps): React.ReactElement {
  const items = activities.map(activityToItem);
  return <RecentActivityList items={items} className={className} />;
}
