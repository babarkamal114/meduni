import Stripe from 'stripe';
import { getWebinarBySlug } from '@/lib/data/webinars';
import { getUser } from '@/lib/auth/getUser';

const STRIPE_MIN_AMOUNT_GBP_PENCE = 30;

function isValidStripeSecretKey(key: string): boolean {
  return key.startsWith('sk_test_') || key.startsWith('sk_live_');
}

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key || !isValidStripeSecretKey(key)) return null;
  return new Stripe(key);
}

function parsePriceToPence(priceStr: string | null | undefined): number | null {
  if (priceStr == null || priceStr.trim() === '') return null;
  const trimmed = priceStr.trim().toUpperCase();
  if (trimmed === 'TBA' || trimmed === 'N/A') return null;
  const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
  if (Number.isNaN(num) || num <= 0) return null;
  return Math.round(num * 100);
}

export type CreatePaymentIntentResult =
  | { clientSecret: string }
  | { error: string };

export async function createWebinarPaymentIntent(slug: string): Promise<CreatePaymentIntentResult> {
  const stripe = getStripe();
  if (!stripe) {
    return { error: 'Payment is not configured. Add your Stripe keys to enable purchases.' };
  }

  const webinar = await getWebinarBySlug(slug);
  if (!webinar) return { error: 'Webinar not found' };

  const amountPence = parsePriceToPence(webinar.price);
  if (amountPence == null) {
    return { error: 'This webinar does not have a valid price set.' };
  }
  if (amountPence < STRIPE_MIN_AMOUNT_GBP_PENCE) {
    return { error: 'Minimum payment is £0.30.' };
  }

  const user = await getUser();
  const metadata: Record<string, string> = {
    webinar_id: webinar.id,
    webinar_slug: webinar.slug,
  };
  if (user?.id) metadata.user_id = user.id;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountPence,
      currency: 'gbp',
      metadata,
      automatic_payment_methods: { enabled: true },
    });
    if (!paymentIntent.client_secret) {
      return { error: 'Failed to create payment session.' };
    }
    return { clientSecret: paymentIntent.client_secret };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Payment setup failed';
    return { error: message };
  }
}

export type GrantAccessResult =
  | { success: true; slug: string }
  | { success: false; error: string };

export async function grantAccessAfterPaymentFromIntent(paymentIntentId: string): Promise<GrantAccessResult> {
  const stripe = getStripe();
  if (!stripe) {
    return { success: false, error: 'Payment is not configured.' };
  }

  let paymentIntent: Stripe.PaymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch {
    return { success: false, error: 'Invalid payment reference.' };
  }

  if (paymentIntent.status !== 'succeeded') {
    return { success: false, error: 'Payment not completed.' };
  }

  const slug = paymentIntent.metadata?.webinar_slug;
  if (!slug || typeof slug !== 'string') {
    return { success: false, error: 'Invalid payment metadata.' };
  }

  const webinar = await getWebinarBySlug(slug);
  if (!webinar) return { success: false, error: 'Webinar not found.' };

  const userId = paymentIntent.metadata?.user_id;

  if (userId) {
    const { registerUserForWebinar } = await import('@/lib/data/webinars');
    const { error } = await registerUserForWebinar(userId, webinar.id, paymentIntent.id);
    if (error) return { success: false, error };
    return { success: true, slug };
  }

  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const PURCHASED_WEBINARS_COOKIE = 'meduni_purchased_webinars';
  const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
  const raw = cookieStore.get(PURCHASED_WEBINARS_COOKIE)?.value ?? '';
  const current = raw.split(',').filter(Boolean);
  if (current.includes(slug)) return { success: true, slug };
  cookieStore.set(PURCHASED_WEBINARS_COOKIE, [...current, slug].join(','), {
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: 'lax',
  });
  return { success: true, slug };
}

export function isStripeConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  return Boolean(key && isValidStripeSecretKey(key));
}
