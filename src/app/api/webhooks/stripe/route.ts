import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getWebinarBySlug } from '@/lib/data/webinars';

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key);
}

async function sendPurchaseEmail(
  userId: string,
  webinar: { title: string; expert: string; dateLabel: string; price: string; slug: string },
  paymentIntentId: string,
  amountPence: number,
): Promise<void> {
  try {
    const { createAdminClient } = await import('@/lib/supabase/admin');
    const admin = createAdminClient();
    const { data: profile } = await (admin as any)
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single() as { data: { email: string; full_name: string | null } | null };

    if (!profile?.email) return;

    const { renderEmail } = await import('@/lib/email/render');
    const { PurchaseConfirmationEmail } = await import(
      '@/lib/email/templates/purchase-confirmation'
    );
    const { sendEmail } = await import('@/lib/email/resend');

    const html = await renderEmail(
      PurchaseConfirmationEmail({
        buyerName: profile.full_name?.trim() || profile.email.split('@')[0] || 'there',
        webinarTitle: webinar.title,
        webinarExpert: webinar.expert,
        webinarDate: webinar.dateLabel,
        amount: `£${(amountPence / 100).toFixed(2)}`,
        receiptId: paymentIntentId,
        webinarUrl: `/dashboard/webinars/${webinar.slug}`,
      }),
    );

    const { success, error } = await sendEmail({
      to: profile.email,
      subject: `Booking confirmed: ${webinar.title} — MedUni`,
      html,
    });

    if (!success) {
      console.error('[stripe webhook] purchase email failed:', error?.message);
    }
  } catch (err) {
    console.error('[stripe webhook] purchase email error:', err);
  }
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
        const { getWebinarRegistration, registerUserForWebinarAsAdmin } = await import('@/lib/data/webinars');
        const existing = await getWebinarRegistration(userId, webinar.id);
        if (!existing) {
          const { error } = await registerUserForWebinarAsAdmin(userId, webinar.id, paymentIntent.id);
          if (error) {
            console.error('[stripe webhook] webinar registration failed', error);
          }
        }

        await sendPurchaseEmail(
          userId,
          webinar,
          paymentIntent.id,
          paymentIntent.amount,
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
