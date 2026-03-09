import { getUser } from '@/lib/auth/getUser';
import { SettingsForm } from '@/components/dashboard/settings-form';

export default async function DashboardSettingsPage(): Promise<React.ReactElement> {
  const user = await getUser();
  if (!user) {
    return <div />;
  }
  return (
    <div className="px-6 lg:px-8 py-8 max-w-[1400px]">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-slate-900 mb-1">Settings</h1>
        <p className="text-slate-600 text-sm">
          Manage your account, preferences, and subscriptions
        </p>
      </div>
      <SettingsForm user={{ full_name: user.full_name, email: user.email }} />
    </div>
  );
}
