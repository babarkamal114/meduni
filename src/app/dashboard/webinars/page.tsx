import { getPurchasedWebinarSlugs } from '@/app/dashboard/webinars/actions';
import { getWebinars, withPurchased } from '@/lib/data/webinars';
import { WebinarsContent } from '@/components/dashboard/webinars-content';

export default async function DashboardWebinarsPage(): Promise<React.ReactElement> {
  const [webinars, purchasedSlugs] = await Promise.all([
    getWebinars(),
    getPurchasedWebinarSlugs(),
  ]);
  const webinarsWithPurchased = withPurchased(webinars, purchasedSlugs);
  return (
    <WebinarsContent
      initialWebinars={webinarsWithPurchased}
      initialPurchasedSlugs={purchasedSlugs}
    />
  );
}
