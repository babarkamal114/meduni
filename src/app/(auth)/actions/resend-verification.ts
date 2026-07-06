'use server';

import { createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { randomBytes } from 'crypto';
import { sendEmail } from '@/lib/email/resend';
import { getVerificationEmailHtml } from '@/lib/email/templates/verification-email';

export async function resendVerificationEmail(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'You need to be signed in. Please sign up or log in first.' };
    }

    const admin = createAdminClient();

    const { data: profile } = await (admin as any)
      .from('profiles')
      .select('email_verified_at, full_name')
      .eq('id', user.id)
      .maybeSingle() as { data: { email_verified_at: string | null; full_name: string | null } | null };

    if (profile?.email_verified_at) {
      return { success: false, error: 'Your email is already verified. You can sign in.' };
    }

    await (admin as any)
      .from('email_verification_tokens')
      .delete()
      .eq('user_id', user.id);

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await (admin as any).from('email_verification_tokens').insert({
      user_id: user.id,
      token,
      expires_at: expiresAt,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verifyUrl = `${appUrl}/api/verify-email?token=${token}`;
    const from = process.env.RESEND_FROM || 'onboarding@resend.dev';

    const { success, error } = await sendEmail({
      to: user.email!,
      subject: 'Verify your email – MedUni',
      html: getVerificationEmailHtml({
        verifyUrl,
        fullName: profile?.full_name ?? null,
      }),
      from,
    });

    if (!success) {
      console.error('[resend-verification] Email send failed:', error?.message);
      return { success: false, error: 'Failed to send email. Please try again in a moment.' };
    }

    return { success: true };
  } catch (err) {
    console.error('[resend-verification] Error:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
