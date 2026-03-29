'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, Calendar, Clock, Check, CreditCard } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  createWebinarPaymentIntentAction,
  grantAccessAfterPayment,
} from '@/app/dashboard/webinars/actions';
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

export type PurchaseResult =
  | { success: true; slug: string }
  | { success: false; error: string };

export type PurchaseFn = (slug: string) => Promise<PurchaseResult>;

interface TicketPurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: TicketPurchaseModalData | null;
  webinarSlug?: string;
  onSuccess?: (slug: string) => void;
  onPurchase?: PurchaseFn;
}

function isValidStripePublishableKey(key: string): boolean {
  return key.startsWith('pk_test_') || key.startsWith('pk_live_');
}

const publishableKey =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()
    : '';
const stripePromise =
  publishableKey && isValidStripePublishableKey(publishableKey)
    ? loadStripe(publishableKey)
    : null;

function getPaymentIntentIdFromClientSecret(clientSecret: string): string | null {
  if (!clientSecret.includes('_secret_')) return null;
  return clientSecret.split('_secret_')[0] ?? null;
}

function PaymentForm({
  clientSecret,
  webinarSlug,
  onSuccess: onPaymentSuccess,
  onError,
}: {
  clientSecret: string;
  webinarSlug: string;
  onSuccess: (slug: string) => void;
  onError: (message: string) => void;
}): React.ReactElement {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements) return;
      setProcessing(true);
      onError('');
      try {
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: typeof window !== 'undefined' ? window.location.href : '',
          },
          redirect: 'if_required',
        });
        if (error) {
          onError(error.message ?? 'Payment failed');
          setProcessing(false);
          return;
        }
        const paymentIntentId = getPaymentIntentIdFromClientSecret(clientSecret);
        if (!paymentIntentId) {
          onError('Invalid payment session.');
          setProcessing(false);
          return;
        }
        const result = await grantAccessAfterPayment(paymentIntentId);
        if (result.success) {
          onPaymentSuccess(result.slug);
        } else {
          onError(result.error);
        }
      } catch (err) {
        onError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setProcessing(false);
      }
    },
    [stripe, elements, clientSecret, webinarSlug, onPaymentSuccess, onError]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />
      <Button
        type="submit"
        className="w-full justify-center py-3.5 text-base"
        disabled={!stripe || processing}
      >
        {processing ? (
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
            Processing…
          </>
        ) : (
          'Purchase'
        )}
      </Button>
    </form>
  );
}

export function TicketPurchaseModal({
  open,
  onOpenChange,
  data,
  webinarSlug,
  onSuccess,
  onPurchase,
}: TicketPurchaseModalProps): React.ReactElement {
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [intentError, setIntentError] = useState<string | null>(null);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        setState('idle');
        setErrorMessage(null);
        setClientSecret(null);
        setIntentError(null);
      }
      onOpenChange(next);
    },
    [onOpenChange]
  );

  useEffect(() => {
    if (!open || !webinarSlug || !stripePromise) return;
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
    if (!pk || !isValidStripePublishableKey(pk)) {
      setIntentError('Payment is not configured. Add valid Stripe keys (pk_test_... or pk_live_...) to enable purchases.');
      setState('ready');
      return;
    }
    setState('loading');
    setIntentError(null);
    createWebinarPaymentIntentAction(webinarSlug).then((result) => {
      if ('error' in result) {
        setIntentError(result.error);
        setState('ready');
      } else {
        setClientSecret(result.clientSecret);
        setState('ready');
      }
    });
  }, [open, webinarSlug]);

  const handlePaymentSuccess = useCallback(
    (slug: string) => {
      setState('success');
      setTimeout(() => {
        handleOpenChange(false);
        setState('idle');
        onSuccess?.(slug);
      }, 1200);
    },
    [handleOpenChange, onSuccess]
  );

  const handlePaymentError = useCallback((message: string) => {
    setErrorMessage(message);
  }, []);

  const handleLegacyPurchase = useCallback(async () => {
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
    const result = onPurchase
      ? await onPurchase(webinarSlug)
      : await purchaseWebinarTicket(webinarSlug);
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
  }, [webinarSlug, onPurchase, onSuccess, handleOpenChange]);

  const isRecorded = data?.type === 'recorded';
  const ctaLabel = isRecorded ? 'Buy & Watch Now' : 'Purchase Ticket';
  const useStripeFlow = Boolean(
    webinarSlug &&
      (stripePromise ? clientSecret || intentError || state === 'loading' : true)
  );
  const showPaymentForm = Boolean(clientSecret && webinarSlug);

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
                  £{data.price}
                </span>
              </div>
            </div>

            {intentError && (
              <p className="text-sm text-amber-700 bg-amber-50 rounded-lg p-3 mb-4">
                {intentError}
              </p>
            )}
            {errorMessage && (
              <p className="text-sm text-red-600 mb-3">{errorMessage}</p>
            )}

            {showPaymentForm && clientSecret && webinarSlug ? (
              <Elements
                stripe={stripePromise!}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: { borderRadius: '12px' },
                  },
                }}
              >
                <PaymentForm
                  clientSecret={clientSecret}
                  webinarSlug={webinarSlug}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            ) : useStripeFlow && state === 'loading' ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 flex flex-col items-center justify-center gap-3">
                <svg
                  className="h-8 w-8 animate-spin text-slate-400"
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
                <p className="text-sm text-slate-600">Preparing payment form…</p>
              </div>
            ) : useStripeFlow && intentError ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2">
                <p className="text-sm font-medium text-slate-700">Card form not shown</p>
                <p className="text-sm text-slate-600">
                  The Stripe payment form (card number, expiry, CVC) only appears when valid API keys are set.
                  Add <code className="text-xs bg-slate-200 px-1 rounded">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> and <code className="text-xs bg-slate-200 px-1 rounded">STRIPE_SECRET_KEY</code> to <code className="text-xs bg-slate-200 px-1 rounded">.env.local</code> (e.g. <code className="text-xs bg-slate-200 px-1 rounded">pk_test_...</code> and <code className="text-xs bg-slate-200 px-1 rounded">sk_test_...</code> from the Stripe Dashboard).
                </p>
              </div>
            ) : !useStripeFlow ? (
              <Button
                className={`w-full justify-center py-3.5 text-base ${state === 'success' ? 'bg-green-600 hover:bg-green-600' : ''}`}
                onClick={handleLegacyPurchase}
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
                {state === 'error' && <>Try again</>}
              </Button>
            ) : null}

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
