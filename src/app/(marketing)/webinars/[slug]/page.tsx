import { notFound } from 'next/navigation';
import { getWebinarBySlug } from '@/lib/data/webinars';
import { getUser } from '@/lib/auth/getUser';
import { getPurchasedWebinarSlugs } from '@/app/dashboard/webinars/actions';
import { WebinarDetailContent } from '@/components/marketing/webinar-detail-content';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function WebinarDetailPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const webinar = await getWebinarBySlug(slug);
  if (!webinar) notFound();

  const [user, purchasedSlugs] = await Promise.all([
    getUser(),
    getPurchasedWebinarSlugs(),
  ]);
  const hasAccess =
    webinar.purchased || purchasedSlugs.includes(slug);
  const isLoggedIn = !!user;

  return (
    <div className="py-12 sec-tint min-h-screen">
      <WebinarDetailContent
        webinar={webinar}
        hasAccess={hasAccess}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}
