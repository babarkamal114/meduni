import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getModuleById } from '@/lib/data/learning';
import { LessonForm } from '../../../../lesson-form';
import { updateLesson } from '../../../../../actions';

interface EditLessonPageProps {
  params: Promise<{ id: string; lessonId: string }>;
}

export default async function AdminLessonEditPage({ params }: EditLessonPageProps): Promise<React.ReactElement> {
  const { id: moduleId, lessonId } = await params;
  const moduleData = await getModuleById(moduleId);
  const lesson = moduleData?.lessons.find((l) => l.id === lessonId);
  if (!moduleData || !lesson) notFound();

  return (
    <div>
      <Link
        href={`/admin/learning/modules/${moduleId}/lessons`}
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to Lessons
      </Link>
      <h1 className="font-serif text-3xl text-slate-900 mb-1">Edit Lesson</h1>
      <p className="text-slate-600 text-sm mb-8">{lesson.title}</p>
      <LessonForm moduleId={moduleId} action={updateLesson} initialValues={lesson} />
    </div>
  );
}
