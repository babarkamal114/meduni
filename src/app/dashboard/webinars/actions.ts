'use server';

import { cookies } from 'next/headers';
import { getUser } from '@/lib/auth/getUser';
import {
  getWebinarBySlug,
  getWebinarRegistration,
  getPurchasedWebinarSlugsForUser,
  registerUserForWebinar,
  setWebinarRegistrationZoomDetails,
} from '@/lib/data/webinars';
import {
  createWebinarPaymentIntent,
  grantAccessAfterPaymentFromIntent,
} from '@/lib/stripe/server';
import { ZoomApiError, createZoomRegistrant } from '@/lib/integrations/zoom';

const PURCHASED_WEBINARS_COOKIE = 'meduni_purchased_webinars';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type JoinWebinarResult = { url: string } | { error: string };
export type ReplayUrlResult = { url: string } | { error: string };
export type PurchaseTicketResult = { success: true; slug: string } | { success: false; error: string };

async function getCookiePurchasedSlugs(): Promise<string[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(PURCHASED_WEBINARS_COOKIE)?.value;
  if (!raw) return [];
  return raw.split(',').filter(Boolean);
}

async function hasAccessToSlug(webinarSlug: string): Promise<boolean> {
  const user = await getUser();
  if (user) {
    const dbSlugs = await getPurchasedWebinarSlugsForUser(user.id);
    if (dbSlugs.includes(webinarSlug)) return true;
  }
  const cookieSlugs = await getCookiePurchasedSlugs();
  return cookieSlugs.includes(webinarSlug);
}

const JOIN_WINDOW_MINUTES_BEFORE = 15;

function isWithinJoinWindow(scheduledAt: string | null): boolean {
  if (!scheduledAt) return true;
  const start = new Date(scheduledAt).getTime();
  const now = Date.now();
  const windowStart = start - JOIN_WINDOW_MINUTES_BEFORE * 60 * 1000;
  const end = start + 90 * 60 * 1000;
  return now >= windowStart && now <= end;
}

export async function getPurchasedWebinarSlugs(): Promise<string[]> {
  const user = await getUser();
  if (user) {
    const dbSlugs = await getPurchasedWebinarSlugsForUser(user.id);
    const cookieSlugs = await getCookiePurchasedSlugs();
    return [...new Set([...dbSlugs, ...cookieSlugs])];
  }
  return getCookiePurchasedSlugs();
}

export async function purchaseWebinarTicket(webinarSlug: string): Promise<PurchaseTicketResult> {
  const { isStripeConfigured } = await import('@/lib/stripe/server');
  if (isStripeConfigured()) {
    return { success: false, error: 'Please complete payment through the checkout form.' };
  }

  const webinar = await getWebinarBySlug(webinarSlug);
  if (!webinar) return { success: false, error: 'Webinar not found' };

  const user = await getUser();
  const cookieStore = await cookies();
  const currentCookie = await getCookiePurchasedSlugs();

  if (user) {
    const dbSlugs = await getPurchasedWebinarSlugsForUser(user.id);
    if (dbSlugs.includes(webinarSlug)) return { success: true, slug: webinarSlug };
    const { error } = await registerUserForWebinar(user.id, webinar.id);
    if (error) return { success: false, error };
  }

  if (currentCookie.includes(webinarSlug)) return { success: true, slug: webinarSlug };
  const next = [...currentCookie, webinarSlug];
  cookieStore.set(PURCHASED_WEBINARS_COOKIE, next.join(','), {
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: 'lax',
  });
  return { success: true, slug: webinarSlug };
}

export async function getJoinWebinarUrl(webinarSlug: string): Promise<JoinWebinarResult> {
  const webinar = await getWebinarBySlug(webinarSlug);
  if (!webinar) return { error: 'Webinar not found' };
  if (webinar.status === 'recorded') return { error: 'Webinar has ended. Watch the replay.' };
  const hasAccess = await hasAccessToSlug(webinarSlug);
  if (!hasAccess) return { error: 'You need a ticket to join this webinar.' };
  if (!isWithinJoinWindow(webinar.scheduledAt))
    return { error: 'Join link is available 15 minutes before start time.' };

  const user = await getUser();
  if (!user) {
    const fallbackUrl = webinar.joinUrl?.trim();
    if (!fallbackUrl) return { error: 'Please sign in to generate your webinar link.' };
    return { url: fallbackUrl };
  }

  if (!webinar.zoomWebinarId) {
    const fallbackUrl = webinar.joinUrl?.trim();
    if (!fallbackUrl) return { error: 'Join link is not available yet.' };
    return { url: fallbackUrl };
  }

  const registration = await getWebinarRegistration(user.id, webinar.id);
  const cachedJoinUrl = registration?.zoomJoinUrl?.trim();
  if (cachedJoinUrl) return { url: cachedJoinUrl };
  if (!registration) {
    const ensured = await registerUserForWebinar(user.id, webinar.id);
    if (ensured.error) return { error: ensured.error };
  }

  const fullName = user.full_name?.trim() || 'MedUni User';
  const [firstName, ...remainingName] = fullName.split(/\s+/);
  const lastName = remainingName.join(' ').trim() || 'User';

  try {
    const registrant = await createZoomRegistrant({
      webinarId: webinar.zoomWebinarId,
      email: user.email,
      firstName: firstName || 'MedUni',
      lastName,
    });

    const { error } = await setWebinarRegistrationZoomDetails(user.id, webinar.id, {
      zoom_registrant_id: registrant.registrantId,
      zoom_join_url: registrant.joinUrl,
    });
    if (error) return { error: 'Failed to save webinar join link. Please try again.' };

    return { url: registrant.joinUrl };
  } catch (error) {
    if (error instanceof ZoomApiError) {
      return { error: `Zoom error: ${error.message}` };
    }
    return { error: 'Failed to generate webinar join link. Please try again.' };
  }
}

export async function getReplayUrl(webinarSlug: string): Promise<ReplayUrlResult> {
  const webinar = await getWebinarBySlug(webinarSlug);
  if (!webinar) return { error: 'Webinar not found' };
  const hasAccess = await hasAccessToSlug(webinarSlug);
  if (!hasAccess) return { error: 'You need a ticket to watch this replay.' };
  if (!webinar.hasReplay) return { error: 'Replay is not available yet.' };
  const url = webinar.replayUrl?.trim();
  if (!url) return { error: 'Replay is not available yet.' };
  return { url };
}

export async function saveReplayProgress(
  _webinarSlug: string,
  watchedSeconds: number
): Promise<{ ok: boolean }> {
  await Promise.resolve();
  return { ok: true };
}

export type CreatePaymentIntentActionResult =
  | { clientSecret: string }
  | { error: string };

export async function createWebinarPaymentIntentAction(
  slug: string
): Promise<CreatePaymentIntentActionResult> {
  return createWebinarPaymentIntent(slug);
}

export type GrantAccessResult =
  | { success: true; slug: string }
  | { success: false; error: string };

export async function grantAccessAfterPayment(
  paymentIntentId: string
): Promise<GrantAccessResult> {
  return grantAccessAfterPaymentFromIntent(paymentIntentId);
}
