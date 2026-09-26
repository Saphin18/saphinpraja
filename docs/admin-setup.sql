-- Portfolio admin: one-time database setup.
-- Run this once in your personal Supabase project: SQL Editor → New query → paste → Run.
-- Safe to run again; it only creates what's missing and refreshes the rules.
--
-- Only the account with ADMIN_EMAIL below can change content or read messages.
-- Visitors can read the portfolio text and send contact messages, nothing else.

-- ---------- who is the admin ----------
create or replace function public.is_portfolio_admin() returns boolean
language sql stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'prajasaphin18@gmail.com'  -- ADMIN_EMAIL
$$;

-- ---------- portfolio text ----------
create table if not exists public.site_content (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Every save keeps the previous version here (latest 30), so a mistake can be undone.
create table if not exists public.site_content_history (
  id bigint generated always as identity primary key,
  content_id text not null,
  data jsonb not null,
  saved_at timestamptz not null
);

create or replace function public.keep_content_history() returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  new.updated_at := now();
  insert into public.site_content_history (content_id, data, saved_at)
  values (old.id, old.data, old.updated_at);
  delete from public.site_content_history
  where content_id = old.id
    and id not in (
      select id from public.site_content_history
      where content_id = old.id order by id desc limit 30
    );
  return new;
end
$$;

drop trigger if exists site_content_history_trigger on public.site_content;
create trigger site_content_history_trigger
  before update on public.site_content
  for each row execute function public.keep_content_history();

-- ---------- contact form inbox ----------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) <= 100),
  email text not null check (char_length(email) <= 255),
  message text not null check (char_length(message) <= 2000),
  source text not null default 'portfolio' check (source in ('portfolio', 'services')),
  is_read boolean not null default false
);

-- ---------- security rules ----------
alter table public.site_content enable row level security;
alter table public.site_content_history enable row level security;
alter table public.contact_messages enable row level security;

grant select on public.site_content to anon, authenticated;
grant insert, update on public.site_content to authenticated;
grant select on public.site_content_history to authenticated;
grant insert on public.contact_messages to anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;

drop policy if exists "Anyone can read portfolio text" on public.site_content;
create policy "Anyone can read portfolio text" on public.site_content
  for select to anon, authenticated using (true);

drop policy if exists "Admin can add portfolio text" on public.site_content;
create policy "Admin can add portfolio text" on public.site_content
  for insert to authenticated with check (public.is_portfolio_admin());

drop policy if exists "Admin can change portfolio text" on public.site_content;
create policy "Admin can change portfolio text" on public.site_content
  for update to authenticated
  using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

drop policy if exists "Admin can read history" on public.site_content_history;
create policy "Admin can read history" on public.site_content_history
  for select to authenticated using (public.is_portfolio_admin());

drop policy if exists "Visitors can send messages" on public.contact_messages;
create policy "Visitors can send messages" on public.contact_messages
  for insert to anon, authenticated with check (is_read = false);

drop policy if exists "Admin can read messages" on public.contact_messages;
create policy "Admin can read messages" on public.contact_messages
  for select to authenticated using (public.is_portfolio_admin());

drop policy if exists "Admin can mark messages" on public.contact_messages;
create policy "Admin can mark messages" on public.contact_messages
  for update to authenticated
  using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

drop policy if exists "Admin can delete messages" on public.contact_messages;
create policy "Admin can delete messages" on public.contact_messages
  for delete to authenticated using (public.is_portfolio_admin());

-- ---------- photo storage ----------
-- Also in docs/admin-storage.sql for projects set up before photos were added.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admin can upload portfolio images" on storage.objects;
create policy "Admin can upload portfolio images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio' and public.is_portfolio_admin());

drop policy if exists "Admin can replace portfolio images" on storage.objects;
create policy "Admin can replace portfolio images" on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio' and public.is_portfolio_admin())
  with check (bucket_id = 'portfolio' and public.is_portfolio_admin());

drop policy if exists "Admin can delete portfolio images" on storage.objects;
create policy "Admin can delete portfolio images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio' and public.is_portfolio_admin());
