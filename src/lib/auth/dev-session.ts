import { cookies } from 'next/headers';

const DEV_SESSION_COOKIE = 'meduni_dev_user';

export type DevUser = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'student' | 'admin';
};

const DEMO_USER: DevUser = {
  id: 'dev-user-id',
  email: 'demo@meduni.com',
  full_name: 'Demo User',
  avatar_url: null,
  role: 'student',
};

const DEMO_ADMIN_USER: DevUser = {
  id: 'dev-admin-id',
  email: 'admin@meduni.com',
  full_name: 'Admin Demo',
  avatar_url: null,
  role: 'admin',
};

export async function getDevUser(): Promise<DevUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(DEV_SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as DevUser;
    return parsed?.id && parsed?.email ? parsed : null;
  } catch {
    return null;
  }
}

export async function setDevUser(email?: string): Promise<void> {
  const cookieStore = await cookies();
  const user =
    email === (process.env.DEMO_ADMIN_EMAIL ?? 'admin@meduni.com')
      ? DEMO_ADMIN_USER
      : DEMO_USER;
  cookieStore.set(DEV_SESSION_COOKIE, encodeURIComponent(JSON.stringify(user)), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function clearDevUser(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(DEV_SESSION_COOKIE);
}

export function isDemoCredentials(email: string, password: string): boolean {
  const demoEmail = process.env.DEMO_EMAIL ?? 'demo@meduni.com';
  const demoPassword = process.env.DEMO_PASSWORD ?? 'demo1234';
  const adminEmail = process.env.DEMO_ADMIN_EMAIL ?? 'admin@meduni.com';
  const adminPassword = process.env.DEMO_ADMIN_PASSWORD ?? 'admin1234';
  return (
    (email === demoEmail && password === demoPassword) ||
    (email === adminEmail && password === adminPassword)
  );
}
