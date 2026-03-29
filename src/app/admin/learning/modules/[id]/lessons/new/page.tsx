import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getModuleById } from '@/lib/data/learning';
import { LessonForm } from '../../../lesson-form';
import { createLesson } from '../../../../actions';

interface NewLessonPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}

export default async function AdminLessonNewPage({ params, searchParams }: NewLessonPageProps): Promise<React.ReactElement> {
  const { id: moduleId } = await params;
  const { type: typeParam } = await searchParams;
  const moduleData = await getModuleById(moduleId);
  if (!moduleData) notFound();

  const defaultStepType = typeParam === 'quiz' ? 'quiz' : 'content';
  const title = defaultStepType === 'quiz' ? 'Add Quiz' : 'Add Lesson';
  const description = defaultStepType === 'quiz'
    ? `Add a quiz step to ${moduleData.title}. It will appear in the module sequence.`
    : `Add a new lesson to ${moduleData.title}.`;

  return (
    <div>
      <Link
        href={`/admin/learning/modules/${moduleId}/lessons`}
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to Steps
      </Link>
      <h1 className="font-serif text-3xl text-slate-900 mb-1">{title}</h1>
      <p className="text-slate-600 text-sm mb-8">{description}</p>
      <LessonForm moduleId={moduleId} action={createLesson} defaultStepType={defaultStepType} />
    </div>
  );
}
