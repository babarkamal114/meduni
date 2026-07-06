'use server';

import { createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { signUpSchema, formatZodFieldErrors } from '@/lib/validations/auth';
import { redirect } from 'next/navigation';
import { randomBytes } from 'crypto';
import { sendEmail } from '@/lib/email/resend';
import { getWelcomeEmailHtml } from '@/lib/email/templates/welcome-email';
import { getVerificationEmailHtml } from '@/lib/email/templates/verification-email';
import type { AuthActionResult } from '@/types/actions';

function getValidRedirect(formData: FormData): string | null {
  const raw = formData.get('redirect');
  if (typeof raw !== 'string' || !raw.trim()) return null;
  const path = raw.trim();
  if (!path.startsWith('/') || path.includes(':')) return null;
  return path;
}

export async function registerAction(
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
    full_name: formData.get('full_name'),
  };

  const validation = signUpSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      error: '',
      fieldErrors: formatZodFieldErrors(validation.error),
    };
  }

  const redirectTo = getValidRedirect(formData) ?? '/dashboard';

  const { email, password, full_name } = validation.data;

  // Sign up with Supabase
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: full_name || undefined,
      },
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message || 'Failed to create account. Please try again.',
    };
  }

  if (data.user) {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const admin = createAdminClient();
      await (admin as any).from('email_verification_tokens').insert({
        user_id: data.user.id,
        token,
        expires_at: expiresAt,
      });

      const verifyUrl = `${appUrl}/api/verify-email?token=${token}`;

      const from = process.env.RESEND_FROM || 'onboarding@resend.dev';
      const welcomeResult = await sendEmail({
        to: email,
        subject: 'Welcome to MedUni',
        html: getWelcomeEmailHtml({ fullName: full_name ?? null, email }),
        from,
      });
      const verifyResult = await sendEmail({
        to: email,
        subject: 'Verify your email – MedUni',
        html: getVerificationEmailHtml({ verifyUrl, fullName: full_name ?? null }),
        from,
      });
      if (!welcomeResult.success || !verifyResult.success) {
        console.error('[register] Signup emails failed:', {
          welcome: welcomeResult.error?.message,
          verify: verifyResult.error?.message,
        });
      }
    } catch (err) {
      console.error('[register] Post-signup processing failed (user was still created):', err);
    }

    redirect('/verify-email');
  }

  return { success: true };
}

