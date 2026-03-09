import { getPurchasedWebinarSlugs } from '@/app/dashboard/webinars/actions';
import { WebinarsContent } from '@/components/dashboard/webinars-content';

export default async function DashboardWebinarsPage(): Promise<React.ReactElement> {
  const purchasedSlugs = await getPurchasedWebinarSlugs();
  return <WebinarsContent initialPurchasedSlugs={purchasedSlugs} />;
}
