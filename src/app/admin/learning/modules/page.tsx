import Link from 'next/link';
import { getModules } from '@/lib/data/learning';
import { Button } from '@/components/ui/button';
import { AdminModuleRow } from './admin-module-row';

interface AdminModulesPageProps {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string; delete_error?: string }>;
}

export default async function AdminModulesPage({ searchParams }: AdminModulesPageProps): Promise<React.ReactElement> {
  const params = await searchParams;
  const modules = await getModules();
  const successMessage =
    params.created === '1'
      ? 'Module created.'
      : params.updated === '1'
        ? 'Module updated.'
        : params.deleted === '1'
          ? 'Module deleted.'
          : null;
  const errorMessage = params.delete_error === '1' ? 'Failed to delete module.' : null;

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
          <h1 className="font-serif text-3xl text-slate-900 mb-1">Modules</h1>
          <p className="text-slate-600 text-sm">Create, edit, and remove learning modules.</p>
        </div>
        <Link href="/admin/learning/modules/new">
          <Button>Add Module</Button>
        </Link>
      </div>
      <div className="rounded-xl border border-black/[0.06] bg-white overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/5 bg-slate-50/80">
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Title</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Slug</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Lessons</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 w-48">Actions</th>
            </tr>
          </thead>
          <tbody>
            {modules.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500 text-sm">
                  No modules yet. Add a module to get started.
                </td>
              </tr>
            ) : (
              modules.map((mod) => <AdminModuleRow key={mod.id} module={mod} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
