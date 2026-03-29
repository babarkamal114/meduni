'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { markLessonCompleteAndRevalidate } from '@/app/dashboard/learning/actions';

interface LessonCompleteButtonProps {
  lessonId: string;
  moduleSlug: string;
  completed: boolean;
}

export function LessonCompleteButton({ lessonId, moduleSlug, completed }: LessonCompleteButtonProps): React.ReactElement {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    if (completed) return;
    startTransition(async () => {
      await markLessonCompleteAndRevalidate(lessonId, moduleSlug);
      router.refresh();
    });
  };

  if (completed) {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-teal-600">
        <Check className="h-4 w-4" strokeWidth={2} />
        Completed
      </span>
    );
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? 'Saving…' : 'Mark complete'}
    </Button>
  );
}
