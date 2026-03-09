import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getModuleById } from '@/lib/mock/learning';
import { ModuleForm } from '../../module-form';
import { updateModule } from '../../../actions';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminModuleEditPage({ params }: EditPageProps): Promise<React.ReactElement> {
  const { id } = await params;
  const moduleData = getModuleById(id);
  if (!moduleData) notFound();

  return (
    <div>
      <Link
        href="/admin/learning/modules"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to Modules
      </Link>
      <h1 className="font-serif text-3xl text-slate-900 mb-1">Edit Module</h1>
      <p className="text-slate-600 text-sm mb-8">Update module details.</p>
      <ModuleForm action={updateModule} initialValues={moduleData} />
    </div>
  );
}
