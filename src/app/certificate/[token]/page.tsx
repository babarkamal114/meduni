import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCertificateByShareToken } from '@/lib/data/learning';
import { siteConfig } from '@/config/site';
import { CertificateFrame } from '@/components/dashboard/certificate-frame';
import { Button } from '@/components/ui/button';

interface CertificatePublicPageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: CertificatePublicPageProps): Promise<Metadata> {
  const { token } = await params;
  const data = await getCertificateByShareToken(token);
  if (!data) return { title: 'Certificate | ' + siteConfig.name };

  const title = `${data.userName} – Certificate of Completion | ${siteConfig.name}`;
  const description = `${data.userName} completed the module "${data.moduleTitle}" on ${siteConfig.name}. View certificate.`;
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const url = `${baseUrl}/certificate/${token}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: siteConfig.ogImage ? [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function CertificatePublicPage({ params }: CertificatePublicPageProps): Promise<React.ReactElement> {
  const { token } = await params;
  const data = await getCertificateByShareToken(token);
  if (!data) notFound();

  const verifyUrl = siteConfig.url.replace(/^https?:\/\//, '');

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3 sm:justify-between">
          <p className="text-sm text-slate-600">
            Certificate of completion · {siteConfig.name}
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href={siteConfig.url}>
              View on {siteConfig.name}
            </Link>
          </Button>
        </div>

        <CertificateFrame data={data} verifyUrl={verifyUrl} siteName={siteConfig.name} />

        <p className="mt-6 text-center text-xs text-slate-500">
          Share this link on LinkedIn, Twitter, or your portfolio. Anyone with the link can view this certificate.
        </p>
      </div>
    </div>
  );
}
