'use client';

import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';

type Status = 'live' | 'upcoming' | 'recorded' | 'completed';

const statusConfig: Record<
  Status,
  { variant: 'live' | 'upcoming' | 'recorded' | 'completed'; showDot?: boolean }
> = {
  live: { variant: 'live', showDot: true },
  upcoming: { variant: 'upcoming' },
  recorded: { variant: 'recorded' },
  completed: { variant: 'completed' },
};

interface StatusBadgeProps {
  status: Status;
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({
  status,
  children,
  className,
}: StatusBadgeProps): React.ReactElement {
  const { variant, showDot } = statusConfig[status];
  return (
    <Badge variant={variant} className={cn('gap-1', className)}>
      {showDot && (
        <span
          className="h-1.5 w-1.5 rounded-full bg-current animate-[dotPulse_1.5s_infinite]"
          aria-hidden
        />
      )}
      {children}
    </Badge>
  );
}
