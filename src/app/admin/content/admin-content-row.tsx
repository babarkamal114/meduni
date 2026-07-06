'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { FileText, HelpCircle, Video } from 'lucide-react';
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
import { deleteContentItem } from './actions';
import type { ContentItem, ContentQuizItem } from '@/lib/data/learning';

const typeLabels: Record<string, string> = {
  pdf: 'PDF',
  quiz: 'Quiz',
  video: 'Video',
};

const typeIcons = {
  pdf: FileText,
  quiz: HelpCircle,
  video: Video,
} as const;

interface AdminContentRowProps {
  item: ContentItem | ContentQuizItem;
}

export function AdminContentRow({ item }: AdminContentRowProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [deleting, startDelete] = useTransition();
  const Icon = typeIcons[item.type];

  return (
    <tr className="border-b border-black/5 hover:bg-slate-50/50">
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-medium text-teal-600">
          <Icon className="h-3.5 w-3.5" />
          {typeLabels[item.type]}
        </span>
      </td>
      <td className="px-4 py-3 font-medium text-slate-800">{item.title}</td>
      <td className="px-4 py-3 text-slate-600 text-sm">{item.meta}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/content/${item.id}/edit`}>Edit</Link>
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white text-slate-900 border-slate-200">
              <DialogHeader>
                <DialogTitle className="text-slate-900">Delete content</DialogTitle>
                <DialogDescription className="text-slate-600">
                  Are you sure you want to delete &quot;{item.title}&quot;? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  startDelete(async () => {
                    await deleteContentItem(item.id);
                    setOpen(false);
                  });
                }}
              >
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={deleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-red-600 text-white hover:bg-red-700"
                    disabled={deleting}
                  >
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
