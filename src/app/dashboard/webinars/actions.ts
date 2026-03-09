'use server';

import { cookies } from 'next/headers';
import { getWebinarBySlug } from '@/lib/data/mock-webinars';

const MOCK_ZOOM_JOIN_URL = 'https://zoom.us/j/123456789';
const MOCK_REPLAY_URL =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const PURCHASED_WEBINARS_COOKIE = 'meduni_purchased_webinars';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type JoinWebinarResult = { url: string } | { error: string };
export type ReplayUrlResult = { url: string } | { error: string };
export type PurchaseTicketResult = { success: true; slug: string } | { success: false; error: string };

async function getPurchasedSlugs(): Promise<string[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(PURCHASED_WEBINARS_COOKIE)?.value;
  if (!raw) return [];
  return raw.split(',').filter(Boolean);
}

function hasAccess(webinarSlug: string, staticPurchased: boolean, cookieSlugs: string[]): boolean {
  return staticPurchased || cookieSlugs.includes(webinarSlug);
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
  return getPurchasedSlugs();
}

export async function purchaseWebinarTicket(webinarSlug: string): Promise<PurchaseTicketResult> {
  const webinar = getWebinarBySlug(webinarSlug);
  if (!webinar) return { success: false, error: 'Webinar not found' };
  const cookieStore = await cookies();
  const current = await getPurchasedSlugs();
  if (current.includes(webinarSlug)) return { success: true, slug: webinarSlug };
  const next = [...current, webinarSlug];
  cookieStore.set(PURCHASED_WEBINARS_COOKIE, next.join(','), {
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    httpOnly: false,
    sameSite: 'lax',
  });
  return { success: true, slug: webinarSlug };
}

export async function getJoinWebinarUrl(webinarSlug: string): Promise<JoinWebinarResult> {
  const webinar = getWebinarBySlug(webinarSlug);
  if (!webinar) return { error: 'Webinar not found' };
  if (webinar.status === 'recorded') return { error: 'Webinar has ended. Watch the replay.' };
  const cookieSlugs = await getPurchasedSlugs();
  if (!hasAccess(webinarSlug, webinar.purchased, cookieSlugs))
    return { error: 'You need a ticket to join this webinar.' };
  if (!isWithinJoinWindow(webinar.scheduledAt))
    return { error: 'Join link is available 15 minutes before start time.' };
  return { url: MOCK_ZOOM_JOIN_URL };
}

export async function getReplayUrl(webinarSlug: string): Promise<ReplayUrlResult> {
  const webinar = getWebinarBySlug(webinarSlug);
  if (!webinar) return { error: 'Webinar not found' };
  const cookieSlugs = await getPurchasedSlugs();
  if (!hasAccess(webinarSlug, webinar.purchased, cookieSlugs))
    return { error: 'You need a ticket to watch this replay.' };
  if (!webinar.hasReplay) return { error: 'Replay is not available yet.' };
  return { url: MOCK_REPLAY_URL };
}

export async function saveReplayProgress(
  _webinarSlug: string,
  watchedSeconds: number
): Promise<{ ok: boolean }> {
  await Promise.resolve();
  return { ok: true };
}
