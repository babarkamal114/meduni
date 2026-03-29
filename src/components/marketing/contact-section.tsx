'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Mail, MessageCircle, Send, UserRoundPlus } from 'lucide-react';
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
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <SectionHeading
              eyebrow="Contact & teach with us"
              title={
                <>
                  Support for students, parents, <span className="italic grad-text">and faculty.</span>
                </>
              }
              description="Reach out about registrations, technical help, general enquiries, or group bookings. Clinicians and faculty can also contact us about teaching opportunities."
            />
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Reveal>
              <div className="bg-white rounded-3xl p-8 border border-black/[.06] shadow-lg shadow-teal-500/5 h-full">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-6">
                  <Mail className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="font-serif text-2xl text-slate-900 mb-3">
                  Students &amp; Parents
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Email us for webinar registrations, technical support, general
                  questions, or group booking enquiries.
                </p>
                <div className="space-y-3 text-sm text-slate-600">
                  <Link
                    href="mailto:info@meduni.co.uk"
                    className="flex items-center gap-3 hover:text-teal-600 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-teal-600" />
                    info@meduni.co.uk
                  </Link>
                  <Link
                    href="https://wa.me/440000000000"
                    className="flex items-center gap-3 hover:text-teal-600 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-teal-600" />
                    +44 XXXX XXX XXX
                  </Link>
                </div>
              </div>
            </Reveal>
            <Reveal>
              <div className="bg-white rounded-3xl p-8 border border-black/[.06] shadow-lg shadow-teal-500/5 h-full">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-6">
                  <UserRoundPlus className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="font-serif text-2xl text-slate-900 mb-3">
                  Faculty &amp; Consultants
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Interested in teaching with MedUni? Tell us about your
                  clinical expertise, GMC registration, teaching interests, and
                  the topics you would like to deliver.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We offer flexible scheduling, competitive pay, and exposure to
                  an international student audience.
                </p>
              </div>
            </Reveal>
          </div>
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
                  Subject
                </label>
                <select
                  name="subject"
                  disabled={isPending}
                  className={cn(inputClass, fieldErrors?.subject && 'border-red-500/50')}
                  defaultValue="Registration"
                >
                  <option value="Registration">Registration</option>
                  <option value="Technical">Technical</option>
                  <option value="General">General</option>
                  <option value="Group Booking">Group Booking</option>
                  <option value="Faculty / Teach With Us">Faculty / Teach With Us</option>
                </select>
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
                  placeholder="Tell us how we can help. If you are applying to teach, include your CV summary, GMC number, teaching interests, and areas of expertise."
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
                    Send Enquiry
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