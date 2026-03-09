import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getModuleById } from '@/lib/mock/learning';
import { LessonForm } from '../../../lesson-form';
import { createLesson } from '../../../../actions';

interface NewLessonPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminLessonNewPage({ params }: NewLessonPageProps): Promise<React.ReactElement> {
  const { id: moduleId } = await params;
  const moduleData = getModuleById(moduleId);
  if (!moduleData) notFound();

  return (
    <div>
      <Link
        href={`/admin/learning/modules/${moduleId}/lessons`}
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to Lessons
      </Link>
      <h1 className="font-serif text-3xl text-slate-900 mb-1">Add Lesson</h1>
      <p className="text-slate-600 text-sm mb-8">Add a new lesson to {moduleData.title}.</p>
      <LessonForm moduleId={moduleId} action={createLesson} />
    </div>
  );
}
