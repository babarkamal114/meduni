import { createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/** Normalize DB role (student | member | admin) to app role (member | admin). Supabase may still use 'student'. */
function normalizeRole(raw: string | null | undefined): 'member' | 'admin' {
  const r = raw?.trim().toLowerCase();
  return r === 'admin' ? 'admin' : 'member';
}

export async function getUser() {
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

  return await getProfileForAuthUser(supabase, user.id, user.email ?? '');
}

async function getProfileForAuthUser(
  supabase: Awaited<ReturnType<typeof createServerClient>>,
  userId: string,
  userEmail: string
) {
  type ProfileRow = { full_name: string | null; avatar_url: string | null; role?: string; email_verified_at?: string | null };
  let profile: ProfileRow | null = null;

  let roleByEmail: 'member' | 'admin' | null = null;

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const admin = createAdminClient();
      const { data: adminRow } = await (admin as any)
        .from('profiles')
        .select('full_name, avatar_url, role, email_verified_at')
        .eq('id', userId)
        .maybeSingle();
      if (adminRow) profile = adminRow as ProfileRow;

      // Fallback: if no profile by id or role missing, fetch by email
      if ((!profile || profile.role == null || profile.role === '') && userEmail) {
        const { data: byEmail } = await (admin as any)
          .from('profiles')
          .select('full_name, avatar_url, role, email_verified_at')
          .eq('email', userEmail)
          .maybeSingle();
        if (byEmail) profile = byEmail as ProfileRow;
      }

      // Always resolve role from by-email row when present: if that row is admin, use admin
      // so "UPDATE profiles SET role = 'admin' WHERE email = '...'" is respected even with duplicate rows
      if (userEmail) {
        const { data: byEmail } = await (admin as any)
          .from('profiles')
          .select('role')
          .eq('email', userEmail)
          .maybeSingle();
        if (byEmail && (byEmail as { role?: string }).role != null) {
          roleByEmail = normalizeRole((byEmail as { role: string }).role);
        }
      }
    } catch {
      // fall through to anon
    }
  }

  if (!profile) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, role, email_verified_at')
      .eq('id', userId)
      .single();
    profile = profileData as ProfileRow | null;
  }

  // Last resort: fetch by email with anon (RLS may allow if same user)
  if (!profile?.role && userEmail) {
    const { data: byEmail } = await supabase
      .from('profiles')
      .select('role')
      .eq('email', userEmail)
      .maybeSingle();
    if (byEmail && (byEmail as { role?: string }).role) {
      profile = profile ?? ({} as ProfileRow);
      profile.role = (byEmail as { role: string }).role;
    }
  }

  const role = roleByEmail === 'admin' ? 'admin' : normalizeRole(profile?.role);

  return {
    id: userId,
    email: userEmail,
    full_name: profile?.full_name ?? null,
    avatar_url: profile?.avatar_url ?? null,
    role,
    email_verified_at: profile?.email_verified_at ?? null,
  };
}

