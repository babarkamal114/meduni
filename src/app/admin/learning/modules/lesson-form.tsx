'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import type { LessonItem } from '@/lib/data/learning';
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
  defaultStepType?: 'content' | 'quiz';
}

export function LessonForm({ moduleId, action, initialValues, defaultStepType }: LessonFormProps): React.ReactElement {
  const [state, formAction] = useFormState(action, null);
  const stepType = initialValues?.lessonType ?? defaultStepType ?? 'content';
  const [type, setType] = useState<'content' | 'quiz'>(stepType);
  const [numQuestions, setNumQuestions] = useState(() => initialValues?.questions?.length ?? 1);
  const isQuiz = type === 'quiz';

  return (
    <form action={formAction} className="max-w-xl space-y-6 rounded-xl border border-black/[0.06] bg-white p-6">
      <input type="hidden" name="moduleId" value={moduleId} />
      {initialValues && <input type="hidden" name="lessonId" value={initialValues.id} />}
      <input type="hidden" name="stepType" value={type} />
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{state.error}</p>
      )}
      <div className="space-y-2">
        <Label>Step type</Label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="stepTypeRadio"
              checked={type === 'content'}
              onChange={() => setType('content')}
              className="h-4 w-4"
            />
            <span>Lesson (content)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="stepTypeRadio"
              checked={type === 'quiz'}
              onChange={() => setType('quiz')}
              className="h-4 w-4"
            />
            <span>Quiz</span>
          </label>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={initialValues?.title}
          placeholder={isQuiz ? 'Module check: ECG basics' : 'Introduction to ECG'}
          className="w-full"
        />
      </div>
      {!isQuiz && (
        <>
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
        </>
      )}
      {isQuiz && (
        <>
          <div className="space-y-2">
            <Label htmlFor="body">Intro (optional)</Label>
            <textarea
              id="body"
              name="body"
              rows={2}
              defaultValue={initialValues?.body}
              placeholder="Short intro text for the quiz..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
            />
          </div>
          <div className="border-t border-black/5 pt-4 mt-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <Label className="block">Questions</Label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add at least one question with two options. Mark the correct option(s).
                </p>
              </div>
              <input type="hidden" name="quiz_question_count" value={numQuestions} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setNumQuestions((n) => n + 1)}
              >
                Add question
              </Button>
            </div>
            <div className="space-y-4">
              {Array.from({ length: numQuestions }, (_, i) => i + 1).map((n) => (
                <div key={n} className="rounded-lg border border-black/10 p-3 space-y-2">
                  <Label htmlFor={`question_${n}`} className="text-xs">Question {n}</Label>
                  <Input
                    id={`question_${n}`}
                    name={`question_${n}`}
                    defaultValue={initialValues?.questions?.[n - 1]?.question ?? ''}
                    placeholder="Question text..."
                    className="w-full"
                  />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input
                      name={`q${n}_option_1_label`}
                      placeholder="Option A"
                      defaultValue={initialValues?.questions?.[n - 1]?.options?.[0]?.label ?? ''}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name={`q${n}_option_1_correct`}
                        defaultChecked={initialValues?.questions?.[n - 1]?.options?.[0]?.correct ?? false}
                        className="h-4 w-4"
                      />
                      <Label className="text-xs">Correct</Label>
                    </div>
                    <Input
                      name={`q${n}_option_2_label`}
                      placeholder="Option B"
                      defaultValue={initialValues?.questions?.[n - 1]?.options?.[1]?.label ?? ''}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name={`q${n}_option_2_correct`}
                        defaultChecked={initialValues?.questions?.[n - 1]?.options?.[1]?.correct ?? false}
                        className="h-4 w-4"
                      />
                      <Label className="text-xs">Correct</Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      <Button type="submit">Save</Button>
    </form>
  );
}
