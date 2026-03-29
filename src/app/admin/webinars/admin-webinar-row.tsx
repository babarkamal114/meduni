'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Webinar } from '@/lib/data/webinars';
import { deleteWebinar } from './actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface AdminWebinarRowProps {
  webinar: Webinar;
}

export function AdminWebinarRow({ webinar }: AdminWebinarRowProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <tr className="border-b border-black/5 hover:bg-slate-50/50">
      <td className="px-4 py-3">
        <span className="font-medium text-slate-800">{webinar.title}</span>
      </td>
      <td className="px-4 py-3 text-slate-600">{webinar.expert}</td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="inline-flex w-fit items-center rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-medium text-teal-600">
            {webinar.status}
          </span>
          <span className="text-xs text-slate-500">{webinar.statusLabel}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-slate-600">{webinar.price}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/webinars/${webinar.id}/edit`}>Edit</Link>
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white text-slate-900 border-slate-200">
              <DialogHeader>
                <DialogTitle className="text-slate-900">Delete webinar</DialogTitle>
                <DialogDescription className="text-slate-600">
                  Are you sure you want to delete &quot;{webinar.title}&quot;? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <form
                action={deleteWebinar}
                method="post"
                onSubmit={() => setOpen(false)}
              >
                <input type="hidden" name="id" value={webinar.id} />
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
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
