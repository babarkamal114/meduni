'use client';

import { useState, useTransition } from 'react';
import { Send } from 'lucide-react';
import { Reveal } from '@/components/marketing/reveal';
import { SectionHeading } from '@/components/marketing/section-heading';
import { GlowButtonSubmit } from '@/components/marketing/glow-button';
import { submitContactForm } from '@/app/(auth)/actions/contact';
import { cn } from '@/lib/utils/cn';

const inputClass =
  'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none focus:border-teal-500/50 focus:bg-white focus:ring-2 focus:ring-teal-500/10 transition-all';

export function ContactSection(): React.ReactElement {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[]> | undefined
  >(undefined);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors(undefined);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const subject = formData.get('subject') as string;
    if (!subject?.trim()) {
      formData.set('subject', 'General enquiry');
    }

    startTransition(async () => {
      const result = await submitContactForm(formData);
      if (result.success) {
        setSuccess(result.message ?? 'Message sent! We\'ll get back to you within 24 hours.');
        form.reset();
      } else {
        setError(result.error);
        setFieldErrors(result.fieldErrors);
      }
    });
  };

  return (
    <section id="contact" className="py-32 sec-tint">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-16">
            <SectionHeading
              eyebrow="Get in touch"
              title={
                <>
                  Questions? <span className="italic grad-text">We&apos;re here to help.</span>
                </>
              }
              description="Have a question about our webinars or your account? Send a message and we'll get back to you within 24 hours."
            />
          </Reveal>
          <Reveal>
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl p-8 sm:p-10 space-y-6 border border-black/[.06] shadow-lg shadow-teal-500/5"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-slate-600 uppercase tracking-wider mb-2 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Dr. Jane Smith"
                    required
                    disabled={isPending}
                    className={cn(inputClass, fieldErrors?.name && 'border-red-500/50')}
                  />
                  {fieldErrors?.name && (
                    <p className="mt-1 text-xs text-red-500">{fieldErrors.name[0]}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-slate-600 uppercase tracking-wider mb-2 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="jane@meduni.co.uk"
                    required
                    disabled={isPending}
                    className={cn(inputClass, fieldErrors?.email && 'border-red-500/50')}
                  />
                  {fieldErrors?.email && (
                    <p className="mt-1 text-xs text-red-500">{fieldErrors.email[0]}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-600 uppercase tracking-wider mb-2 block">
                  Organisation
                </label>
                <input
                  type="text"
                  name="subject"
                  placeholder="MedUni"
                  disabled={isPending}
                  className={cn(inputClass, fieldErrors?.subject && 'border-red-500/50')}
                />
                {fieldErrors?.subject && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.subject[0]}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-slate-600 uppercase tracking-wider mb-2 block">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Tell us about your project requirements..."
                  required
                  disabled={isPending}
                  className={cn(inputClass, 'resize-none', fieldErrors?.message && 'border-red-500/50')}
                />
                {fieldErrors?.message && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.message[0]}</p>
                )}
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              {success && (
                <p className="text-sm text-teal-600">{success}</p>
              )}
              <GlowButtonSubmit disabled={isPending}>
                {isPending ? (
                  <>
                    <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5" />
                  </>
                )}
              </GlowButtonSubmit>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}