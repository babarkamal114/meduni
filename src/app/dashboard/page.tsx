import { getUser } from '@/lib/auth/getUser';
import { OverviewContent } from '@/components/dashboard/overview-content';
import {
  getDashboardStats,
  getUpcomingWebinarsForDashboard,
  getRecentActivity,
} from '@/lib/data/dashboard';
import {
  getLearningCards,
  getCertificationsWithDetails,
} from '@/lib/data/learning';

export default async function DashboardPage(): Promise<React.ReactElement> {
  const user = await getUser();
  if (!user) {
    return (
      <div className="px-6 lg:px-8 py-8">
        <p className="text-slate-600">Sign in to see your dashboard.</p>
      </div>
    );
  }

  const [stats, upcomingWebinars, learningCards, certifications, activities] =
    await Promise.all([
      getDashboardStats(user.id),
      getUpcomingWebinarsForDashboard(user.id),
      getLearningCards(user.id),
      getCertificationsWithDetails(user.id),
      getRecentActivity(user.id, 5),
    ]);

  const progressItems = learningCards
    .filter((c) => c.type === 'Module')
    .slice(0, 4)
    .map((c) => ({ label: c.title, percent: c.progress }));

  return (
    <OverviewContent
      userName={user.full_name ?? null}
      stats={{
        webinarsAttended: stats.webinarsAttended,
        learningHoursLabel: stats.learningHoursLabel,
        quizAveragePercent: stats.quizAveragePercent,
        activeTickets: stats.activeTickets,
        activeTicketsUpcoming: stats.activeTicketsUpcoming,
      }}
      upcomingWebinars={upcomingWebinars}
      progressItems={progressItems}
      certificateCount={certifications.length}
      activities={activities}
    />
  );
}
