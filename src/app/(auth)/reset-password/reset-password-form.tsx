'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils/cn';
import { requestPasswordReset } from './actions';

export function ResetPasswordForm(): React.ReactElement {
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await requestPasswordReset(email);
      if (result.success) {
        setMessage({
          type: 'success',
          text: 'If an account exists with that email, you will receive a password reset link shortly.',
        });
      } else {
        setMessage({
          type: 'error',
          text: result.error ?? 'Something went wrong. Please try again.',
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-black/5 bg-white p-6 space-y-5">
      <div>
        <Label htmlFor="email" className="mb-2 block text-xs uppercase tracking-wider text-slate-600">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="h-11 rounded-xl border-slate-200 bg-[#f8f6f1] text-sm focus:border-teal-500 focus:bg-white focus:ring-teal-500/20"
        />
      </div>

      {message && (
        <p className={cn(
          'text-sm rounded-lg p-3',
          message.type === 'success' ? 'text-teal-700 bg-teal-50' : 'text-red-600 bg-red-50'
        )}>
          {message.text}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Sending...' : 'Send Reset Link'}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Remember your password?{' '}
        <Link href="/login" className="text-teal-600 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
