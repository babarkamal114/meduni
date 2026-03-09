import Link from 'next/link';
import { CONTENT_ITEMS } from '@/lib/mock/learning';
import { Button } from '@/components/ui/button';
import { deleteContentItem } from './actions';
import { FileText, HelpCircle, Video } from 'lucide-react';

const typeLabels: Record<string, string> = {
  pdf: 'PDF',
  quiz: 'Quiz',
  video: 'Video',
};

const typeIcons = {
  pdf: FileText,
  quiz: HelpCircle,
  video: Video,
};

export default function AdminContentPage(): React.ReactElement {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-slate-900 mb-1">Content</h1>
          <p className="text-slate-600 text-sm">Manage weekly materials (PDF, quiz, video).</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/content/new?type=pdf">
            <Button variant="outline" size="sm">Add PDF</Button>
          </Link>
          <Link href="/admin/content/new?type=video">
            <Button variant="outline" size="sm">Add Video</Button>
          </Link>
          <Link href="/admin/content/new?type=quiz">
            <Button variant="outline" size="sm">Add Quiz</Button>
          </Link>
        </div>
      </div>
      <div className="rounded-xl border border-black/[0.06] bg-white overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/5 bg-slate-50/80">
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Type</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Title</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Meta</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {CONTENT_ITEMS.map((item) => {
              const Icon = typeIcons[item.type];
              return (
                <tr key={item.id} className="border-b border-black/5 hover:bg-slate-50/50">
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
                      <form action={deleteContentItem.bind(null, item.id)} className="inline">
                        <Button type="submit" variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          Delete
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
