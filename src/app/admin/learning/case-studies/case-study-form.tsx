'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import type { CaseStudyItem } from '@/lib/data/learning';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminWizardActions, AdminWizardShell, type AdminWizardStep } from '@/components/admin/admin-wizard';

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
  const [step, setStep] = useState(0);

  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [slug, setSlug] = useState(initialValues?.slug ?? initialValues?.id ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [outcomeTitle, setOutcomeTitle] = useState(initialValues?.outcome.title ?? '');
  const [outcomeBody, setOutcomeBody] = useState(initialValues?.outcome.body ?? '');

  const steps: AdminWizardStep[] = [
    { id: 'basics', title: 'Basics' },
    { id: 'outcome', title: 'Outcome' },
    { id: 'review', title: 'Review' },
  ];

  return (
    <form action={formAction}>
      <AdminWizardShell steps={steps} currentStep={step}>
        {initialValues && <input type="hidden" name="id" value={initialValues.id} />}
        {step === 1 && <input type="hidden" name="title" value={title} />}
        {step === 1 && <input type="hidden" name="slug" value={slug} />}
        {step === 1 && <input type="hidden" name="description" value={description} />}
        {step === 0 && <input type="hidden" name="outcome_title" value={outcomeTitle} />}
        {step === 0 && <input type="hidden" name="outcome_body" value={outcomeBody} />}
        {state?.error ? (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
        ) : null}
        {(step === 0 || step === 2) && (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Interactive case: 45-year-old male presenting with acute chest pain."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </>
        )}
        {(step === 1 || step === 2) && (
          <>
            <div className="space-y-2">
              <Label htmlFor="outcome_title">Outcome title</Label>
              <Input
                id="outcome_title"
                name="outcome_title"
                value={outcomeTitle}
                onChange={(e) => setOutcomeTitle(e.target.value)}
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
                value={outcomeBody}
                onChange={(e) => setOutcomeBody(e.target.value)}
                placeholder="Outcome narrative..."
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </>
        )}
        {step === 2 ? (
          <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
            Steps and choices can be edited in a future release.
          </p>
        ) : null}
        <AdminWizardActions
          currentStep={step}
          totalSteps={steps.length}
          onBack={() => setStep((prev) => Math.max(0, prev - 1))}
          onNext={() => setStep((prev) => Math.min(steps.length - 1, prev + 1))}
        />
      </AdminWizardShell>
    </form>
  );
}
