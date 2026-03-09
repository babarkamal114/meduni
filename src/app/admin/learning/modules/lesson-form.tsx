'use client';

import { useFormState } from 'react-dom';
import type { LessonItem } from '@/lib/mock/learning';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type FormAction = (
  prev: unknown,
  formData: FormData
) => Promise<{ success: boolean; error?: string }>;

interface LessonFormProps {
  moduleId: string;
  action: FormAction;
  initialValues?: LessonItem;
}

export function LessonForm({ moduleId, action, initialValues }: LessonFormProps): React.ReactElement {
  const [state, formAction] = useFormState(action, null);

  return (
    <form action={formAction} className="max-w-xl space-y-6 rounded-xl border border-black/[0.06] bg-white p-6">
      <input type="hidden" name="moduleId" value={moduleId} />
      {initialValues && <input type="hidden" name="lessonId" value={initialValues.id} />}
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
          placeholder="Introduction to ECG"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="duration">Duration</Label>
        <Input
          id="duration"
          name="duration"
          defaultValue={initialValues?.duration}
          placeholder="12 min"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="body">Body</Label>
        <textarea
          id="body"
          name="body"
          rows={5}
          defaultValue={initialValues?.body}
          placeholder="Lesson content..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[120px]"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="hasVideo"
          name="hasVideo"
          defaultChecked={initialValues?.hasVideo ?? false}
          className="h-4 w-4 rounded border-input"
        />
        <Label htmlFor="hasVideo">Has video</Label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="videoUrl">Video URL</Label>
        <Input
          id="videoUrl"
          name="videoUrl"
          type="url"
          defaultValue={(initialValues as { videoUrl?: string })?.videoUrl ?? undefined}
          placeholder="https://..."
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="videoDuration">Video duration</Label>
        <Input
          id="videoDuration"
          name="videoDuration"
          defaultValue={initialValues?.videoDuration ?? undefined}
          placeholder="10 min"
          className="w-full"
        />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}
