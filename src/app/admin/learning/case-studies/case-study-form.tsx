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
  const steps: AdminWizardStep[] = [
    { id: 'basics', title: 'Basics' },
    { id: 'outcome', title: 'Outcome' },
    { id: 'review', title: 'Review' },
  ];

  return (
    <form action={formAction}>
      <AdminWizardShell steps={steps} currentStep={step}>
        {initialValues && <input type="hidden" name="id" value={initialValues.id} />}
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
