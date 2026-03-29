# Use only Resend for signup emails (disable Supabase confirmation)

**Confirm email must be OFF** in Supabase so that no Supabase auth emails are sent; only Resend sends signup and verification emails.

MedUni sends **welcome** and **verification** emails via Resend. To avoid receiving Supabase’s default “Confirm sign up” email and use only these custom templates:

1. Open [Supabase Dashboard](https://supabase.com/dashboard) and select your project.
2. Go to **Authentication** → **Providers** → **Email**.
3. Turn **OFF** the option **“Confirm email”** (or “Enable email confirmations”).
4. Save.

After this, Supabase will no longer send its own confirmation email. New signups will only receive the two Resend emails (welcome + verification with magic link).

## Resend configuration

- **RESEND_API_KEY** (required): Your API key from [Resend](https://resend.com).
- **RESEND_FROM** (optional): Sender address.
  - **You cannot use Gmail, Yahoo, Outlook, etc.** Resend only allows sending from domains you verify at [resend.com/domains](https://resend.com/domains). Using a personal address (e.g. `you@gmail.com`) causes a **403 – domain not verified** error.
  - For **development/testing**: leave `RESEND_FROM` unset. The app uses `onboarding@resend.dev` (Resend’s test sender), which works without verifying a domain.
  - For **production**: add and verify your domain in Resend, then set `RESEND_FROM` to an address on that domain (e.g. `noreply@yourdomain.com`).

If emails still don’t arrive, check the server logs for `[Resend]` messages (send success/failure and errors).
