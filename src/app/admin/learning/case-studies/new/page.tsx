import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CaseStudyForm } from '../case-study-form';
import { createCaseStudy } from '../../actions';

export default function AdminCaseStudyNewPage(): React.ReactElement {
  return (
    <div>
      <Link
        href="/admin/learning/case-studies"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to Case Studies
      </Link>
      <h1 className="font-serif text-3xl text-slate-900 mb-1">Add Case Study</h1>
      <p className="text-slate-600 text-sm mb-8">Create a new case study. Steps and choices editor coming with Supabase.</p>
      <CaseStudyForm action={createCaseStudy} />
    </div>
  );
}
