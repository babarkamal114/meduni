import { createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { EmailPreferencesRow } from '@/types/database';

export async function getEmailPreferences(userId: string): Promise<EmailPreferencesRow | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('email_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as EmailPreferencesRow;
}

export async function updateEmailPreferences(
  userId: string,
  prefs: { marketing_emails?: boolean; purchase_emails?: boolean },
): Promise<{ error: string | null }> {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from('email_preferences')
    .upsert({
      user_id: userId,
      ...prefs,
      updated_at: new Date().toISOString(),
    } as never);
  return { error: error?.message ?? null };
}

export async function setMarketingOptOut(userId: string): Promise<{ error: string | null }> {
  const admin = createAdminClient();
  const { error } = await admin
    .from('email_preferences')
    .upsert({
      user_id: userId,
      marketing_emails: false,
      updated_at: new Date().toISOString(),
    } as never);
  return { error: error?.message ?? null };
}

export interface MarketingRecipient {
  userId: string;
  email: string;
  fullName: string | null;
}

export async function getMarketingOptedInUsers(): Promise<MarketingRecipient[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('email_preferences')
    .select('user_id')
    .eq('marketing_emails', true);

  if (error || !data?.length) return [];

  const userIds = (data as { user_id: string }[]).map((r) => r.user_id);

  const { data: profiles, error: profileError } = await admin
    .from('profiles')
    .select('id, email, full_name')
    .in('id', userIds);

  if (profileError || !profiles?.length) return [];

  return (profiles as { id: string; email: string; full_name: string | null }[]).map((p) => ({
    userId: p.id,
    email: p.email,
    fullName: p.full_name,
  }));
}
