import { notFound } from 'next/navigation';
import { getWebinarBySlug } from '@/lib/data/mock-webinars';
import { getPurchasedWebinarSlugs } from '@/app/dashboard/webinars/actions';
import { WebinarDetailContent } from '@/components/dashboard/webinar-detail-content';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DashboardWebinarDetailPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const webinar = getWebinarBySlug(slug);
  if (!webinar) notFound();
  const purchasedSlugs = await getPurchasedWebinarSlugs();
  const hasAccess = webinar.purchased || purchasedSlugs.includes(slug);
  return <WebinarDetailContent webinar={webinar} hasAccess={hasAccess} />;
}
