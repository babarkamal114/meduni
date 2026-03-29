'use server';

import { createServerClient } from '@/lib/supabase/server';
import { signInSchema, formatZodFieldErrors } from '@/lib/validations/auth';
import { redirect } from 'next/navigation';
import type { AuthActionResult } from '@/types/actions';

function getValidRedirect(formData: FormData): string | null {
  const raw = formData.get('redirect');
  if (typeof raw !== 'string' || !raw.trim()) return null;
  const path = raw.trim();
  if (!path.startsWith('/') || path.includes(':')) return null;
  return path;
}

export async function loginAction(
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const validation = signInSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      error: '',
      fieldErrors: formatZodFieldErrors(validation.error),
    };
  }

  const redirectTo = getValidRedirect(formData) ?? '/dashboard';

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      success: false,
      error: 'Sign-in is not configured.',
      fieldErrors: undefined,
    };
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword(validation.data);

  if (error) {
    return {
      success: false,
      error: error.message || 'Failed to sign in. Please check your credentials.',
      fieldErrors: undefined,
    };
  }

  redirect(redirectTo);
}

