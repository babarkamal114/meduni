import { redirect } from 'next/navigation';
import { getUser } from './getUser';

export async function requireUser() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }

  return user;
}

