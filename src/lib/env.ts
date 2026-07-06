const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

const OPTIONAL_ENV_VARS = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'RESEND_API_KEY',
  'EMAIL_UNSUBSCRIBE_SECRET',
  'OPENAI_API_KEY',
  'ZOOM_ACCOUNT_ID',
  'ZOOM_CLIENT_ID',
  'ZOOM_CLIENT_SECRET',
] as const;

export function validateEnv(): void {
  const missing: string[] = [];

  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]?.trim()) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join('\n')}\n\nAdd them to .env.local or your deployment environment.`
    );
  }

  if (process.env.NODE_ENV === 'development') {
    const unset: string[] = [];
    for (const key of OPTIONAL_ENV_VARS) {
      if (!process.env[key]?.trim()) {
        unset.push(key);
      }
    }
    if (unset.length > 0) {
      console.warn(
        `[env] Optional env vars not set (some features may be disabled): ${unset.join(', ')}`
      );
    }
  }
}
