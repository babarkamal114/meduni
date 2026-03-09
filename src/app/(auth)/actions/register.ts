'use server';

import { createServerClient } from '@/lib/supabase/server';
import { signUpSchema, type SignUpInput } from '@/lib/validations/auth';
import { redirect } from 'next/navigation';

export type RegisterResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

function getValidRedirect(formData: FormData): string | null {
  const raw = formData.get('redirect');
  if (typeof raw !== 'string' || !raw.trim()) return null;
  const path = raw.trim();
  if (!path.startsWith('/') || path.includes(':')) return null;
  return path;
}

export async function registerAction(
  formData: FormData
): Promise<RegisterResult> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
    full_name: formData.get('full_name'),
  };

  // Validate input
  const validation = signUpSchema.safeParse(rawData);

  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    validation.error.issues.forEach((error) => {
      const field = error.path[0] as string;
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(error.message);
    });

    return {
      success: false,
      error: 'Validation failed',
      fieldErrors,
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

  // If email confirmation is required, redirect to verification page
  if (data.user && !data.session) {
    redirect('/verify-email');
  }

  // If session exists, redirect to provided path or dashboard
  if (data.session) {
    redirect(redirectTo);
  }

  return { success: true };
}

