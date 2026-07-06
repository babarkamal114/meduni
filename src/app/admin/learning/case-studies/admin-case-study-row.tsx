'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { deleteCaseStudy } from '../actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface AdminCaseStudyRowProps {
  caseStudy: { id: string; slug: string; title: string };
}

export function AdminCaseStudyRow({ caseStudy }: AdminCaseStudyRowProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [deleting, startDelete] = useTransition();

  return (
    <tr className="border-b border-black/5 hover:bg-slate-50/50">
      <td className="px-4 py-3 font-medium text-slate-800">{caseStudy.title}</td>
      <td className="px-4 py-3 text-slate-600">{caseStudy.slug}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/learning/case-studies/${caseStudy.id}/edit`}>Edit</Link>
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Delete case study</DialogTitle>
                <DialogDescription>
                  Delete &quot;{caseStudy.title}&quot; permanently. This cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  startDelete(async () => {
                    await deleteCaseStudy(caseStudy.id);
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
