'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

export interface AdminWizardStep {
  id: string;
  title: string;
  description?: string;
}

interface AdminWizardShellProps {
  steps: AdminWizardStep[];
  currentStep: number;
  children: React.ReactNode;
}

interface AdminWizardActionsProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
  disableSubmit?: boolean;
  nextLabel?: string;
  submitLabel?: string;
}

export function AdminWizardShell({
  steps,
  currentStep,
  children,
}: AdminWizardShellProps): React.ReactElement {
  return (
    <div className="max-w-3xl space-y-6 rounded-xl border border-black/[0.06] bg-white p-6">
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isComplete = currentStep > index;
          return (
            <li
              key={step.id}
              className={cn(
                'rounded-lg border px-3 py-2',
                isActive
                  ? 'border-teal-300 bg-teal-50'
                  : isComplete
                    ? 'border-teal-200 bg-teal-50/50'
                    : 'border-black/10 bg-slate-50'
              )}
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Step {index + 1}
              </p>
              <p className={cn('text-sm font-medium', isActive || isComplete ? 'text-teal-700' : 'text-slate-700')}>
                {step.title}
              </p>
              {step.description ? (
                <p className="mt-0.5 text-xs text-slate-500">{step.description}</p>
              ) : null}
            </li>
          );
        })}
      </ol>
      <div>{children}</div>
    </div>
  );
}

export function AdminWizardActions({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isSubmitting = false,
  disableSubmit = false,
  nextLabel = 'Next',
  submitLabel = 'Save',
}: AdminWizardActionsProps): React.ReactElement {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex items-center justify-between border-t border-black/5 pt-4">
      <Button type="button" variant="outline" onClick={onBack} disabled={currentStep === 0 || isSubmitting}>
        Back
      </Button>
      {isLastStep ? (
        <Button type="submit" disabled={isSubmitting || disableSubmit}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      ) : (
        <Button type="button" onClick={onNext} disabled={isSubmitting}>
          {nextLabel}
        </Button>
      )}
    </div>
  );
}
