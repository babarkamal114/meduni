'use client';

import { cn } from '@/lib/utils/cn';

export interface TabItem {
  id: string;
  label: string;
}

interface DashboardTabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

export function DashboardTabs({
  tabs,
  value,
  onChange,
  className,
}: DashboardTabsProps): React.ReactElement {
  return (
    <div
      className={cn(
        'flex w-fit gap-0.5 rounded-xl bg-slate-100 p-1',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'rounded-[10px] px-5 py-2 text-sm font-medium transition-all duration-250',
            value === tab.id
              ? 'bg-white text-teal-600 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-800'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
