import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { MOCK_WEBINARS } from '@/lib/data/mock-webinars';
import { WebinarForm } from '../../webinar-form';
import { updateWebinar } from '../../actions';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminWebinarEditPage({ params }: EditPageProps): Promise<React.ReactElement> {
  const { id } = await params;
  const webinar = MOCK_WEBINARS.find((w) => w.id === id);
  if (!webinar) notFound();

  return (
    <div>
      <Link
        href="/admin/webinars"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to Webinars
      </Link>
      <h1 className="font-serif text-3xl text-slate-900 mb-1">Edit Webinar</h1>
      <p className="text-slate-600 text-sm mb-8">Update webinar details. Persistence will be enabled with Supabase.</p>
      <WebinarForm action={updateWebinar} initialValues={webinar} />
    </div>
  );
}
