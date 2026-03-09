import { getUser } from '@/lib/auth/getUser';
import { OverviewContent } from '@/components/dashboard/overview-content';

export default async function DashboardPage(): Promise<React.ReactElement> {
  const user = await getUser();
  return (
    <OverviewContent userName={user?.full_name ?? null} />
  );
}
