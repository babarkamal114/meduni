import Link from 'next/link';
import { getUser } from '@/lib/auth/getUser';
import { getRecentActivity, ACTIVITY_PAGE_SIZE } from '@/lib/data/dashboard';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { Button } from '@/components/ui/button';

interface ActivityPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function DashboardActivityPage({
  searchParams,
}: ActivityPageProps): Promise<React.ReactElement> {
  const user = await getUser();
  if (!user) {
    return (
      <div className="px-6 lg:px-8 py-8">
        <p className="text-slate-600">Sign in to see your activity.</p>
      </div>
    );
  }

  const params = await searchParams;
  const page = Math.max(0, parseInt(params.page ?? '0', 10) || 0);
  const offset = page * ACTIVITY_PAGE_SIZE;

  const activities = await getRecentActivity(user.id, ACTIVITY_PAGE_SIZE, offset);
  const hasMore = activities.length === ACTIVITY_PAGE_SIZE;
  const hasPrevious = page > 0;

  return (
    <div className="px-6 lg:px-8 py-8 max-w-[800px]">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-slate-900 mb-1">Activity</h1>
        <p className="text-slate-600 text-sm">
          Your learning activity, webinar purchases, and quiz results.
        </p>
      </div>

      {activities.length === 0 && page === 0 ? (
        <div className="rounded-2xl border border-black/5 bg-white p-8 text-center">
          <p className="text-slate-600 mb-4">No activity yet.</p>
          <Button variant="secondary" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <ActivityFeed activities={activities} className="space-y-4" />
          </div>

          {(hasPrevious || hasMore) && (
            <div className="mt-6 flex items-center justify-between">
              <div>
                {hasPrevious && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={page === 1 ? '/dashboard/activity' : `/dashboard/activity?page=${page - 1}`}>
                      Previous
                    </Link>
                  </Button>
                )}
              </div>
              <div className="text-sm text-slate-500">
                Page {page + 1}
              </div>
              <div>
                {hasMore && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/activity?page=${page + 1}`}>
                      Next
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
