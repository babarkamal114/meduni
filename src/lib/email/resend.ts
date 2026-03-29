import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;

/** Resend only allows sending from verified domains or their test sender. */
const RESEND_TEST_FROM = 'onboarding@resend.dev';

/** Domains Resend does not allow as sender (unverified / personal). Use test sender instead. */
const UNVERIFIABLE_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'icloud.com', 'mail.com', 'protonmail.com'];

function getEffectiveFrom(requested?: string | null): string {
  const raw = requested ?? process.env.RESEND_FROM ?? RESEND_TEST_FROM;
  const domain = raw.includes('@') ? raw.split('@')[1]?.toLowerCase() : '';
  if (domain && UNVERIFIABLE_DOMAINS.some((d) => domain === d || domain.endsWith('.' + d))) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Resend] Cannot send from', raw, '– domain not verifiable. Using', RESEND_TEST_FROM);
    }
    return RESEND_TEST_FROM;
  }
  return raw || RESEND_TEST_FROM;
}

export const resend = apiKey ? new Resend(apiKey) : null;

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  from: fromOverride,
}: SendEmailOptions): Promise<{ success: boolean; error?: Error }> {
  if (!resend) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Resend] No RESEND_API_KEY; skipping send:', { to, subject });
      return { success: true };
    }
    return { success: false, error: new Error('Email is not configured') };
  }

  const from = getEffectiveFrom(fromOverride ?? process.env.RESEND_FROM);

  const { data, error } = await resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  });

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Resend] Send failed:', error.message);
    }
    return { success: false, error: new Error(error.message) };
  }
  if (process.env.NODE_ENV === 'development' && data?.id) {
    console.log('[Resend] Sent:', data.id, 'to', to);
  }
  return { success: true };
}
