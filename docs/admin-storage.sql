-- Portfolio admin: photo storage. Run once in Supabase: SQL Editor → New query → paste → Run.
-- (Needs docs/admin-setup.sql to have been run first.) Safe to run again.
--
-- A public "portfolio" bucket for your photo and resume PDF: anyone can view them (they're on your website),
-- only the admin account can upload, replace or delete them.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 5242880, array['image/webp', 'image/jpeg', 'image/png', 'application/pdf'])
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
