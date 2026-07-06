'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface WebinarReplayPlayerProps {
  webinarTitle: string;
  replayUrl: string;
  slug: string;
}

export function WebinarReplayPlayer({
  webinarTitle,
  replayUrl,
  slug,
}: WebinarReplayPlayerProps): React.ReactElement {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="px-6 lg:px-8 py-8 max-w-[900px]">
      <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
        <Link href={`/dashboard/webinars/${slug}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {webinarTitle}
        </Link>
      </Button>
      <div className="rounded-2xl border border-black/5 bg-black overflow-hidden">
        <video
          ref={videoRef}
          src={replayUrl}
          controls
          className="w-full aspect-video"
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      </div>
      <h2 className="font-serif text-xl text-slate-900 mt-4">{webinarTitle}</h2>
    </div>
  );
}
