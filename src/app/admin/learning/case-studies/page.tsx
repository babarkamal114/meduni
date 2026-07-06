import Link from 'next/link';
import { getCaseStudies } from '@/lib/data/learning';
import { Button } from '@/components/ui/button';
import { AdminCaseStudyRow } from './admin-case-study-row';

interface AdminCaseStudiesPageProps {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string; delete_error?: string }>;
}

export default async function AdminCaseStudiesPage({ searchParams }: AdminCaseStudiesPageProps): Promise<React.ReactElement> {
  const params = await searchParams;
  const caseStudies = await getCaseStudies();
  const successMessage =
    params.created === '1'
      ? 'Case study created.'
      : params.updated === '1'
        ? 'Case study updated.'
        : params.deleted === '1'
          ? 'Case study deleted.'
          : null;
  const errorMessage = params.delete_error === '1' ? 'Failed to delete case study.' : null;

  return (
    <div>
      {successMessage ? (
        <p className="mb-6 rounded-lg bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800">{successMessage}</p>
      ) : null}
      {errorMessage ? (
        <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{errorMessage}</p>
      ) : null}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-slate-900 mb-1">Case Studies</h1>
          <p className="text-slate-600 text-sm">Create, edit, and remove case studies.</p>
        </div>
        <Link href="/admin/learning/case-studies/new">
          <Button>Add Case Study</Button>
        </Link>
      </div>
      <div className="overflow-x-auto">
      <div className="rounded-xl border border-black/[0.06] bg-white overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/5 bg-slate-50/80">
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Title</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Slug</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {caseStudies.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-500 text-sm">
                  No case studies yet. Add one to get started.
                </td>
              </tr>
            ) : (
              caseStudies.map((cs) => <AdminCaseStudyRow key={cs.id} caseStudy={cs} />)
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
