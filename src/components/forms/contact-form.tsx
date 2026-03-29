'use client';

import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormMessage } from './form-message';
import { SubmitButton } from './submit-button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ApiErrorAlert } from '@/components/ui/api-error-alert';
import { cn } from '@/lib/utils/cn';

interface ContactFormProps {
  action: (formData: FormData) => Promise<
    | { success: true; message?: string }
    | { success: false; error: string; fieldErrors?: Record<string, string[]> }
  >;
}

export function ContactForm({ action }: ContactFormProps): React.ReactElement {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[]> | undefined
  >(undefined);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setSuccess(null);
    setFieldErrors(undefined);

    startTransition(async () => {
      const result = await action(formData);

      if (result.success) {
        setSuccess(result.message || 'Thank you! Your message has been sent successfully.');
        // Reset form
        const form = document.getElementById('contact-form') as HTMLFormElement;
        form?.reset();
      } else {
        setError(result.error);
        setFieldErrors(result.fieldErrors);
      }
    });
  };

  return (
    <>
      <ApiErrorAlert
        message={error ?? undefined}
        onDismiss={() => setError(null)}
        autoDismissMs={6000}
      />
      <Card className="border border-gray-200">
      <CardContent className="p-6 md:p-8">
        <form
          id="contact-form"
          action={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                error={!!fieldErrors?.name}
                disabled={isPending}
              />
              {fieldErrors?.name && (
                <FormMessage message={fieldErrors.name[0]} />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                error={!!fieldErrors?.email}
                disabled={isPending}
              />
              {fieldErrors?.email && (
                <FormMessage message={fieldErrors.email[0]} />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              placeholder="How can we help you?"
              required
              error={!!fieldErrors?.subject}
              disabled={isPending}
            />
            {fieldErrors?.subject && (
              <FormMessage message={fieldErrors.subject[0]} />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Please provide details about your inquiry..."
              rows={6}
              required
              error={!!fieldErrors?.message}
              disabled={isPending}
            />
            {fieldErrors?.message && (
              <FormMessage message={fieldErrors.message[0]} />
            )}
          </div>

          {success && <FormMessage message={success} type="success" />}

          <SubmitButton
            className={cn(
              'w-full bg-green-600 hover:bg-green-700',
              'text-white border-0'
            )}
            disabled={isPending}
          >
            {isPending ? 'Sending...' : 'Send Message'}
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
    </>
  );
}

