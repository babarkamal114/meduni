'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils/cn';
import { updatePricingSettings } from './actions';
import type { PricingConfig } from '@/lib/data/settings';

interface PricingSettingsFormProps {
  pricing: PricingConfig;
}

export function PricingSettingsForm({ pricing }: PricingSettingsFormProps): React.ReactElement {
  const [minPrice, setMinPrice] = useState(pricing.min_price.toString());
  const [maxPrice, setMaxPrice] = useState(pricing.max_price.toString());
  const [defaultPrice, setDefaultPrice] = useState(pricing.default_price.toString());
  const [displayText, setDisplayText] = useState(pricing.display_text);
  const [description, setDescription] = useState(pricing.description);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData();
    formData.set('min_price', minPrice);
    formData.set('max_price', maxPrice);
    formData.set('default_price', defaultPrice);
    formData.set('display_text', displayText);
    formData.set('description', description);

    startTransition(async () => {
      const result = await updatePricingSettings(formData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Pricing settings updated successfully.' });
      } else {
        setMessage({ type: 'error', text: result.error ?? 'Failed to update settings.' });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl rounded-2xl border border-black/5 bg-white p-6 space-y-5">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="min_price" className="mb-2 block text-xs uppercase tracking-wider text-slate-600">
            Min Price (£)
          </Label>
          <Input
            id="min_price"
            type="number"
            min="1"
            step="1"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-11 rounded-xl border-slate-200 bg-[#f8f6f1] text-sm focus:border-teal-500 focus:bg-white focus:ring-teal-500/20"
          />
        </div>
        <div>
          <Label htmlFor="max_price" className="mb-2 block text-xs uppercase tracking-wider text-slate-600">
            Max Price (£)
          </Label>
          <Input
            id="max_price"
            type="number"
            min="1"
            step="1"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-11 rounded-xl border-slate-200 bg-[#f8f6f1] text-sm focus:border-teal-500 focus:bg-white focus:ring-teal-500/20"
          />
        </div>
        <div>
          <Label htmlFor="default_price" className="mb-2 block text-xs uppercase tracking-wider text-slate-600">
            Default Price (£)
          </Label>
          <Input
            id="default_price"
            type="number"
            min="1"
            step="1"
            value={defaultPrice}
            onChange={(e) => setDefaultPrice(e.target.value)}
            className="h-11 rounded-xl border-slate-200 bg-[#f8f6f1] text-sm focus:border-teal-500 focus:bg-white focus:ring-teal-500/20"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="display_text" className="mb-2 block text-xs uppercase tracking-wider text-slate-600">
          Display Text (shown on marketing pages)
        </Label>
        <Input
          id="display_text"
          type="text"
          value={displayText}
          onChange={(e) => setDisplayText(e.target.value)}
          placeholder="From £3"
          className="h-11 rounded-xl border-slate-200 bg-[#f8f6f1] text-sm focus:border-teal-500 focus:bg-white focus:ring-teal-500/20"
        />
      </div>
      <div>
        <Label htmlFor="description" className="mb-2 block text-xs uppercase tracking-wider text-slate-600">
          Pricing Description
        </Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-slate-200 bg-[#f8f6f1] px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:ring-teal-500/20 focus:outline-none"
        />
      </div>

      {message && (
        <p className={cn(
          'text-sm rounded-lg p-3',
          message.type === 'success' ? 'text-teal-700 bg-teal-50' : 'text-red-600 bg-red-50'
        )}>
          {message.text}
        </p>
      )}
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Pricing'}
      </Button>
    </form>
  );
}
