import Link from 'next/link';
import type { MockWebinar } from '@/lib/data/mock-webinars';
import { deleteWebinar } from './actions';
import { Button } from '@/components/ui/button';

interface AdminWebinarRowProps {
  webinar: MockWebinar;
}

export function AdminWebinarRow({ webinar }: AdminWebinarRowProps): React.ReactElement {
  return (
    <tr className="border-b border-black/5 hover:bg-slate-50/50">
      <td className="px-4 py-3">
        <span className="font-medium text-slate-800">{webinar.title}</span>
      </td>
      <td className="px-4 py-3 text-slate-600">{webinar.expert}</td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-medium text-teal-600">
          {webinar.status}
        </span>
      </td>
      <td className="px-4 py-3 text-slate-600">{webinar.price}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/webinars/${webinar.id}/edit`}>Edit</Link>
          </Button>
          <form action={deleteWebinar.bind(null, webinar.id)} className="inline">
            <Button type="submit" variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
              Delete
            </Button>
          </form>
        </div>
      </td>
    </tr>
  );
}
