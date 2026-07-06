ALTER TABLE webinar_registrations
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;
