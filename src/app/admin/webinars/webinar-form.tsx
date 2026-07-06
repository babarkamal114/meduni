'use client';

import { useMemo, useState } from 'react';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import type { Webinar, WebinarStatus } from '@/lib/data/webinars';
import type { WebinarFormResult } from './actions';
import { titleToSlug } from '@/lib/utils/slug';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/forms/form-message';
import { ApiErrorAlert } from '@/components/ui/api-error-alert';
import { cn } from '@/lib/utils/cn';
import { AdminWizardActions, AdminWizardShell, type AdminWizardStep } from '@/components/admin/admin-wizard';

const STATUS_OPTIONS: { value: WebinarStatus; label: string }[] = [
  { value: 'live', label: 'Live' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'recorded', label: 'Recorded' },
];

type FormAction = (prev: unknown, formData: FormData) => Promise<WebinarFormResult | void>;

interface WebinarFormProps {
  action: FormAction;
  initialValues?: Webinar;
}

export function WebinarForm({ action, initialValues }: WebinarFormProps): React.ReactElement {
  const isEdit = !!initialValues;
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [slug, setSlug] = useState(initialValues?.slug ?? '');
  const [expert, setExpert] = useState(initialValues?.expert ?? '');
  const [duration, setDuration] = useState(initialValues?.duration ?? '');
  const [price, setPrice] = useState(initialValues?.price ?? '');
  const [status, setStatus] = useState<WebinarStatus>(initialValues?.status ?? 'upcoming');
  const [outcomes, setOutcomes] = useState(initialValues?.outcomes?.join('\n') ?? '');
  const [scheduledAt, setScheduledAt] = useState(
    initialValues?.scheduledAt ? new Date(initialValues.scheduledAt).toISOString().slice(0, 16) : ''
  );
  const [hasReplay, setHasReplay] = useState(initialValues?.hasReplay ?? false);
  const [step, setStep] = useState(0);
  const derivedSlug = useMemo(() => titleToSlug(title), [title]);
  const steps: AdminWizardStep[] = [
    { id: 'basics', title: 'Basics', description: 'Title and expert' },
    { id: 'schedule', title: 'Schedule', description: 'Timing and status' },
    { id: 'details', title: 'Details', description: 'Outcomes and replay' },
    { id: 'review', title: 'Review', description: 'Confirm and save' },
  ];

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | undefined>(undefined);
  const [isPending, setIsPending] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);

  const hasError = (key: string) => !!(fieldErrors && fieldErrors[key]?.length);
  const getError = (key: string) => fieldErrors?.[key]?.[0] ?? '';

  const validateStep = (): boolean => {
    if (step === 0) {
      if (!title.trim()) { setStepError('Title is required.'); return false; }
      if (!expert.trim()) { setStepError('Expert is required.'); return false; }
    }
    if (step === 1) {
      if (!duration.trim()) { setStepError('Duration is required.'); return false; }
      if (!price.trim()) { setStepError('Price is required.'); return false; }
      if (!scheduledAt) { setStepError('Scheduled date is required.'); return false; }
    }
    setStepError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors(undefined);
    setIsPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      const result = await action(null, formData);
      if (result && !result.success) {
        setError(result.error ?? 'Please fix the errors below.');
        setFieldErrors(result.fieldErrors);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError('Something went wrong. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <ApiErrorAlert
        message={error?.trim() ? error : null}
        onDismiss={() => setError(null)}
        autoDismissMs={6000}
      />
      <form onSubmit={handleSubmit}>
        <AdminWizardShell steps={steps} currentStep={step}>
        {initialValues && <input type="hidden" name="id" value={initialValues.id} />}
        {step !== 0 ? <input type="hidden" name="title" value={title} /> : null}
        {step !== 0 ? <input type="hidden" name="slug" value={isEdit ? slug : derivedSlug} /> : null}
        {step !== 0 ? <input type="hidden" name="expert" value={expert} /> : null}
        {step !== 1 ? <input type="hidden" name="duration" value={duration} /> : null}
        {step !== 1 ? <input type="hidden" name="price" value={price} /> : null}
        {step !== 1 ? <input type="hidden" name="status" value={status} /> : null}
        {step !== 2 ? <input type="hidden" name="outcomes" value={outcomes} /> : null}
        {step !== 1 ? <input type="hidden" name="scheduledAt" value={scheduledAt} /> : null}
        {step !== 2 && hasReplay ? <input type="hidden" name="hasReplay" value="on" /> : null}
      {(step === 0 || step === 3) && <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Cardiology Update 2025"
          className="w-full"
          error={hasError('title')}
          aria-invalid={hasError('title')}
          aria-describedby={hasError('title') ? 'title-error' : undefined}
        />
        {hasError('title') && (
          <FormMessage id="title-error" message={getError('title')} type="error" className="mt-1 text-red-600" />
        )}
      </div>}
      {(step === 0 || step === 3) && <div className="space-y-2">
        <Label htmlFor="slug">Slug {!isEdit && '(auto-generated from title)'}</Label>
        {isEdit ? (
          <>
            <Input
              id="slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="cardiology-update-2025"
              className="w-full"
              error={hasError('slug')}
              aria-invalid={hasError('slug')}
              aria-describedby={hasError('slug') ? 'slug-error' : undefined}
            />
            {hasError('slug') && (
              <FormMessage id="slug-error" message={getError('slug')} type="error" className="mt-1 text-red-600" />
            )}
          </>
        ) : (
          <Input
            id="slug"
            name="slug"
            value={derivedSlug}
            placeholder="cardiology-update-2025"
            className="w-full bg-slate-50"
            disabled
            readOnly
            aria-describedby="slug-hint"
          />
        )}
        {!isEdit && (
          <p id="slug-hint" className="text-xs text-slate-500">
            Generated from title. Edit the title to change the URL slug.
          </p>
        )}
      </div>}
      {(step === 0 || step === 3) && <div className="space-y-2">
        <Label htmlFor="expert">Expert *</Label>
        <Input
          id="expert"
          name="expert"
          required
          value={expert}
          onChange={(e) => setExpert(e.target.value)}
          placeholder="Dr. James Carter"
          className="w-full"
          error={hasError('expert')}
          aria-invalid={hasError('expert')}
          aria-describedby={hasError('expert') ? 'expert-error' : undefined}
        />
        {hasError('expert') && (
          <FormMessage id="expert-error" message={getError('expert')} type="error" className="mt-1 text-red-600" />
        )}
      </div>}
      {(step === 1 || step === 3) && <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration *</Label>
            <Input
            id="duration"
            name="duration"
            required
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="1.5 hours"
            className="w-full"
            error={hasError('duration')}
            aria-invalid={hasError('duration')}
            aria-describedby={hasError('duration') ? 'duration-error' : undefined}
          />
          {hasError('duration') && (
            <FormMessage id="duration-error" message={getError('duration')} type="error" className="mt-1 text-red-600" />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
            <Input
            id="price"
            name="price"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="£3.00"
            className="w-full"
            error={hasError('price')}
            aria-invalid={hasError('price')}
            aria-describedby={hasError('price') ? 'price-error' : undefined}
          />
          {hasError('price') && (
            <FormMessage id="price-error" message={getError('price')} type="error" className="mt-1 text-red-600" />
          )}
        </div>
      </div>}
      {(step === 1 || step === 3) && <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <select
          id="status"
          name="status"
          required
          value={status}
          onChange={(e) => setStatus(e.target.value as WebinarStatus)}
          className={cn(
            'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm',
            hasError('status') ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2' : 'border-input'
          )}
          aria-invalid={hasError('status')}
          aria-describedby={hasError('status') ? 'status-error' : undefined}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {hasError('status') && (
          <FormMessage id="status-error" message={getError('status')} type="error" className="mt-1 text-red-600" />
        )}
      </div>}
      {(step === 2 || step === 3) && <div className="space-y-2">
        <Label htmlFor="outcomes">Outcomes</Label>
        <Textarea
          id="outcomes"
          name="outcomes"
          rows={4}
          value={outcomes}
          onChange={(e) => setOutcomes(e.target.value)}
          placeholder="One outcome per line (e.g. Understand key diagnostic criteria)"
          className="w-full resize-y min-h-[100px] font-mono text-sm"
          error={hasError('outcomes')}
          aria-invalid={hasError('outcomes')}
          aria-describedby={hasError('outcomes') ? 'outcomes-error' : undefined}
        />
        <p className="text-xs text-slate-500">
          One outcome per line. Stored as an array.
        </p>
        {hasError('outcomes') && (
          <FormMessage id="outcomes-error" message={getError('outcomes')} type="error" className="mt-1 text-red-600" />
        )}
      </div>}
      {(step === 1 || step === 3) && <div className="space-y-2">
        <Label htmlFor="scheduledAt">Scheduled at *</Label>
        <Input
          id="scheduledAt"
          name="scheduledAt"
          type="datetime-local"
          required={!isEdit}
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="w-full"
          error={hasError('scheduledAt')}
          aria-invalid={hasError('scheduledAt')}
          aria-describedby={hasError('scheduledAt') ? 'scheduledAt-error' : undefined}
        />
        {hasError('scheduledAt') && (
          <FormMessage id="scheduledAt-error" message={getError('scheduledAt')} type="error" className="mt-1 text-red-600" />
        )}
      </div>}
      {(step === 2 || step === 3) && <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="hasReplay"
          name="hasReplay"
          checked={hasReplay}
          onChange={(e) => setHasReplay(e.target.checked)}
          className="h-4 w-4 rounded border-input"
        />
        <Label htmlFor="hasReplay">Has replay</Label>
      </div>}
      {step === 3 ? (
        <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
          Review the webinar details above, then save.
        </div>
      ) : null}
      {stepError ? (
        <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700" role="alert">{stepError}</p>
      ) : null}
      <AdminWizardActions
        currentStep={step}
        totalSteps={steps.length}
        onBack={() => { setStepError(null); setStep((prev) => Math.max(0, prev - 1)); }}
        onNext={() => setStep((prev) => Math.min(steps.length - 1, prev + 1))}
        onBeforeNext={validateStep}
        isSubmitting={isPending}
      />
    </AdminWizardShell>
    </form>
    </>
  );
}
