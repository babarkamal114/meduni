'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { MockWebinar } from '@/lib/data/mock-webinars';
import type { WebinarStatus } from '@/lib/data/mock-webinars';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const STATUS_OPTIONS: { value: WebinarStatus; label: string }[] = [
  { value: 'live', label: 'Live' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'recorded', label: 'Recorded' },
];

type FormAction = (
  prev: unknown,
  formData: FormData
) => Promise<{ success: boolean; error?: string }>;

interface WebinarFormProps {
  action: FormAction;
  initialValues?: MockWebinar;
}

function SubmitButtonInner(): React.ReactElement {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </Button>
  );
}

export function WebinarForm({ action, initialValues }: WebinarFormProps): React.ReactElement {
  const [state, formAction] = useFormState(action, null);
  const isEdit = !!initialValues;

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
          placeholder="Cardiology Update 2025"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          required
          defaultValue={initialValues?.slug}
          placeholder="cardiology-update-2025"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="expert">Expert</Label>
        <Input
          id="expert"
          name="expert"
          defaultValue={initialValues?.expert}
          placeholder="Dr. James Carter"
          className="w-full"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            name="duration"
            defaultValue={initialValues?.duration}
            placeholder="1.5 hours"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            defaultValue={initialValues?.price}
            placeholder="£29.99"
            className="w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={initialValues?.status ?? 'upcoming'}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="statusLabel">Status label</Label>
          <Input
            id="statusLabel"
            name="statusLabel"
            defaultValue={initialValues?.statusLabel}
            placeholder="Live Tomorrow"
            className="w-full"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="scheduledAt">Scheduled at</Label>
        <Input
          id="scheduledAt"
          name="scheduledAt"
          type="datetime-local"
          defaultValue={
            initialValues?.scheduledAt
              ? new Date(initialValues.scheduledAt).toISOString().slice(0, 16)
              : undefined
          }
          className="w-full"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="hasReplay"
          name="hasReplay"
          defaultChecked={initialValues?.hasReplay ?? false}
          className="h-4 w-4 rounded border-input"
        />
        <Label htmlFor="hasReplay">Has replay</Label>
      </div>
      <SubmitButtonInner />
    </form>
  );
}
