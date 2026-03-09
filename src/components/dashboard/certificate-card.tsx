'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import type { ReactNode } from 'react';

export interface CertificateCardProps {
  title: string;
  completedDate: string;
  cpdPoints: number;
  icon: ReactNode;
  iconBg?: string;
}

export function CertificateCard({
  title,
  completedDate,
  cpdPoints,
  icon,
  iconBg = 'bg-teal-50',
}: CertificateCardProps): React.ReactElement {
  return (
    <div
      className={cn(
        'rounded-2xl border border-black/5 bg-white p-6 transition-all duration-300',
        'hover:border-teal-500/15 hover:shadow-lg'
      )}
    >
      <div className="mb-4 flex items-center gap-4">
        <div
          className={cn(
            'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl',
            iconBg
          )}
        >
          <div className="text-teal-600 [&>svg]:h-7 [&>svg]:w-7">{icon}</div>
        </div>
        <div>
          <h3 className="font-serif text-lg text-slate-800">{title}</h3>
          <p className="text-xs text-slate-600">
            Completed {completedDate} · {cpdPoints} CPD Points
          </p>
        </div>
      </div>
      <Button variant="secondary" className="w-full justify-center">
        Download Certificate
      </Button>
    </div>
  );
}
