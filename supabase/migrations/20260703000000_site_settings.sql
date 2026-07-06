create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

alter table public.site_settings enable row level security;

create policy "Public read" on public.site_settings
  for select using (true);

create policy "Admin write" on public.site_settings
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

insert into public.site_settings (key, value) values
  ('pricing', '{"min_price": 3, "max_price": 49, "default_price": 3, "display_text": "From £3", "description": "Pay per webinar. Affordable sessions from just £3. No subscriptions."}'::jsonb)
on conflict (key) do nothing;
