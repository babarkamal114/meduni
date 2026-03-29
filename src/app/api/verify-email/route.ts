import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = request.nextUrl.searchParams.get('token');

  if (!token?.trim()) {
    return NextResponse.redirect(
      new URL('/sign-in?error=missing_token', request.url)
    );
  }

  const admin = createAdminClient();

  const { data, error: fetchError } = await (admin as any)
    .from('email_verification_tokens')
    .select('id, user_id')
    .eq('token', token.trim())
    .gt('expires_at', new Date().toISOString())
    .single();

  const row = data as { id: string; user_id: string } | null;

  if (fetchError || !row) {
    return NextResponse.redirect(
      new URL('/sign-in?error=invalid_or_expired', request.url)
    );
  }

  const { error: updateAuthError } = await admin.auth.admin.updateUserById(
    row.user_id,
    { email_confirm: true }
  );

  if (updateAuthError) {
    return NextResponse.redirect(
      new URL('/sign-in?error=verification_failed', request.url)
    );
  }

  await (admin as any).from('profiles')
    .update({ email_verified_at: new Date().toISOString() })
    .eq('id', row.user_id);

  await (admin as any).from('email_verification_tokens').delete().eq('id', row.id);

  return NextResponse.redirect(
    new URL('/sign-in?verified=1', request.url)
  );
}
