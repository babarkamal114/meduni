import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getModuleById } from '@/lib/data/learning';
import { Button } from '@/components/ui/button';
import { AdminLessonRow } from './admin-lesson-row';

interface LessonsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ module_created?: string; created?: string; updated?: string; deleted?: string; delete_error?: string }>;
}

export default async function AdminLessonsPage({ params, searchParams }: LessonsPageProps): Promise<React.ReactElement> {
  const { id: moduleId } = await params;
  const query = await searchParams;
  const moduleData = await getModuleById(moduleId);
  if (!moduleData) notFound();
  const successMessage =
    query.module_created === '1'
      ? 'Module created. Now add lessons or quizzes.'
      : query.created === '1'
      ? 'Step created.'
      : query.updated === '1'
        ? 'Step updated.'
        : query.deleted === '1'
          ? 'Step deleted.'
          : null;
  const errorMessage = query.delete_error === '1' ? 'Failed to delete step.' : null;

  return (
    <div>
      {successMessage ? (
        <p className="mb-6 rounded-lg bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800">{successMessage}</p>
      ) : null}
      {errorMessage ? (
        <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{errorMessage}</p>
      ) : null}
      <Link
        href="/admin/learning/modules"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to Modules
      </Link>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-slate-900 mb-1">Steps — {moduleData.title}</h1>
          <p className="text-slate-600 text-sm">Manage lessons and quizzes for this module. Order is by step order.</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/learning/modules/${moduleId}/lessons/new`}>
            <Button variant="outline">Add Lesson</Button>
          </Link>
          <Link href={`/admin/learning/modules/${moduleId}/lessons/new?type=quiz`}>
            <Button>Add Quiz</Button>
          </Link>
        </div>
      </div>
      <div className="rounded-xl border border-black/[0.06] bg-white overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/5 bg-slate-50/80">
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Type</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Title</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Duration</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Video</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {moduleData.lessons.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-sm">
                  No steps yet. Add a lesson or quiz to get started.
                </td>
              </tr>
            ) : (
              moduleData.lessons.map((lesson) => (
                <AdminLessonRow key={lesson.id} moduleId={moduleId} lesson={lesson} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
