'use client';

import { useMemo, useState } from 'react';
import { useFormState } from 'react-dom';
import type { ModuleItem } from '@/lib/data/learning';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminWizardActions, AdminWizardShell, type AdminWizardStep } from '@/components/admin/admin-wizard';
import { titleToSlug } from '@/lib/utils/slug';

type FormAction = (
  prev: unknown,
  formData: FormData
) => Promise<{ success: boolean; error?: string }>;

interface ModuleFormProps {
  action: FormAction;
  initialValues?: ModuleItem;
}

export function ModuleForm({ action, initialValues }: ModuleFormProps): React.ReactElement {
  const [state, formAction] = useFormState(action, null);
  const [step, setStep] = useState(0);
  const isEdit = !!initialValues;
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [slug, setSlug] = useState(initialValues?.slug ?? initialValues?.id ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [passThreshold, setPassThreshold] = useState(String(initialValues?.passThresholdPercent ?? 80));
  const derivedSlug = useMemo(() => titleToSlug(title), [title]);
  const steps: AdminWizardStep[] = [
    { id: 'basics', title: 'Basics', description: 'Name and URL' },
    { id: 'rules', title: 'Rules', description: 'Passing threshold' },
    { id: 'review', title: 'Review', description: 'Save module' },
  ];

  return (
    <form action={formAction}>
      <AdminWizardShell steps={steps} currentStep={step}>
        {initialValues && <input type="hidden" name="id" value={initialValues.id} />}
        {step !== 0 ? <input type="hidden" name="title" value={title} /> : null}
        {step !== 0 ? <input type="hidden" name="slug" value={isEdit ? slug : derivedSlug} /> : null}
        {step !== 0 ? <input type="hidden" name="description" value={description} /> : null}
        {step !== 1 ? <input type="hidden" name="pass_threshold_percent" value={passThreshold} /> : null}
        {state?.error ? (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
        ) : null}
        {step === 0 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                required
                value={title}
                onChange={(e) => {
                  const nextTitle = e.target.value;
                  setTitle(nextTitle);
                  if (!isEdit) {
                    setSlug(titleToSlug(nextTitle));
                  }
                }}
                placeholder="Cardiology Fundamentals"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug {!isEdit && '(auto-generated from title)'}</Label>
              {isEdit ? (
                <Input
                  id="slug"
                  name="slug"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="cardiology"
                  className="w-full"
                />
              ) : (
                <>
                  <Input
                    id="slug"
                    name="slug"
                    required
                    value={derivedSlug}
                    placeholder="cardiology"
                    className="w-full bg-slate-50"
                    readOnly
                  />
                  <p className="text-xs text-slate-500">
                    Generated from title. Update title to change slug.
                  </p>
                </>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ECG interpretation, heart failure management..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        ) : null}
        {step === 1 ? (
          <div className="space-y-2">
            <Label htmlFor="pass_threshold_percent">Pass threshold (%)</Label>
            <Input
              id="pass_threshold_percent"
              name="pass_threshold_percent"
              type="number"
              min={1}
              max={100}
              value={passThreshold}
              onChange={(e) => setPassThreshold(e.target.value)}
              placeholder="80"
              className="w-24"
            />
            <p className="text-xs text-slate-500">
              Minimum score required to pass module quizzes (default 80).
            </p>
          </div>
        ) : null}
        {step === 2 ? (
          <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
            Review module details, then save. You can manage lessons after saving.
          </div>
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
