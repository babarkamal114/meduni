import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getWebinarBySlug } from '@/lib/data/webinars';

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 500 }
    );
  }

  let body: string;
  try {
    body = await request.text();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const slug = paymentIntent.metadata?.webinar_slug;
    const userId = paymentIntent.metadata?.user_id;

    if (slug && typeof slug === 'string' && userId && typeof userId === 'string') {
      const webinar = await getWebinarBySlug(slug);
      if (webinar) {
        const { registerUserForWebinarAsAdmin } = await import('@/lib/data/webinars');
        const { error } = await registerUserForWebinarAsAdmin(userId, webinar.id);
        if (error) {
          console.error('[stripe webhook] webinar registration failed', error);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
