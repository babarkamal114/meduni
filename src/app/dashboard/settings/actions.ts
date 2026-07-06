'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth/getUser';
import { updateEmailPreferences as updatePrefsDb } from '@/lib/data/email-preferences';

const updateProfileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

export async function updateProfile(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const user = await getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const result = updateProfileSchema.safeParse({
    full_name: formData.get('full_name'),
  });

  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Invalid input' };
  }

  const supabase = await createServerClient();
  const { error } = await (supabase as any)
    .from('profiles')
    .update({ full_name: result.data.full_name, updated_at: new Date().toISOString() })
    .eq('id', user.id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateEmailPreferences(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const user = await getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const marketingEmails = formData.get('marketing_emails') === 'on';
  const purchaseEmails = formData.get('purchase_emails') === 'on';

  const { error } = await updatePrefsDb(user.id, {
    marketing_emails: marketingEmails,
    purchase_emails: purchaseEmails,
  });

  if (error) return { success: false, error };
  return { success: true };
}
