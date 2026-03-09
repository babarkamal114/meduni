import { createServerClient } from '@/lib/supabase/server';
import { getDevUser } from './dev-session';

export async function getUser() {
  const devUser = await getDevUser();
  if (devUser) return devUser;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const { data: profileData } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, role')
    .eq('id', user.id)
    .single();

  type ProfileRow = { full_name: string | null; avatar_url: string | null; role?: string };
  const profile = profileData as ProfileRow | null;

  return {
    id: user.id,
    email: user.email ?? '',
    full_name: profile?.full_name ?? null,
    avatar_url: profile?.avatar_url ?? null,
    role: (profile?.role as 'student' | 'admin') ?? 'student',
  };
}

