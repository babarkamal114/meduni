# Migrate to a new Supabase project

## 1. Create the new project

1. Go to [supabase.com](https://supabase.com) and sign in (or create an account).
2. **New project** → choose org, name, database password, region.
3. Wait until the project is ready.

## 2. Run the migration

1. In the new project: **SQL Editor** → **New query**.
2. Open `supabase/full_migration_new_project.sql` from this repo.
3. Paste the full contents into the editor and click **Run**.
4. Confirm there are no errors.

## 3. Point the app at the new project

1. In Supabase: **Project Settings** → **API**.
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`
3. Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

4. Restart the dev server (`yarn dev` or `npm run dev`).

## 4. (Optional) Create an admin user

To use admin features (e.g. manage webinars), set a user as admin:

1. **Authentication** → **Users** → create a user or use an existing one; note their UUID.
2. **SQL Editor** → run:

```sql
UPDATE profiles SET role = 'admin' WHERE id = 'USER_UUID_HERE';
```

Replace `USER_UUID_HERE` with the user’s id from step 1.

---

**Using Supabase CLI instead of SQL Editor**

If you use the CLI and want to push the same schema via migrations:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Then add seed data by running only the `INSERT INTO webinars ...` part of `full_migration_new_project.sql` in the SQL Editor (or run the seed migration if you use it).
