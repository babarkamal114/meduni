'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, Calendar, Clock, Check, CreditCard } from 'lucide-react';
import { purchaseWebinarTicket } from '@/app/dashboard/webinars/actions';

export type WebinarType = 'live' | 'upcoming' | 'recorded';

export interface TicketPurchaseModalData {
  title: string;
  expert: string;
  date: string;
  duration: string;
  price: string;
  type: WebinarType;
}

interface TicketPurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: TicketPurchaseModalData | null;
  webinarSlug?: string;
  onSuccess?: (slug: string) => void;
}

export function TicketPurchaseModal({
  open,
  onOpenChange,
  data,
  webinarSlug,
  onSuccess,
}: TicketPurchaseModalProps): React.ReactElement {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setState('idle');
      setErrorMessage(null);
    }
    onOpenChange(next);
  };

  const handlePurchase = async () => {
    if (!webinarSlug) {
      setState('loading');
      await new Promise((r) => setTimeout(r, 1500));
      setState('success');
      setTimeout(() => {
        handleOpenChange(false);
        setState('idle');
      }, 1200);
      return;
    }
    setState('loading');
    setErrorMessage(null);
    const result = await purchaseWebinarTicket(webinarSlug);
    if (result.success) {
      setState('success');
      setTimeout(() => {
        handleOpenChange(false);
        setState('idle');
        onSuccess?.(result.slug);
      }, 1200);
    } else {
      setState('error');
      setErrorMessage(result.error);
    }
  };

  const isRecorded = data?.type === 'recorded';
  const ctaLabel = isRecorded ? 'Buy & Watch Now' : 'Purchase Ticket';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[480px] rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-6">
          <DialogTitle className="font-serif text-2xl text-slate-900">
            {data?.title ?? 'Webinar'}
          </DialogTitle>
        </DialogHeader>
        {data && (
          <>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-slate-600 shrink-0" strokeWidth={1.5} />
                <span className="text-sm text-slate-600">{data.expert}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-600 shrink-0" strokeWidth={1.5} />
                <span className="text-sm text-slate-600">{data.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-600 shrink-0" strokeWidth={1.5} />
                <span className="text-sm text-slate-600">{data.duration}</span>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Total</span>
                <span className="font-serif text-2xl text-teal-600">
                  {data.price}
                </span>
              </div>
            </div>
            {errorMessage && (
              <p className="text-sm text-red-600 mb-3">{errorMessage}</p>
            )}
            <Button
              className={`w-full justify-center py-3.5 text-base ${state === 'success' ? 'bg-green-600 hover:bg-green-600' : ''}`}
              onClick={handlePurchase}
              disabled={state === 'loading'}
            >
              {state === 'idle' && (
                <>
                  {ctaLabel}
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </>
              )}
              {state === 'loading' && (
                <>
                  <svg
                    className="mr-2 h-5 w-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth={4}
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </>
              )}
              {state === 'success' && (
                <>
                  <Check className="mr-2 h-5 w-5" strokeWidth={2} />
                  Ticket Confirmed!
                </>
              )}
              {state === 'error' && (
                <>Try again</>
              )}
            </Button>
            <p className="text-center text-xs text-slate-600 mt-3 flex items-center justify-center gap-1">
              <CreditCard className="h-3.5 w-3.5" strokeWidth={1.5} />
              Secure payment powered by Stripe. Instant Zoom link delivery.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
