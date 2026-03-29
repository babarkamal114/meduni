import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCertificateData } from '@/lib/data/learning';
import { getUser } from '@/lib/auth/getUser';
import { siteConfig } from '@/config/site';
import { CertificateFrame } from '@/components/dashboard/certificate-frame';
import { getOrCreateShareLink } from '../../actions';
import { ShareCertificateButton } from './share-certificate-button';

interface CertificatePageProps {
  params: Promise<{ moduleId: string }>;
}

export default async function CertificatePage({ params }: CertificatePageProps): Promise<React.ReactElement> {
  const { moduleId } = await params;
  const user = await getUser();
  if (!user?.id) notFound();

  const data = await getCertificateData(user.id, moduleId);
  if (!data) notFound();

  const verifyUrl = siteConfig.url.replace(/^https?:\/\//, '');
  const shareResult = await getOrCreateShareLink(moduleId);
  const shareUrl = shareResult.url ?? '';

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white">
      <div className="mx-auto max-w-5xl px-6 py-8 print:py-0 print:max-w-none">
        <Link
          href={`/dashboard/learning/module/${moduleId}`}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 mb-6 print:hidden"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Back to module
        </Link>

        <CertificateFrame data={data} verifyUrl={verifyUrl} siteName={siteConfig.name} />

        <div className="mt-8 flex flex-wrap gap-3 print:hidden">
          <Button asChild size="sm">
            <a
              href={`/api/certificates/${moduleId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <Download className="h-4 w-4" strokeWidth={1.5} />
              Download PDF
            </a>
          </Button>
          {shareUrl ? <ShareCertificateButton shareUrl={shareUrl} /> : null}
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/certificates">View all certificates</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
