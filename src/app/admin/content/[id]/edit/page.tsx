import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getContentById } from '@/lib/data/learning';
import { ContentItemForm } from '../../content-item-form';
import { updateContentItem } from '../../actions';

interface EditContentPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminContentEditPage({ params }: EditContentPageProps): Promise<React.ReactElement> {
  const { id } = await params;
  const content = await getContentById(id);
  if (!content) notFound();

  return (
    <div>
      <Link
        href="/admin/content"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to Content
      </Link>
      <h1 className="font-serif text-3xl text-slate-900 mb-1">Edit Content</h1>
      <p className="text-slate-600 text-sm mb-8">{content.title}</p>
      <ContentItemForm action={updateContentItem} type={content.type} initialValues={content} />
    </div>
  );
}
