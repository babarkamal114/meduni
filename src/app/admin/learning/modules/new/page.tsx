import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ModuleForm } from '../module-form';
import { createModule } from '../../actions';

export default function AdminModuleNewPage(): React.ReactElement {
  return (
    <div>
      <Link
        href="/admin/learning/modules"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to Modules
      </Link>
      <h1 className="font-serif text-3xl text-slate-900 mb-1">Add Module</h1>
      <p className="text-slate-600 text-sm mb-8">Create a new learning module. Add lessons from the module page after saving.</p>
      <ModuleForm action={createModule} />
    </div>
  );
}
