import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getModuleById } from '@/lib/data/learning';
import { Button } from '@/components/ui/button';

interface LessonsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminLessonsPage({ params }: LessonsPageProps): Promise<React.ReactElement> {
  const { id: moduleId } = await params;
  const moduleData = await getModuleById(moduleId);
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
                <tr key={lesson.id} className="border-b border-black/5 hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${lesson.lessonType === 'quiz' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                      {lesson.lessonType === 'quiz' ? 'Quiz' : 'Lesson'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{lesson.title}</td>
                  <td className="px-4 py-3 text-slate-600">{lesson.duration}</td>
                  <td className="px-4 py-3 text-slate-600">{lesson.hasVideo ? 'Yes' : '—'}</td>
                  <td className="px-4 py-3">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/learning/modules/${moduleId}/lessons/${lesson.id}/edit`}>Edit</Link>
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
