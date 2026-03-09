'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils/cn';

interface SettingsFormProps {
  user: {
    full_name: string | null;
    email: string;
  };
}

export function SettingsForm({ user }: SettingsFormProps): React.ReactElement {
  const [name, setName] = useState(user.full_name ?? '');
  const [email, setEmail] = useState(user.email ?? '');
  const [notifications, setNotifications] = useState(true);

  const initials = user.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email[0]?.toUpperCase() ?? 'U';

  return (
    <div className="max-w-2xl space-y-6 rounded-2xl border border-black/5 bg-white p-6">
      <div className="flex items-center gap-5 border-b border-black/5 pb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-xl font-bold text-white">
          {initials}
        </div>
        <div>
          <h3 className="font-serif text-xl text-slate-800">{name || 'User'}</h3>
          <p className="text-sm text-slate-600">
            Medical Student · Joined Oct 2024
          </p>
        </div>
        <Button variant="outline" size="sm" className="ml-auto text-xs">
          Edit Profile
        </Button>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl border-slate-200 bg-[#f8f6f1] text-sm focus:border-teal-500 focus:bg-white focus:ring-teal-500/20"
          />
        </div>
      </div>
      <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-700">
            Email Notifications
          </h4>
          <p className="text-xs text-slate-600">
            Receive updates about webinars and new content
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={notifications}
          onClick={() => setNotifications(!notifications)}
          className={cn(
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-0 transition-colors',
            notifications ? 'bg-teal-500' : 'bg-slate-200'
          )}
        >
          <span
            className={cn(
              'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition',
              notifications ? 'translate-x-5' : 'translate-x-0.5'
            )}
            style={{ marginTop: 2 }}
          />
        </button>
      </div>
      <Button>Save Changes</Button>
    </div>
  );
}
