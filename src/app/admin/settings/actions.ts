'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { updateSiteSetting } from '@/lib/data/settings';

const pricingSchema = z.object({
  min_price: z.number().min(1, 'Minimum price must be at least £1'),
  max_price: z.number().min(1, 'Maximum price must be at least £1'),
  default_price: z.number().min(1, 'Default price must be at least £1'),
  display_text: z.string().min(1, 'Display text is required'),
  description: z.string().min(1, 'Description is required'),
}).refine((data) => data.max_price >= data.min_price, {
  message: 'Maximum price must be greater than or equal to minimum price',
  path: ['max_price'],
});

export async function updatePricingSettings(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const result = pricingSchema.safeParse({
    min_price: Number(formData.get('min_price')),
    max_price: Number(formData.get('max_price')),
    default_price: Number(formData.get('default_price')),
    display_text: formData.get('display_text') as string,
    description: formData.get('description') as string,
  });

  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Invalid input' };
  }

  const updateResult = await updateSiteSetting('pricing', result.data);
  if (updateResult.success) {
    revalidatePath('/');
    revalidatePath('/pricing');
    revalidatePath('/how-we-teach');
  }
  return updateResult;
}
