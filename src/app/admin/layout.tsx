import { requireAdmin } from '@/lib/auth/requireAdmin';
import { AdminSidebar } from '@/components/layout/admin-sidebar';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<React.ReactElement> {
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-[#f8f6f1]">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-h-screen ml-[260px]">
        <div className="flex-1 p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
