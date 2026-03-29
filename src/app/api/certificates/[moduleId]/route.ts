import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { getCertificateData } from '@/lib/data/learning';
import { getUser } from '@/lib/auth/getUser';
import { siteConfig } from '@/config/site';
import { CertificateDocument } from '@/lib/pdf/certificate-document';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ moduleId: string }> }
): Promise<NextResponse> {
  const { moduleId } = await context.params;
  if (!moduleId) {
    return NextResponse.json({ error: 'Module ID or slug required' }, { status: 400 });
  }

  const user = await getUser();
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await getCertificateData(user.id, moduleId);
  if (!data) {
    return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
  }

  try {
    const verifyUrl = siteConfig.url.replace(/^https?:\/\//, '');
    const doc = React.createElement(CertificateDocument, {
      data,
      siteName: siteConfig.name,
      verifyUrl,
    });
    const buffer = await renderToBuffer(
      doc as Parameters<typeof renderToBuffer>[0]
    );
    const body = new Uint8Array(buffer);
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${data.moduleSlug}.pdf"`,
        'Content-Length': String(body.byteLength),
      },
    });
  } catch (err) {
    console.error('Certificate PDF render error', err);
    return NextResponse.json(
      { error: 'Failed to generate certificate PDF' },
      { status: 500 }
    );
  }
}
