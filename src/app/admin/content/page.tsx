import Link from 'next/link';
import { getContentItems } from '@/lib/data/learning';
import { Button } from '@/components/ui/button';
import { AdminContentRow } from './admin-content-row';

interface AdminContentPageProps {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string; delete_error?: string }>;
}

export default async function AdminContentPage({ searchParams }: AdminContentPageProps): Promise<React.ReactElement> {
  const params = await searchParams;
  const items = await getContentItems();

  const successMessage =
    params.created === '1'
      ? 'Content created.'
      : params.updated === '1'
        ? 'Content updated.'
        : params.deleted === '1'
          ? 'Content deleted.'
          : null;
  const errorMessage = params.delete_error === '1' ? 'Failed to delete content.' : null;

  return (
    <div>
      {successMessage && (
        <p className="mb-6 rounded-lg bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800" role="status">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
          {errorMessage}
        </p>
      )}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-slate-900 mb-1">Content</h1>
          <p className="text-slate-600 text-sm">Manage weekly materials with quick edit/delete actions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/content/new">
            <Button>Add Content</Button>
          </Link>
          <div className="text-xs text-slate-500">
            Quick: <Link href="/admin/content/new?type=pdf" className="underline">PDF</Link> ·{' '}
            <Link href="/admin/content/new?type=video" className="underline">Video</Link> ·{' '}
            <Link href="/admin/content/new?type=quiz" className="underline">Quiz</Link>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="rounded-xl border border-black/[0.06] bg-white overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/5 bg-slate-50/80">
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Type</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Title</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Meta</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500 text-sm">
                    No content yet. Add PDF, video, or quiz to get started.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <AdminContentRow key={item.id} item={item} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
