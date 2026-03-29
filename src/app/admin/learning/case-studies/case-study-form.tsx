'use client';

import { useFormState } from 'react-dom';
import type { CaseStudyItem } from '@/lib/data/learning';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type FormAction = (
  prev: unknown,
  formData: FormData
) => Promise<{ success: boolean; error?: string }>;

interface CaseStudyFormProps {
  action: FormAction;
  initialValues?: CaseStudyItem;
}

export function CaseStudyForm({ action, initialValues }: CaseStudyFormProps): React.ReactElement {
  const [state, formAction] = useFormState(action, null);

  return (
    <form action={formAction} className="max-w-xl space-y-6 rounded-xl border border-black/[0.06] bg-white p-6">
      {initialValues && <input type="hidden" name="id" value={initialValues.id} />}
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{state.error}</p>
      )}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={initialValues?.title}
          placeholder="Chest Pain in A&E"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          required
          defaultValue={initialValues?.slug ?? initialValues?.id}
          placeholder="chest-pain"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initialValues?.description}
          placeholder="Interactive case: 45-year-old male presenting with acute chest pain."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="outcome_title">Outcome title</Label>
        <Input
          id="outcome_title"
          name="outcome_title"
          defaultValue={initialValues?.outcome.title}
          placeholder="Well done"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="outcome_body">Outcome body</Label>
        <textarea
          id="outcome_body"
          name="outcome_body"
          rows={4}
          defaultValue={initialValues?.outcome.body}
          placeholder="Outcome narrative..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
        />
      </div>
      <p className="text-xs text-slate-400">Steps and choices can be edited in a future release. Persistence will be enabled with Supabase.</p>
      <Button type="submit">Save</Button>
    </form>
  );
}
