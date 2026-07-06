'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils/cn';
import { updateProfile, updateEmailPreferences } from '@/app/dashboard/settings/actions';

interface SettingsFormProps {
  user: {
    full_name: string | null;
    email: string;
  };
  emailPreferences?: {
    marketing_emails: boolean;
    purchase_emails: boolean;
  } | null;
}

export function SettingsForm({ user, emailPreferences }: SettingsFormProps): React.ReactElement {
  const [name, setName] = useState(user.full_name ?? '');
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [marketing, setMarketing] = useState(emailPreferences?.marketing_emails ?? true);
  const [purchase, setPurchase] = useState(emailPreferences?.purchase_emails ?? true);
  const [prefsPending, startPrefsTransition] = useTransition();
  const [prefsMessage, setPrefsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const initials = user.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email[0]?.toUpperCase() ?? 'U';

  const handleSave = () => {
    setMessage(null);
    const formData = new FormData();
    formData.set('full_name', name);
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully.' });
      } else {
        setMessage({ type: 'error', text: result.error ?? 'Failed to update profile.' });
      }
    });
  };

  const handleSavePrefs = () => {
    setPrefsMessage(null);
    const formData = new FormData();
    if (marketing) formData.set('marketing_emails', 'on');
    if (purchase) formData.set('purchase_emails', 'on');
    startPrefsTransition(async () => {
      const result = await updateEmailPreferences(formData);
      if (result.success) {
        setPrefsMessage({ type: 'success', text: 'Email preferences updated.' });
      } else {
        setPrefsMessage({ type: 'error', text: result.error ?? 'Failed to update preferences.' });
      }
    });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-2xl border border-black/5 bg-white p-6 space-y-6">
        <div className="flex items-center gap-5 border-b border-black/5 pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-xl font-bold text-white">
            {initials}
          </div>
          <div>
            <h3 className="font-serif text-xl text-slate-800">{name || 'User'}</h3>
            <p className="text-sm text-slate-600">{user.email}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block text-xs uppercase tracking-wider text-slate-600">
              Full Name
            </Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl border-slate-200 bg-[#f8f6f1] text-sm focus:border-teal-500 focus:bg-white focus:ring-teal-500/20"
            />
          </div>
          <div>
            <Label className="mb-2 block text-xs uppercase tracking-wider text-slate-600">
              Email
            </Label>
            <Input
              type="email"
              value={user.email}
              disabled
              className="h-11 rounded-xl border-slate-200 bg-[#f8f6f1] text-sm opacity-60 cursor-not-allowed"
            />
          </div>
        </div>
        {message && (
          <p
            role={message.type === 'error' ? 'alert' : 'status'}
            className={cn(
              'text-sm rounded-lg p-3',
              message.type === 'success' ? 'text-teal-700 bg-teal-50' : 'text-red-600 bg-red-50'
            )}
          >
            {message.text}
          </p>
        )}
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-6 space-y-5">
        <div>
          <h3 className="font-serif text-lg text-slate-800 mb-1">Email Preferences</h3>
          <p className="text-sm text-slate-500">Choose which emails you would like to receive.</p>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between gap-4 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-slate-700">Marketing emails</p>
              <p className="text-xs text-slate-500">Notifications about new webinars, modules, and content</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={marketing}
              onClick={() => setMarketing(!marketing)}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors',
                marketing ? 'bg-teal-600' : 'bg-slate-200',
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                  marketing ? 'translate-x-5' : 'translate-x-0',
                )}
              />
            </button>
          </label>
          <label className="flex items-center justify-between gap-4 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-slate-700">Purchase confirmations</p>
              <p className="text-xs text-slate-500">Booking confirmations and invoices when you buy a ticket</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={purchase}
              onClick={() => setPurchase(!purchase)}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors',
                purchase ? 'bg-teal-600' : 'bg-slate-200',
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                  purchase ? 'translate-x-5' : 'translate-x-0',
                )}
              />
            </button>
          </label>
        </div>
        {prefsMessage && (
          <p
            role={prefsMessage.type === 'error' ? 'alert' : 'status'}
            className={cn(
              'text-sm rounded-lg p-3',
              prefsMessage.type === 'success' ? 'text-teal-700 bg-teal-50' : 'text-red-600 bg-red-50'
            )}
          >
            {prefsMessage.text}
          </p>
        )}
        <Button onClick={handleSavePrefs} disabled={prefsPending} variant="outline">
          {prefsPending ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
}
