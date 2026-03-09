import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getContentById } from '@/lib/mock/learning';
import { ContentView } from '@/components/dashboard/learning/content-view';

interface ContentPageProps {
  params: Promise<{ id: string }>;
}

export default async function ContentPage({
  params,
}: ContentPageProps): Promise<React.ReactElement> {
  const { id } = await params;
  const content = getContentById(id);

  if (!content) notFound();

  return (
    <div className="px-6 lg:px-8 py-8 max-w-[900px]">
      <Link
        href="/dashboard/learning"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to My Learning
      </Link>
      <ContentView content={content} />
    </div>
  );
}
