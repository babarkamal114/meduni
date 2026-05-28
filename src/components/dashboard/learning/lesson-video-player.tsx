'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Maximize, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LessonVideoPlayerProps {
  url: string;
}

interface ProgressState {
  playedSeconds: number;
  loadedSeconds: number;
}

function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return '00:00';
  const whole = Math.floor(totalSeconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const seconds = whole % 60;
  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function LessonVideoPlayer({ url }: LessonVideoPlayerProps): React.ReactElement {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [progress, setProgress] = useState<ProgressState>({ playedSeconds: 0, loadedSeconds: 0 });

  const playedPercent = useMemo(() => {
    if (!durationSeconds) return 0;
    return Math.min(100, Math.max(0, (progress.playedSeconds / durationSeconds) * 100));
  }, [durationSeconds, progress.playedSeconds]);

  const loadedPercent = useMemo(() => {
    if (!durationSeconds) return 0;
    return Math.min(100, Math.max(0, (progress.loadedSeconds / durationSeconds) * 100));
  }, [durationSeconds, progress.loadedSeconds]);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleSeek = useCallback((nextSeconds: number) => {
    if (!playerRef.current) return;
    playerRef.current.currentTime = nextSeconds;
    setProgress((prev) => ({ ...prev, playedSeconds: nextSeconds }));
  }, []);

  const handleRequestFullscreen = useCallback(async () => {
    if (!containerRef.current?.requestFullscreen) return;
    try {
      await containerRef.current.requestFullscreen();
    } catch {
      // Ignore fullscreen errors caused by browser restrictions.
    }
  }, []);

  return (
    <div ref={containerRef} className="rounded-xl overflow-hidden border border-black/5 bg-black mb-6">
      <div className="relative aspect-video">
        <ReactPlayer
          ref={playerRef}
          src={url}
          width="100%"
          height="100%"
          controls={false}
          playing={isPlaying}
          muted={isMuted}
          volume={isMuted ? 0 : volume}
          playbackRate={playbackRate}
          onDurationChange={setDurationSeconds}
          onProgress={(state) =>
            setProgress({
              playedSeconds: state.playedSeconds,
              loadedSeconds: state.loadedSeconds,
            })
          }
          config={{
            youtube: {
              playerVars: {
                controls: 0,
                modestbranding: 1,
                rel: 0,
                iv_load_policy: 3,
              },
            },
          }}
          className="bg-black"
        />
      </div>

      <div className="space-y-3 bg-slate-950/90 p-3">
        <div className="relative h-2 rounded-full bg-slate-700/70">
          <div
            className="absolute left-0 top-0 h-2 rounded-full bg-slate-500/60"
            style={{ width: `${loadedPercent}%` }}
          />
          <div
            className="absolute left-0 top-0 h-2 rounded-full bg-teal-500"
            style={{ width: `${playedPercent}%` }}
          />
          <input
            type="range"
            min={0}
            max={durationSeconds || 0}
            step={0.1}
            value={Math.min(progress.playedSeconds, durationSeconds || 0)}
            onChange={(event) => handleSeek(Number(event.target.value))}
            className="absolute inset-0 h-2 w-full cursor-pointer opacity-0"
            aria-label="Seek video"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-white">
          <Button type="button" size="sm" variant="secondary" onClick={handleTogglePlay}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button type="button" size="sm" variant="secondary" onClick={() => setIsMuted((prev) => !prev)}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(event) => {
              const nextVolume = Number(event.target.value);
              setVolume(nextVolume);
              if (nextVolume > 0 && isMuted) setIsMuted(false);
            }}
            className="h-2 w-24 cursor-pointer accent-teal-500"
            aria-label="Volume"
          />

          <div className="text-xs text-slate-200 tabular-nums ml-1">
            {formatTime(progress.playedSeconds)} / {formatTime(durationSeconds)}
          </div>

          <select
            value={playbackRate}
            onChange={(event) => setPlaybackRate(Number(event.target.value))}
            className="ml-auto rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white"
            aria-label="Playback speed"
          >
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>

          <Button type="button" size="sm" variant="secondary" onClick={handleRequestFullscreen}>
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
