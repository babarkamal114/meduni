import { createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export interface PricingConfig {
  min_price: number;
  max_price: number;
  default_price: number;
  display_text: string;
  description: string;
}

const PRICING_DEFAULTS: PricingConfig = {
  min_price: 3,
  max_price: 49,
  default_price: 3,
  display_text: 'From £3',
  description: 'Pay per webinar. Affordable sessions from just £3. No subscriptions.',
};

export async function getSiteSetting<T = unknown>(key: string): Promise<T | null> {
  const supabase = await createServerClient();
  const { data, error } = await (supabase as any)
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error || !data) return null;
  return data.value as T;
}

export async function updateSiteSetting(
  key: string,
  value: unknown
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient();
  const { error } = await (supabase as any)
    .from('site_settings')
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getPricingConfig(): Promise<PricingConfig> {
  const config = await getSiteSetting<PricingConfig>('pricing');
  return config ?? PRICING_DEFAULTS;
}
