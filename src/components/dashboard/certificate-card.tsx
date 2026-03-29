'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { ReactNode } from 'react';

export interface CertificateCardProps {
  title: string;
  completedDate: string;
  cpdPoints?: number;
  icon: ReactNode;
  iconBg?: string;
  viewHref: string;
  downloadHref: string;
}

export function CertificateCard({
  title,
  completedDate,
  cpdPoints,
  icon,
  iconBg = 'bg-teal-50',
  viewHref,
  downloadHref,
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
            Completed {completedDate}
            {cpdPoints != null && ` · ${cpdPoints} CPD Points`}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Link
          href={viewHref}
          className={cn(
            'flex flex-1 items-center justify-center rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700',
            'focus-visible:outline focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2'
          )}
        >
          View
        </Link>
        <a
          href={downloadHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex flex-1 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300',
            'focus-visible:outline focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2'
          )}
        >
          Download PDF
        </a>
      </div>
    </div>
  );
}
