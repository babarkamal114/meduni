import { redirect } from 'next/navigation';
import { getUser } from './getUser';

export async function requireAdmin() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }

  if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  return user;
}
