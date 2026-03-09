import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getModuleById } from '@/lib/mock/learning';
import { Button } from '@/components/ui/button';

interface LessonsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminLessonsPage({ params }: LessonsPageProps): Promise<React.ReactElement> {
  const { id: moduleId } = await params;
  const moduleData = getModuleById(moduleId);
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
          <h1 className="font-serif text-3xl text-slate-900 mb-1">Lessons — {moduleData.title}</h1>
          <p className="text-slate-600 text-sm">Manage lessons for this module.</p>
        </div>
        <Link href={`/admin/learning/modules/${moduleId}/lessons/new`}>
          <Button>Add Lesson</Button>
        </Link>
      </div>
      <div className="rounded-xl border border-black/[0.06] bg-white overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/5 bg-slate-50/80">
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Title</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Duration</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Video</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {moduleData.lessons.map((lesson) => (
              <tr key={lesson.id} className="border-b border-black/5 hover:bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-slate-800">{lesson.title}</td>
                <td className="px-4 py-3 text-slate-600">{lesson.duration}</td>
                <td className="px-4 py-3 text-slate-600">{lesson.hasVideo ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/learning/modules/${moduleId}/lessons/${lesson.id}/edit`}>Edit</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
