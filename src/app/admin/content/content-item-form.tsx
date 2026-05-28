'use client';

import { useFormState } from 'react-dom';
import { useState, useId } from 'react';
import type { ContentItem, ContentQuizItem, QuizQuestion } from '@/lib/data/learning';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { AdminWizardActions, AdminWizardShell, type AdminWizardStep } from '@/components/admin/admin-wizard';

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

type QuizQuestionState = { id: string; question: string; options: { id: string; label: string; correct: boolean }[] };

const defaultQuestion = (): QuizQuestionState => ({
  id: `q-${Math.random().toString(36).slice(2, 11)}`,
  question: '',
  options: [
    { id: 'a', label: '', correct: false },
    { id: 'b', label: '', correct: false },
  ],
});

const defaultOption = () => ({
  id: `o-${Math.random().toString(36).slice(2, 9)}`,
  label: '',
  correct: false,
});

const MAX_OPTIONS = 6;
const MIN_OPTIONS = 2;

function toState(q: QuizQuestion): QuizQuestionState {
  return {
    id: q.id,
    question: q.question,
    options: q.options.map((o) => ({ id: o.id, label: o.label, correct: o.correct })),
  };
}

function toPayload(questions: QuizQuestionState[]): { id: string; question: string; options: { id: string; label: string; correct: boolean }[] }[] {
  return questions
    .filter((q) => q.question.trim())
    .map((q) => ({
      id: q.id,
      question: q.question.trim(),
      options: q.options.filter((o) => o.label.trim()).map((o) => ({ id: o.id, label: o.label.trim(), correct: o.correct })),
    }))
    .filter((q) => q.options.length >= MIN_OPTIONS);
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

  const initialQuestions: QuizQuestionState[] =
    initialValues && 'questions' in initialValues && initialValues.questions?.length
      ? initialValues.questions.map(toState)
      : [defaultQuestion()];
  const [questions, setQuestions] = useState<QuizQuestionState[]>(initialQuestions);
  const [step, setStep] = useState(0);
  const formId = useId();
  const steps: AdminWizardStep[] = [
    { id: 'details', title: 'Details' },
    { id: 'meta', title: 'Meta' },
    { id: 'quiz', title: isQuiz ? 'Quiz Builder' : 'Review' },
    { id: 'review', title: 'Review' },
  ];

  const addQuestion = () => setQuestions((prev) => [...prev, defaultQuestion()]);
  const removeQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };
  const setQuestionText = (index: number, value: string) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, question: value } : q)));
  };
  const addOption = (qIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex && q.options.length < MAX_OPTIONS
          ? { ...q, options: [...q.options, defaultOption()] }
          : q
      )
    );
  };
  const removeOption = (qIndex: number, oIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex && q.options.length > MIN_OPTIONS
          ? { ...q, options: q.options.filter((_, j) => j !== oIndex) }
          : q
      )
    );
  };
  const setOption = (qIndex: number, oIndex: number, field: 'label' | 'correct', value: string | boolean) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((opt, j) =>
                j === oIndex ? { ...opt, [field]: value } : field === 'correct' ? { ...opt, correct: false } : opt
              ),
            }
          : q
      )
    );
  };

  const quizPayload = toPayload(questions);
  const quizJson = isQuiz ? JSON.stringify(quizPayload) : '';

  return (
    <form action={formAction}>
      <AdminWizardShell steps={steps} currentStep={step}>
      <input type="hidden" name="type" value={type} />
      {initialValues && <input type="hidden" name="id" value={initialValues.id} />}
      {isQuiz && <input type="hidden" name="quiz_questions_json" value={quizJson} />}
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{state.error}</p>
      )}
      {(step === 0 || step === 3) && <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={initialValues?.title}
          placeholder="Week 12: Acute Coronary Syndromes"
          className="w-full"
        />
      </div>}
      {(step === 0 || step === 3) && <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={initialValues?.description}
          placeholder="PDF · 24 pages · Published 2 days ago"
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
        />
      </div>}
      {(step === 1 || step === 3) && <div className="space-y-2">
        <Label htmlFor="meta">Meta</Label>
        <Input
          id="meta"
          name="meta"
          defaultValue={initialValues?.meta}
          placeholder="PDF · 24 pages · Published 2 days ago"
          className="w-full"
        />
      </div>}
      {(step === 1 || step === 3) && <div className="space-y-2">
        <Label htmlFor="estimatedTime">Estimated time</Label>
        <Input
          id="estimatedTime"
          name="estimatedTime"
          defaultValue={initialValues?.estimatedTime ?? undefined}
          placeholder="24 pages or 15 min"
          className="w-full"
        />
      </div>}
      {isPdf && (step === 1 || step === 3) && (
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
      {isVideo && (step === 1 || step === 3) && (
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
      {isQuiz && (step === 2 || step === 3) && (
        <div className="border-t border-black/5 pt-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <Label className="block">Questions</Label>
            <Button type="button" variant="outline" size="sm" onClick={addQuestion} className="gap-1">
              <Plus className="h-3.5 w-3.5" />
              Add question
            </Button>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Add one or more questions. Each question needs at least two options; mark the correct one(s).
          </p>
          <div className="space-y-4">
            {questions.map((q, qIndex) => (
              <div key={q.id} className="rounded-lg border border-black/10 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-500">Question {qIndex + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                    onClick={() => removeQuestion(qIndex)}
                    disabled={questions.length <= 1}
                    aria-label="Remove question"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Input
                  id={`${formId}-q-${qIndex}`}
                  placeholder="Question text..."
                  value={q.question}
                  onChange={(e) => setQuestionText(qIndex, e.target.value)}
                  className="w-full"
                />
                <div className="space-y-2">
                  {q.options.map((opt, oIndex) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <Input
                        placeholder={`Option ${oIndex + 1}`}
                        value={opt.label}
                        onChange={(e) => setOption(qIndex, oIndex, 'label', e.target.value)}
                        className="flex-1"
                      />
                      <label className="flex items-center gap-1.5 shrink-0 text-xs text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={opt.correct}
                          onChange={(e) => setOption(qIndex, oIndex, 'correct', e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                        Correct
                      </label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-red-600 h-8 w-8 p-0"
                        onClick={() => removeOption(qIndex, oIndex)}
                        disabled={q.options.length <= MIN_OPTIONS}
                        aria-label="Remove option"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                  {q.options.length < MAX_OPTIONS && (
                    <Button type="button" variant="outline" size="sm" onClick={() => addOption(qIndex)} className="gap-1">
                      <Plus className="h-3.5 w-3.5" />
                      Add option
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {quizPayload.length === 0 && (
            <p className="text-xs text-amber-600 mt-2">
              Add at least one question with text and at least two options to save the quiz.
            </p>
          )}
        </div>
      )}
      {step === 3 ? (
        <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
          Review this content item and save when ready.
        </p>
      ) : null}
      <AdminWizardActions
        currentStep={step}
        totalSteps={steps.length}
        onBack={() => setStep((prev) => Math.max(0, prev - 1))}
        onNext={() => setStep((prev) => Math.min(steps.length - 1, prev + 1))}
        disableSubmit={isQuiz && quizPayload.length === 0}
        submitLabel="Save"
      />
    </AdminWizardShell>
    </form>
  );
}
