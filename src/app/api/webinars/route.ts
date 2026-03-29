import { NextResponse } from 'next/server';
import { getPurchasedWebinarSlugs } from '@/app/dashboard/webinars/actions';
import { getWebinars, withPurchased } from '@/lib/data/webinars';

export async function GET(): Promise<NextResponse> {
  try {
    const [webinars, purchasedSlugs] = await Promise.all([
      getWebinars(),
      getPurchasedWebinarSlugs(),
    ]);
    const webinarsWithPurchased = withPurchased(webinars, purchasedSlugs);
    return NextResponse.json({ webinars: webinarsWithPurchased, purchasedSlugs });
  } catch (err) {
    console.error('GET /api/webinars error', err);
    return NextResponse.json(
      { error: 'Failed to load webinars' },
      { status: 500 }
    );
  }
}
