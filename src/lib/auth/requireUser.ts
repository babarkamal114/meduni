import { redirect } from 'next/navigation';
import { getUser } from './getUser';

export async function requireUser() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }

  if (!user.email_verified_at) {
    redirect('/verify-email');
  }

  return user;
}

