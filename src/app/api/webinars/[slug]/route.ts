import { NextRequest, NextResponse } from 'next/server';
import { getPurchasedWebinarSlugs } from '@/app/dashboard/webinars/actions';
import { getWebinarBySlug } from '@/lib/data/webinars';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await context.params;
  if (!slug) {
    return NextResponse.json({ error: 'Slug required' }, { status: 400 });
  }
  try {
    const [webinar, purchasedSlugs] = await Promise.all([
      getWebinarBySlug(slug),
      getPurchasedWebinarSlugs(),
    ]);
    if (!webinar) {
      return NextResponse.json({ error: 'Webinar not found' }, { status: 404 });
    }
    const hasAccess = purchasedSlugs.includes(slug);
    return NextResponse.json({ webinar, hasAccess });
  } catch (err) {
    console.error('GET /api/webinars/[slug] error', err);
    return NextResponse.json(
      { error: 'Failed to load webinar' },
      { status: 500 }
    );
  }
}
