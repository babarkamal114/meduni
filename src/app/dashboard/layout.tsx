import { requireUser } from '@/lib/auth/requireUser';
import { getUser } from '@/lib/auth/getUser';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<React.ReactElement> {
  await requireUser();
  const user = await getUser();

  return (
    <>
      <DashboardShell user={user}>{children}</DashboardShell>
      <ChatbotWidget />
    </>
  );
}
