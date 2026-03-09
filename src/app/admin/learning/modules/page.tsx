import Link from 'next/link';
import { MODULES } from '@/lib/mock/learning';
import { Button } from '@/components/ui/button';

export default function AdminModulesPage(): React.ReactElement {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-slate-900 mb-1">Modules</h1>
          <p className="text-slate-600 text-sm">Manage learning modules and their lessons.</p>
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
            {MODULES.map((mod) => (
              <tr key={mod.id} className="border-b border-black/5 hover:bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-slate-800">{mod.title}</td>
                <td className="px-4 py-3 text-slate-600">{mod.id}</td>
                <td className="px-4 py-3 text-slate-600">{mod.lessons.length}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/learning/modules/${mod.id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/learning/modules/${mod.id}/lessons`}>Manage lessons</Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
