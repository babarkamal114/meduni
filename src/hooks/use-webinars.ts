'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Webinar } from '@/lib/data/webinars';

const WEBINARS_QUERY_KEY = ['webinars'] as const;

export interface WebinarsApiResponse {
  webinars: Webinar[];
  purchasedSlugs: string[];
}

export interface WebinarDetailApiResponse {
  webinar: Webinar;
  hasAccess: boolean;
}

export interface PurchaseTicketApiResponse {
  success: true;
  slug: string;
}

export interface PurchaseTicketApiError {
  success: false;
  error: string;
}

async function fetchWebinars(): Promise<WebinarsApiResponse> {
  const res = await fetch('/api/webinars');
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? 'Failed to load webinars');
  }
  return res.json();
}

async function fetchWebinarBySlug(slug: string): Promise<WebinarDetailApiResponse> {
  const res = await fetch(`/api/webinars/${encodeURIComponent(slug)}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Webinar not found');
    }
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? 'Failed to load webinar');
  }
  return res.json();
}

async function purchaseTicket(slug: string): Promise<PurchaseTicketApiResponse> {
  const res = await fetch(`/api/webinars/${encodeURIComponent(slug)}/purchase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as PurchaseTicketApiError).error ?? 'Failed to purchase ticket');
  }
  return data as PurchaseTicketApiResponse;
}

/** Reusable query key for webinars list. Use with invalidateQueries / prefetchQuery. */
export function getWebinarsQueryKey(): readonly string[] {
  return WEBINARS_QUERY_KEY;
}

/** Reusable query key for a single webinar. */
export function getWebinarQueryKey(slug: string): readonly string[] {
  return ['webinars', slug];
}

/**
 * Fetches webinars list and purchased slugs from the API.
 * Use in dashboard list, admin, or any component that needs the full list.
 * Pass initialData from server for SSR/hybrid to avoid loading flash.
 */
export function useWebinars(initialData?: WebinarsApiResponse) {
  return useQuery({
    queryKey: WEBINARS_QUERY_KEY,
    queryFn: fetchWebinars,
    initialData,
  });
}

/**
 * Fetches a single webinar by slug and access status.
 * Enabled only when slug is truthy.
 */
export function useWebinar(slug: string | null | undefined) {
  return useQuery({
    queryKey: getWebinarQueryKey(slug ?? ''),
    queryFn: () => fetchWebinarBySlug(slug!),
    enabled: Boolean(slug),
  });
}

/**
 * Mutation to purchase a webinar ticket. On success, invalidates webinars list
 * and the specific webinar query so UI updates.
 */
export function usePurchaseWebinarTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: purchaseTicket,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: WEBINARS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: getWebinarQueryKey(data.slug) });
    },
  });
}
