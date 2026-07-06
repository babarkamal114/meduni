import { NextRequest, NextResponse } from 'next/server';
import { verifyUnsubscribeToken } from '@/lib/email/unsubscribe';
import { setMarketingOptOut } from '@/lib/data/email-preferences';
import { siteConfig } from '@/config/site';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const uid = request.nextUrl.searchParams.get('uid');
  const token = request.nextUrl.searchParams.get('token');

  if (!uid || !token || !verifyUnsubscribeToken(uid, token)) {
    return new NextResponse(buildHtmlPage('Invalid Link', 'This unsubscribe link is invalid or expired.'), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const { error } = await setMarketingOptOut(uid);

  if (error) {
    console.error('[unsubscribe] Failed:', error);
    return new NextResponse(
      buildHtmlPage('Something Went Wrong', 'We couldn\'t process your request. Please try again later.'),
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }

  return new NextResponse(
    buildHtmlPage(
      'Unsubscribed',
      'You have been unsubscribed from marketing emails. You can re-enable them anytime from your dashboard settings.',
    ),
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

function buildHtmlPage(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — ${siteConfig.name}</title>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #334155; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: white; border-radius: 12px; padding: 40px 32px; max-width: 440px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    h1 { margin: 0 0 12px; font-size: 22px; color: #0f172a; }
    p { margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #64748b; }
    a { display: inline-block; padding: 12px 24px; background: #0d9488; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="${siteConfig.url}">Back to ${siteConfig.name}</a>
  </div>
</body>
</html>`;
}
