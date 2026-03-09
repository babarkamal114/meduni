'use server';

import { createServerClient } from '@/lib/supabase/server';
import { signInSchema } from '@/lib/validations/auth';
import { redirect } from 'next/navigation';
import { isDemoCredentials, setDevUser } from '@/lib/auth/dev-session';

export type LoginResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

function getValidRedirect(formData: FormData): string | null {
  const raw = formData.get('redirect');
  if (typeof raw !== 'string' || !raw.trim()) return null;
  const path = raw.trim();
  if (!path.startsWith('/') || path.includes(':')) return null;
  return path;
}

export async function loginAction(
  formData: FormData
): Promise<LoginResult> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const validation = signInSchema.safeParse(rawData);

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

  const { email, password } = validation.data;

  if (isDemoCredentials(email, password)) {
    await setDevUser(email);
    redirect(redirectTo);
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      success: false,
      error: 'Sign-in is not configured. Use the demo credentials.',
      fieldErrors: undefined,
    };
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message || 'Failed to sign in. Please check your credentials.',
    };
  }

  redirect(redirectTo);
}

