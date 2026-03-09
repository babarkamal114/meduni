import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { WebinarForm } from '../webinar-form';
import { createWebinar } from '../actions';

export default function AdminWebinarNewPage(): React.ReactElement {
  return (
    <div>
      <Link
        href="/admin/webinars"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to Webinars
      </Link>
      <h1 className="font-serif text-3xl text-slate-900 mb-1">Add Webinar</h1>
      <p className="text-slate-600 text-sm mb-8">Create a new webinar. Persistence will be enabled with Supabase.</p>
      <WebinarForm action={createWebinar} />
    </div>
  );
}
