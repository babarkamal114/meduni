'use client';

import { useMemo, useState } from 'react';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import type { Webinar, WebinarStatus } from '@/lib/data/webinars';
import type { WebinarFormResult } from './actions';
import { titleToSlug } from '@/lib/utils/slug';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/forms/form-message';
import { ApiErrorAlert } from '@/components/ui/api-error-alert';
import { cn } from '@/lib/utils/cn';

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
  const derivedSlug = useMemo(() => titleToSlug(title), [title]);

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>> | undefined>(undefined);
  const [isPending, setIsPending] = useState(false);

  const hasError = (key: string) => !!(fieldErrors && fieldErrors[key]);

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
      <form onSubmit={handleSubmit} className="max-w-xl space-y-6 rounded-xl border border-black/[0.06] bg-white p-6">
        {initialValues && <input type="hidden" name="id" value={initialValues.id} />}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          name="title"
          required
          value={isEdit ? undefined : title}
          defaultValue={isEdit ? initialValues?.title : undefined}
          onChange={isEdit ? undefined : (e) => setTitle(e.target.value)}
          placeholder="Cardiology Update 2025"
          className="w-full"
          error={hasError('title')}
          aria-invalid={hasError('title')}
          aria-describedby={hasError('title') ? 'title-error' : undefined}
        />
        {hasError('title') && (
          <FormMessage id="title-error" message={fieldErrors!.title!} type="error" className="mt-1 text-red-600" />
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug {!isEdit && '(auto-generated from title)'}</Label>
        {isEdit ? (
          <>
            <Input
              id="slug"
              name="slug"
              required
              defaultValue={initialValues?.slug}
              placeholder="cardiology-update-2025"
              className="w-full"
              error={hasError('slug')}
              aria-invalid={hasError('slug')}
              aria-describedby={hasError('slug') ? 'slug-error' : undefined}
            />
            {hasError('slug') && (
              <FormMessage id="slug-error" message={fieldErrors!.slug!} type="error" className="mt-1 text-red-600" />
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="expert">Expert *</Label>
        <Input
          id="expert"
          name="expert"
          required
          defaultValue={initialValues?.expert}
          placeholder="Dr. James Carter"
          className="w-full"
          error={hasError('expert')}
          aria-invalid={hasError('expert')}
          aria-describedby={hasError('expert') ? 'expert-error' : undefined}
        />
        {hasError('expert') && (
          <FormMessage id="expert-error" message={fieldErrors!.expert!} type="error" className="mt-1 text-red-600" />
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration *</Label>
            <Input
            id="duration"
            name="duration"
            required
            defaultValue={initialValues?.duration}
            placeholder="1.5 hours"
            className="w-full"
            error={hasError('duration')}
            aria-invalid={hasError('duration')}
            aria-describedby={hasError('duration') ? 'duration-error' : undefined}
          />
          {hasError('duration') && (
            <FormMessage id="duration-error" message={fieldErrors!.duration!} type="error" className="mt-1 text-red-600" />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
            <Input
            id="price"
            name="price"
            required
            defaultValue={initialValues?.price}
            placeholder="£29.99"
            className="w-full"
            error={hasError('price')}
            aria-invalid={hasError('price')}
            aria-describedby={hasError('price') ? 'price-error' : undefined}
          />
          {hasError('price') && (
            <FormMessage id="price-error" message={fieldErrors!.price!} type="error" className="mt-1 text-red-600" />
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <select
          id="status"
          name="status"
          required
          defaultValue={initialValues?.status ?? 'upcoming'}
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
          <FormMessage id="status-error" message={fieldErrors!.status!} type="error" className="mt-1 text-red-600" />
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="outcomes">Outcomes</Label>
        <Textarea
          id="outcomes"
          name="outcomes"
          rows={4}
          defaultValue={initialValues?.outcomes?.join('\n') ?? ''}
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
          <FormMessage id="outcomes-error" message={fieldErrors!.outcomes!} type="error" className="mt-1 text-red-600" />
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="scheduledAt">Scheduled at *</Label>
        <Input
          id="scheduledAt"
          name="scheduledAt"
          type="datetime-local"
          required={!isEdit}
          defaultValue={
            initialValues?.scheduledAt
              ? new Date(initialValues.scheduledAt).toISOString().slice(0, 16)
              : undefined
          }
          className="w-full"
          error={hasError('scheduledAt')}
          aria-invalid={hasError('scheduledAt')}
          aria-describedby={hasError('scheduledAt') ? 'scheduledAt-error' : undefined}
        />
        {hasError('scheduledAt') && (
          <FormMessage id="scheduledAt-error" message={fieldErrors!.scheduledAt!} type="error" className="mt-1 text-red-600" />
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="hasReplay"
          name="hasReplay"
          defaultChecked={initialValues?.hasReplay ?? false}
          className="h-4 w-4 rounded border-input"
        />
        <Label htmlFor="hasReplay">Has replay</Label>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </Button>
    </form>
    </>
  );
}
