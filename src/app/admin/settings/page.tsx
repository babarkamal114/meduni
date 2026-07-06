import { getPricingConfig } from '@/lib/data/settings';
import { PricingSettingsForm } from './pricing-settings-form';

export default async function AdminSettingsPage(): Promise<React.ReactElement> {
  const pricing = await getPricingConfig();

  return (
    <div>
      <h1 className="font-serif text-3xl text-slate-900 mb-1">Settings</h1>
      <p className="text-slate-600 text-sm mb-8">Manage platform pricing and configuration.</p>

      <div className="space-y-8">
        <section>
          <h2 className="font-serif text-xl text-slate-800 mb-4">Pricing Configuration</h2>
          <PricingSettingsForm pricing={pricing} />
        </section>
      </div>
    </div>
  );
}
