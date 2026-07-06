'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { resendVerificationEmail } from '@/app/(auth)/actions/resend-verification';
import { cn } from '@/lib/utils/cn';

export default function VerifyEmailPage(): React.ReactElement {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [cooldown, setCooldown] = useState(false);

  const handleResend = () => {
    if (cooldown) return;
    setMessage(null);
    startTransition(async () => {
      const result = await resendVerificationEmail();
      if (result.success) {
        setMessage({ type: 'success', text: 'Verification email sent! Check your inbox.' });
        setCooldown(true);
        setTimeout(() => setCooldown(false), 60000);
      } else {
        setMessage({ type: 'error', text: result.error ?? 'Failed to resend email.' });
      }
    });
  };

  return (
    <Card className="w-full max-w-md border-0 shadow-xl lg:border">
      <CardHeader className="space-y-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/10 text-teal-600 mx-auto">
          <Mail className="h-8 w-8" />
        </div>
        <CardTitle className="text-2xl font-bold lg:text-3xl">
          Check your email
        </CardTitle>
        <CardDescription className="text-base">
          We&apos;ve sent a verification link to your email address.
          Click the link to verify your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-xl bg-slate-50 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white mt-0.5">1</span>
            <p className="text-sm text-slate-600">Open the email from MedUni in your inbox</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white mt-0.5">2</span>
            <p className="text-sm text-slate-600">Click the &quot;Verify email address&quot; button</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white mt-0.5">3</span>
            <p className="text-sm text-slate-600">Sign in to access your dashboard</p>
          </div>
        </div>

        {message && (
          <div
            role={message.type === 'error' ? 'alert' : 'status'}
            className={cn(
              'flex items-start gap-2 rounded-lg p-3 text-sm',
              message.type === 'success' ? 'bg-teal-50 text-teal-700' : 'bg-red-50 text-red-600',
            )}
          >
            {message.type === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="space-y-3">
          <Button asChild className="w-full gap-2">
            <Link href="/sign-in">
              Go to Sign In
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleResend}
            disabled={isPending || cooldown}
          >
            {isPending ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : cooldown ? (
              'Email sent — check your inbox'
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Resend verification email
              </>
            )}
          </Button>
        </div>

        <p className="text-center text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-teal-600 hover:text-teal-700 font-medium">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
