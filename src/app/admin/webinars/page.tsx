import Link from 'next/link';
import { getWebinars } from '@/lib/data/webinars';
import { AdminWebinarRow } from './admin-webinar-row';

interface AdminWebinarsPageProps {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string }>;
}

export default async function AdminWebinarsPage({ searchParams }: AdminWebinarsPageProps): Promise<React.ReactElement> {
  const params = await searchParams;
  const webinars = await getWebinars();
  const successMessage =
    params.created === '1'
      ? 'Webinar created.'
      : params.updated === '1'
        ? 'Webinar updated.'
        : params.deleted === '1'
          ? 'Webinar deleted.'
          : null;

  return (
    <div>
      {successMessage && (
        <p className="mb-6 rounded-lg bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800" role="status">
          {successMessage}
        </p>
      )}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-slate-900 mb-1">Webinars</h1>
          <p className="text-slate-600 text-sm">Manage webinars with simple edit/delete controls.</p>
        </div>
        <Link
          href="/admin/webinars/new"
          className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
        >
          Add Webinar
        </Link>
      </div>
      <div className="rounded-xl border border-black/[0.06] bg-white overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/5 bg-slate-50/80">
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Title</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Expert</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Price</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {webinars.map((w) => (
              <AdminWebinarRow key={w.id} webinar={w} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
