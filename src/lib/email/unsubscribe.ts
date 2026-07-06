import { createHmac, timingSafeEqual } from 'crypto';
import { siteConfig } from '@/config/site';

function getSecret(): string {
  return process.env.EMAIL_UNSUBSCRIBE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'meduni-fallback-secret';
}

export function generateUnsubscribeToken(userId: string): string {
  return createHmac('sha256', getSecret()).update(userId).digest('hex');
}

export function verifyUnsubscribeToken(userId: string, token: string): boolean {
  const expected = generateUnsubscribeToken(userId);
  if (expected.length !== token.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

export function getUnsubscribeUrl(userId: string): string {
  const token = generateUnsubscribeToken(userId);
  return `${siteConfig.url}/api/email/unsubscribe?uid=${userId}&token=${token}`;
}
