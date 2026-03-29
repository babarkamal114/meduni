# Admin role setup

Access to the **Admin** section and the **Admin** tab in the dashboard is controlled by the `role` column on the `profiles` table in Supabase.

- **`admin`** – Can see the Admin tab and use all admin routes.
- **`member`** or **`student`** – Regular user; no Admin tab, cannot open `/admin`. The app treats both `member` and `student` the same (non-admin). If your DB still has `student`, no change is required; you can optionally run the migration below to use `member` instead.

## Create an admin user manually in Supabase

1. **Add the user in Authentication**
   - In [Supabase Dashboard](https://supabase.com/dashboard) → **Authentication** → **Users** → **Add user**.
   - Choose **Create new user**.
   - Enter **Email** and **Password** (the admin will use these to sign in).
   - Click **Create user**. Supabase creates the auth user and (if your trigger is in place) a row in `profiles`.

2. **Set the user’s role to admin**
   - Go to **Table Editor** → **profiles**.
   - Find the row for that user (by the email you used) and set **role** to `admin`, then save.
   - Or run in **SQL Editor** (use the same email as in step 1):
     ```sql
     UPDATE profiles SET role = 'admin' WHERE email = 'admin@yourdomain.com';
     ```

3. **Confirm**
   - Run: `SELECT id, email, role FROM profiles WHERE email = 'admin@yourdomain.com';` and check `role = 'admin'`.
   - The admin user signs in to your app with that email and password; they will see the Admin tab and can access `/admin`.

**Required:** `SUPABASE_SERVICE_ROLE_KEY` must be set in your app’s `.env.local` for the admin role to work. The app uses it to read the profile role correctly. Get it from Supabase → **Project Settings** → **API** → `service_role` (secret). After adding or changing this variable, **restart the dev server** (e.g. stop and run `yarn dev` again).

---

## Change an existing user to admin

### Option 1: Supabase Table Editor

1. Open your project in the [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **Table Editor** → **profiles**.
3. Find the row for the user (by email or name).
4. Set **role** to `admin` and save.

### Option 2: SQL Editor

Run in **SQL Editor** (replace the email with the **exact** email the user signs in with):

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@yourdomain.com';
```

To promote by user id:

```sql
UPDATE profiles
SET role = 'admin'
WHERE id = 'user-uuid-here';
```

**Check that the update worked:**

```sql
SELECT id, email, role FROM profiles WHERE email = 'your@email.com';
```

You should see `role = 'admin'`. The email must match exactly (no extra spaces, same casing as at sign-in).

### After updating

1. **Sign out and sign back in** so the app picks up the new role.
2. Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local` and **restart the dev server**.
3. If you still don’t see the Admin tab, run the one-time check below.

### One-time check: duplicate profiles

If the Admin tab still doesn’t appear after setting `role = 'admin'`, run in Supabase **SQL Editor** (use your email):

```sql
SELECT id, email, role FROM profiles WHERE email = 'your@email.com';
```

- You should see `role = 'admin'` for the row whose `id` matches your auth user (Authentication → Users → your user → copy the UUID). If you see **multiple rows** with the same email, update the row that has the same `id` as your auth user: `UPDATE profiles SET role = 'admin' WHERE id = 'your-auth-user-uuid';` or merge/remove duplicates so one profile exists per user.

### Optional: align DB to use `member` instead of `student`

If your `profiles` table still has `role` values as `student` (and CHECK allows only `student` | `admin`), the app already treats `student` as non-admin. To align the DB with `member` | `admin`, run in SQL Editor (or use the migration `supabase/migrations/20250610000000_profiles_role_member_admin.sql`):

```sql
UPDATE profiles SET role = 'member' WHERE role = 'student';
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('member', 'admin'));
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'member';
```
