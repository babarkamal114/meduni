import { notFound } from 'next/navigation';
import { getWebinarBySlug } from '@/lib/data/webinars';
import { getReplayUrl } from '@/app/dashboard/webinars/actions';
import { WebinarReplayPlayer } from '@/components/dashboard/webinar-replay-player';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DashboardWebinarReplayPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const [webinar, result] = await Promise.all([
    getWebinarBySlug(slug),
    getReplayUrl(slug),
  ]);
  if (!webinar || 'error' in result) notFound();
  return (
    <WebinarReplayPlayer
      webinarTitle={webinar.title}
      replayUrl={result.url}
      slug={slug}
    />
  );
}
