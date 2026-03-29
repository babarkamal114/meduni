import { NextRequest, NextResponse } from 'next/server';
import { purchaseWebinarTicket } from '@/app/dashboard/webinars/actions';

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await context.params;
  if (!slug) {
    return NextResponse.json({ success: false, error: 'Slug required' }, { status: 400 });
  }
  try {
    const result = await purchaseWebinarTicket(slug);
    if (result.success) {
      return NextResponse.json({ success: true, slug: result.slug });
    }
    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  } catch (err) {
    console.error('POST /api/webinars/[slug]/purchase error', err);
    return NextResponse.json(
      { success: false, error: 'Failed to purchase ticket' },
      { status: 500 }
    );
  }
}
