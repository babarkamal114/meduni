'use client';

import { useFormState } from 'react-dom';
import type { ContentItem, ContentQuizItem } from '@/lib/mock/learning';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type ContentType = 'pdf' | 'quiz' | 'video';

type FormAction = (
  prev: unknown,
  formData: FormData
) => Promise<{ success: boolean; error?: string }>;

interface ContentItemFormProps {
  action: FormAction;
  type: ContentType;
  initialValues?: ContentItem | ContentQuizItem;
}

export function ContentItemForm({
  action,
  type,
  initialValues,
}: ContentItemFormProps): React.ReactElement {
  const [state, formAction] = useFormState(action, null);
  const isQuiz = type === 'quiz';
  const isPdf = type === 'pdf';
  const isVideo = type === 'video';

  return (
    <form action={formAction} className="max-w-xl space-y-6 rounded-xl border border-black/[0.06] bg-white p-6">
      <input type="hidden" name="type" value={type} />
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
          placeholder="Week 12: Acute Coronary Syndromes"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={initialValues?.description}
          placeholder="PDF · 24 pages · Published 2 days ago"
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="meta">Meta</Label>
        <Input
          id="meta"
          name="meta"
          defaultValue={initialValues?.meta}
          placeholder="PDF · 24 pages · Published 2 days ago"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="estimatedTime">Estimated time</Label>
        <Input
          id="estimatedTime"
          name="estimatedTime"
          defaultValue={initialValues?.estimatedTime ?? undefined}
          placeholder="24 pages or 15 min"
          className="w-full"
        />
      </div>
      {isPdf && (
        <div className="space-y-2">
          <Label htmlFor="downloadUrl">Download URL</Label>
          <Input
            id="downloadUrl"
            name="downloadUrl"
            type="url"
            defaultValue={initialValues && 'downloadUrl' in initialValues ? initialValues.downloadUrl : undefined}
            placeholder="https://..."
            className="w-full"
          />
        </div>
      )}
      {isVideo && (
        <div className="space-y-2">
          <Label htmlFor="videoUrl">Video URL</Label>
          <Input
            id="videoUrl"
            name="videoUrl"
            type="url"
            defaultValue={initialValues && 'videoUrl' in initialValues ? initialValues.videoUrl : undefined}
            placeholder="https://..."
            className="w-full"
          />
        </div>
      )}
      {isQuiz && (
        <>
          <div className="border-t border-black/5 pt-4 mt-4">
            <Label className="mb-2 block">Questions</Label>
            <p className="text-xs text-slate-500 mb-3">
              Add questions and options. Full editor will be available with Supabase. Example below.
            </p>
            <div className="space-y-4">
              <div className="rounded-lg border border-black/10 p-3 space-y-2">
                <Label htmlFor="q1" className="text-xs">Question 1</Label>
                <Input
                  id="q1"
                  name="question_1"
                  defaultValue={
                    initialValues && 'questions' in initialValues && initialValues.questions[0]
                      ? initialValues.questions[0].question
                      : ''
                  }
                  placeholder="Question text..."
                  className="w-full"
                />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Input name="q1_option_1_label" placeholder="Option A" defaultValue={initialValues && 'questions' in initialValues ? initialValues.questions[0]?.options[0]?.label ?? '' : ''} />
                  <div className="flex items-center gap-2">
                    <input type="checkbox" name="q1_option_1_correct" defaultChecked={!!(initialValues && 'questions' in initialValues && initialValues.questions[0]?.options[0]?.correct)} className="h-4 w-4" />
                    <Label className="text-xs">Correct</Label>
                  </div>
                  <Input name="q1_option_2_label" placeholder="Option B" defaultValue={initialValues && 'questions' in initialValues ? initialValues.questions[0]?.options[1]?.label ?? '' : ''} />
                  <div className="flex items-center gap-2">
                    <input type="checkbox" name="q1_option_2_correct" defaultChecked={!!(initialValues && 'questions' in initialValues && initialValues.questions[0]?.options[1]?.correct)} className="h-4 w-4" />
                    <Label className="text-xs">Correct</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <Button type="submit">Save</Button>
    </form>
  );
}
