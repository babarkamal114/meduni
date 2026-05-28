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
  const [step, setStep] = useState(0);
  const [questionOptionCounts, setQuestionOptionCounts] = useState<number[]>(
    () => Array.from({ length: initialValues?.questions?.length ?? 1 }, (_, i) => Math.max(2, initialValues?.questions?.[i]?.options?.length ?? 2))
  );
  const isQuiz = type === 'quiz';
  const totalSteps = 4;

  const addQuestion = () => {
    setQuestionOptionCounts((prev) => [...prev, 2]);
  };

  const removeQuestion = (questionIndex: number) => {
    setQuestionOptionCounts((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, idx) => idx !== questionIndex);
    });
  };

  const addOption = (questionIndex: number) => {
    setQuestionOptionCounts((prev) =>
      prev.map((count, idx) => (idx === questionIndex ? Math.min(6, count + 1) : count))
    );
  };

  return (
    <form action={formAction} className="max-w-3xl space-y-6 rounded-xl border border-black/[0.06] bg-white p-6">
      <div className="grid gap-2 sm:grid-cols-4">
        {['Type', 'Details', 'Media/Quiz', 'Review'].map((item, index) => (
          <div
            key={item}
            className={`rounded-lg border px-3 py-2 text-sm ${
              step === index ? 'border-teal-300 bg-teal-50 text-teal-700' : step > index ? 'border-teal-200 bg-teal-50/60 text-teal-700' : 'border-black/10 bg-slate-50 text-slate-600'
            }`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide">Step {index + 1}</p>
            <p className="font-medium">{item}</p>
          </div>
        ))}
      </div>
      <input type="hidden" name="moduleId" value={moduleId} />
      {initialValues && <input type="hidden" name="lessonId" value={initialValues.id} />}
      <input type="hidden" name="stepType" value={type} />
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{state.error}</p>
      )}
      {step === 0 && <div className="space-y-2">
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
      </div>}
      {(step === 1 || step === 3) && <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={initialValues?.title}
          placeholder={isQuiz ? 'Module check: ECG basics' : 'Introduction to ECG'}
          className="w-full"
        />
      </div>}
      {!isQuiz && (step === 1 || step === 2 || step === 3) && (
        <>
          {(step === 1 || step === 3) && <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              name="duration"
              defaultValue={initialValues?.duration}
              placeholder="12 min"
              className="w-full"
            />
          </div>}
          {(step === 1 || step === 3) && <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <textarea
              id="body"
              name="body"
              rows={5}
              defaultValue={initialValues?.body}
              placeholder="Lesson content..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[120px]"
            />
          </div>}
          {(step === 2 || step === 3) && <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hasVideo"
              name="hasVideo"
              defaultChecked={initialValues?.hasVideo ?? false}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="hasVideo">Has video</Label>
          </div>}
          {(step === 2 || step === 3) && <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL</Label>
            <Input
              id="videoUrl"
              name="videoUrl"
              type="url"
              defaultValue={initialValues?.videoUrl}
              placeholder="https://..."
              className="w-full"
            />
          </div>}
          {(step === 2 || step === 3) && <div className="space-y-2">
            <Label htmlFor="videoDuration">Video duration</Label>
            <Input
              id="videoDuration"
              name="videoDuration"
              defaultValue={initialValues?.videoDuration ?? undefined}
              placeholder="10 min"
              className="w-full"
            />
          </div>}
        </>
      )}
      {isQuiz && (step === 2 || step === 3) && (
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
              <input type="hidden" name="quiz_question_count" value={questionOptionCounts.length} />
            </div>
            <div className="space-y-4">
              {questionOptionCounts.map((optionCount, questionIndex) => {
                const n = questionIndex + 1;
                return (
                <div key={n} className="rounded-lg border border-black/10 p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor={`question_${n}`} className="text-xs">Question {n}</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(questionIndex)}
                      disabled={questionOptionCounts.length <= 1}
                      className="h-7 px-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      Delete question
                    </Button>
                  </div>
                  <input type="hidden" name={`q${n}_option_count`} value={optionCount} />
                  <Input
                    id={`question_${n}`}
                    name={`question_${n}`}
                    defaultValue={initialValues?.questions?.[n - 1]?.question ?? ''}
                    placeholder="Question text..."
                    className="w-full"
                  />
                  <div className="space-y-2 mt-2">
                    {Array.from({ length: optionCount }, (_, optionIndex) => optionIndex + 1).map((optionNumber) => (
                      <div key={optionNumber} className="grid grid-cols-2 gap-2">
                        <Input
                          name={`q${n}_option_${optionNumber}_label`}
                          placeholder={`Option ${String.fromCharCode(64 + optionNumber)}`}
                          defaultValue={initialValues?.questions?.[n - 1]?.options?.[optionNumber - 1]?.label ?? ''}
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name={`q${n}_option_${optionNumber}_correct`}
                            defaultChecked={initialValues?.questions?.[n - 1]?.options?.[optionNumber - 1]?.correct ?? false}
                            className="h-4 w-4"
                          />
                          <Label className="text-xs">Correct</Label>
                        </div>
                      </div>
                    ))}
                    {optionCount < 6 ? (
                      <Button type="button" variant="outline" size="sm" onClick={() => addOption(questionIndex)}>
                        Add option
                      </Button>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-xs text-slate-500">
                      You can add up to 6 options per question.
                    </div>
                    <div />
                  </div>
                </div>
              );
              })}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addQuestion}
              className="mt-3"
            >
              Add question
            </Button>
          </div>
        </>
      )}
      {step === 3 ? (
        <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
          Review this step and save when ready.
        </p>
      ) : null}
      <div className="flex items-center justify-between border-t border-black/5 pt-4">
        <Button type="button" variant="outline" onClick={() => setStep((prev) => Math.max(0, prev - 1))} disabled={step === 0}>
          Back
        </Button>
        {step === totalSteps - 1 ? (
          <Button type="submit">Save</Button>
        ) : (
          <Button type="button" onClick={() => setStep((prev) => Math.min(totalSteps - 1, prev + 1))}>
            Next
          </Button>
        )}
      </div>
    </form>
  );
}
