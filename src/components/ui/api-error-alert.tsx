'use client';

import { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ApiErrorAlertProps {
  /** Backend/API error message to show. When empty, nothing is rendered. */
  message: string | null | undefined;
  /** Called when the user dismisses or when auto-dismiss runs. */
  onDismiss: () => void;
  /** Auto-dismiss after this many ms. Set to 0 or omit to disable. */
  autoDismissMs?: number;
  /** Optional extra class for the container. */
  className?: string;
}

export function ApiErrorAlert({
  message,
  onDismiss,
  autoDismissMs = 6000,
  className,
}: ApiErrorAlertProps): React.ReactElement | null {
  const visible = Boolean(message?.trim());

  useEffect(() => {
    if (!visible || !autoDismissMs) return;
    const t = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(t);
  }, [visible, autoDismissMs, onDismiss]);

  if (!visible) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'fixed top-4 right-4 z-50 flex max-w-sm items-start gap-3 rounded-lg border border-red-200 bg-white p-4 shadow-lg ring-1 ring-black/5',
        'animate-fade-in',
        className
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertCircle className="h-5 w-5" aria-hidden />
      </span>
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-sm font-medium text-slate-900">Something went wrong</p>
        <p className="mt-1 text-sm text-red-600">{message?.trim()}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
