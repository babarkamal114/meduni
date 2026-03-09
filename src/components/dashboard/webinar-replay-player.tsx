'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { saveReplayProgress } from '@/app/dashboard/webinars/actions';

interface WebinarReplayPlayerProps {
  webinarTitle: string;
  replayUrl: string;
  slug: string;
}

const PROGRESS_SAVE_INTERVAL_MS = 30_000;

export function WebinarReplayPlayer({
  webinarTitle,
  replayUrl,
  slug,
}: WebinarReplayPlayerProps): React.ReactElement {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lastSaved, setLastSaved] = useState(0);

  const saveProgress = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    const seconds = Math.floor(el.currentTime);
    if (seconds > lastSaved) {
      setLastSaved(seconds);
      void saveReplayProgress(slug, seconds);
    }
  }, [slug, lastSaved]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const id = setInterval(saveProgress, PROGRESS_SAVE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [saveProgress]);

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
