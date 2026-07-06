import type { Metadata } from 'next';
import { ResetPasswordForm } from './reset-password-form';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your MedUni account password.',
};

export default function ResetPasswordPage(): React.ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f6f1] px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl text-slate-900 mb-2">Reset Password</h1>
          <p className="text-sm text-slate-600">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
