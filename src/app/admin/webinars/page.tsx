import Link from 'next/link';
import { MOCK_WEBINARS } from '@/lib/data/mock-webinars';
import { AdminWebinarRow } from './admin-webinar-row';

export default function AdminWebinarsPage(): React.ReactElement {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-slate-900 mb-1">Webinars</h1>
          <p className="text-slate-600 text-sm">Manage live, upcoming, and recorded webinars.</p>
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
            {MOCK_WEBINARS.map((w) => (
              <AdminWebinarRow key={w.id} webinar={w} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
