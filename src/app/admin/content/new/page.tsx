import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ContentItemForm } from '../content-item-form';
import { createContentItem } from '../actions';

interface NewContentPageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function AdminContentNewPage({ searchParams }: NewContentPageProps): Promise<React.ReactElement> {
  const { type } = await searchParams;
  const contentType = type === 'quiz' || type === 'video' ? type : 'pdf';

  return (
    <div>
      <Link
        href="/admin/content"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to Content
      </Link>
      <h1 className="font-serif text-3xl text-slate-900 mb-1">
        Add {contentType === 'pdf' ? 'PDF' : contentType === 'video' ? 'Video' : 'Quiz'}
      </h1>
      <p className="text-slate-600 text-sm mb-8">Create new content.</p>
      <ContentItemForm action={createContentItem} type={contentType} />
    </div>
  );
}
