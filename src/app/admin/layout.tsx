import { requireAdmin } from '@/lib/auth/requireAdmin';
import { AdminShell } from '@/components/layout/admin-shell';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<React.ReactElement> {
  await requireAdmin();

  return <AdminShell>{children}</AdminShell>;
}
