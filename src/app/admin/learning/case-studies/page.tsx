import Link from 'next/link';
import { getCaseStudies } from '@/lib/data/learning';
import { Button } from '@/components/ui/button';

export default async function AdminCaseStudiesPage(): Promise<React.ReactElement> {
  const caseStudies = await getCaseStudies();
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-slate-900 mb-1">Case Studies</h1>
          <p className="text-slate-600 text-sm">Manage interactive case studies.</p>
        </div>
        <Link href="/admin/learning/case-studies/new">
          <Button>Add Case Study</Button>
        </Link>
      </div>
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
              caseStudies.map((cs) => (
                <tr key={cs.id} className="border-b border-black/5 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-800">{cs.title}</td>
                  <td className="px-4 py-3 text-slate-600">{cs.slug}</td>
                  <td className="px-4 py-3">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/learning/case-studies/${cs.id}/edit`}>Edit</Link>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
