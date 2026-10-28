-- Kıyafet parçaları. Her kullanıcı sadece kendi satırlarını görür (RLS).
create table public.items (
  id text primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  image_path text not null,
  category text not null,
  colors text[] not null default '{}',
  pattern text not null default 'duz' check (pattern in ('duz', 'desenli')),
  formality smallint not null check (formality between 1 and 5),
  seasons text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index items_user_id_idx on public.items (user_id);

alter table public.items enable row level security;

create policy "items: kendi satırlarını okur" on public.items
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "items: kendi adına ekler" on public.items
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "items: kendi satırını günceller" on public.items
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "items: kendi satırını siler" on public.items
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Görseller: özel bucket, yol = <user_id>/<dosya>. Herkes sadece kendi klasörüne erişir.
insert into storage.buckets (id, name, public)
values ('items', 'items', false)
on conflict (id) do nothing;

create policy "items bucket: kendi klasörünü okur" on storage.objects
  for select to authenticated
  using (bucket_id = 'items' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "items bucket: kendi klasörüne yükler" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'items' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "items bucket: kendi dosyasını günceller" on storage.objects
  for update to authenticated
  using (bucket_id = 'items' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "items bucket: kendi dosyasını siler" on storage.objects
  for delete to authenticated
  using (bucket_id = 'items' and (storage.foldername(name))[1] = (select auth.uid())::text);
