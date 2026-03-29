'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { grantAccessAfterPayment } from '@/app/dashboard/webinars/actions';
import { getWebinarQueryKey, getWebinarsQueryKey } from '@/hooks/use-webinars';

/**
 * After redirect-based Stripe confirmation, Stripe appends payment_intent query params.
 * Runs grant + cache refresh so "Get ticket" updates without a manual reload.
 */
export function StripeWebinarPaymentReturnSync(): null {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const ranForPi = useRef<string | null>(null);

  useEffect(() => {
    const pi = searchParams.get('payment_intent');
    if (!pi) return;
    if (ranForPi.current === pi) return;
    ranForPi.current = pi;

    const dedupeKey = `meduni_stripe_pi_sync_${pi}`;
    if (typeof window !== 'undefined' && sessionStorage.getItem(dedupeKey)) return;
    if (typeof window !== 'undefined') sessionStorage.setItem(dedupeKey, '1');

    void (async () => {
      const result = await grantAccessAfterPayment(pi);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: getWebinarsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getWebinarQueryKey(result.slug) });
      }
      const clean = new URLSearchParams(searchParams.toString());
      clean.delete('payment_intent');
      clean.delete('payment_intent_client_secret');
      clean.delete('redirect_status');
      const q = clean.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
      router.refresh();
    })();
  }, [searchParams, pathname, router, queryClient]);

  return null;
}
