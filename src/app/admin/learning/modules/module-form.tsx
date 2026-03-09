'use client';

import { useFormState } from 'react-dom';
import type { ModuleItem } from '@/lib/mock/learning';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type FormAction = (
  prev: unknown,
  formData: FormData
) => Promise<{ success: boolean; error?: string }>;

interface ModuleFormProps {
  action: FormAction;
  initialValues?: ModuleItem;
}

function SubmitButton(): React.ReactElement {
  return <Button type="submit">Save</Button>;
}

export function ModuleForm({ action, initialValues }: ModuleFormProps): React.ReactElement {
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
          placeholder="Cardiology Fundamentals"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          required
          defaultValue={initialValues?.id}
          placeholder="cardiology"
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
          placeholder="ECG interpretation, heart failure management..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
        />
      </div>
      <SubmitButton />
    </form>
  );
}
