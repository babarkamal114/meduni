'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { deleteLesson } from '@/app/admin/learning/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface AdminLessonRowProps {
  moduleId: string;
  lesson: {
    id: string;
    title: string;
    duration: string;
    hasVideo?: boolean;
    lessonType: 'content' | 'quiz';
  };
}

export function AdminLessonRow({ moduleId, lesson }: AdminLessonRowProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [deleting, startDelete] = useTransition();

  return (
    <tr className="border-b border-black/5 hover:bg-slate-50/50">
      <td className="px-4 py-3">
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${lesson.lessonType === 'quiz' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
          {lesson.lessonType === 'quiz' ? 'Quiz' : 'Lesson'}
        </span>
      </td>
      <td className="px-4 py-3 font-medium text-slate-800">{lesson.title}</td>
      <td className="px-4 py-3 text-slate-600">{lesson.duration}</td>
      <td className="px-4 py-3 text-slate-600">{lesson.hasVideo ? 'Yes' : '—'}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/learning/modules/${moduleId}/lessons/${lesson.id}/edit`}>Edit</Link>
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Delete step</DialogTitle>
                <DialogDescription>
                  Delete &quot;{lesson.title}&quot; permanently. This cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  startDelete(async () => {
                    await deleteLesson(moduleId, lesson.id);
                    setOpen(false);
                  });
                }}
              >
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={deleting}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-red-600 text-white hover:bg-red-700" disabled={deleting}>
                    {deleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </td>
    </tr>
  );
}
