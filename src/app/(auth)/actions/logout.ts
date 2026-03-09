'use server';

import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { clearDevUser } from '@/lib/auth/dev-session';

export async function logoutAction(): Promise<void> {
  await clearDevUser();
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createServerClient();
    await supabase.auth.signOut();
  }
  redirect('/sign-in');
}

