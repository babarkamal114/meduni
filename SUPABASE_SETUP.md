# Supabase Setup Guide for Phase 2: Authentication

This guide will help you set up Supabase for authentication to work.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: `meduni-platform` (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
5. Wait for project to be created (~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 3: Configure Environment Variables

Create/update `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Get from Settings → API → service_role key (keep secret!)
```

## Step 4: Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `supabase/migrations/20250101000000_phase2_auth_setup.sql`
4. Click **Run** (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

## Step 5: Configure Supabase Auth

### Enable Email/Password Authentication

1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (should be by default)
3. Configure email settings:
   - **Enable email confirmations**: Toggle ON for production, OFF for development
   - **Secure email change**: Toggle ON

### Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize templates if needed (or use defaults for now)

### Set Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Add these to **Redirect URLs**:
   ```
   http://localhost:3000/dashboard
   http://localhost:3000/sign-in
   http://localhost:3000/sign-up
   ```
3. For production, add your production domain:
   ```
   https://meduni.co.uk/dashboard
   https://meduni.co.uk/sign-in
   https://meduni.co.uk/sign-up
   ```

## Step 6: Test Authentication

1. Start your dev server: `npm run dev`
2. Go to `http://localhost:3000/sign-up`
3. Create a test account
4. Check Supabase dashboard → **Authentication** → **Users** to see the new user
5. Check **Table Editor** → **profiles** to see the auto-created profile

## Step 7: Create an Admin User (Optional)

To create an admin user, run this in SQL Editor:

```sql
-- Replace 'user-email@example.com' with the email you signed up with
UPDATE profiles
SET role = 'admin'
WHERE email = 'user-email@example.com';
```

## Troubleshooting

### "Profile not created on signup"
- Check if the trigger `on_auth_user_created` exists
- Check if the function `handle_new_user()` exists
- Verify RLS policies allow the trigger to insert

### "Cannot read profile"
- Check RLS policies are enabled
- Verify the user is authenticated
- Check browser console for errors

### "Email confirmation required"
- If you enabled email confirmations, check your email
- Or disable email confirmations in Auth settings for development

### "Redirect URL not allowed"
- Add your redirect URLs in Authentication → URL Configuration

## Next Steps

Once authentication is working:
- ✅ Users can sign up and sign in
- ✅ Profiles are auto-created
- ✅ Dashboard is protected
- ✅ User session persists

You're ready to move to Phase 3!

