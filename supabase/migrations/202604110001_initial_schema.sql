create extension if not exists "pgcrypto";

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  brand text,
  size text,
  condition text check (
    condition in ('Good', 'Very Good', 'Excellent', 'Like New')
  ),
  category text check (
    category in (
      'Tops',
      'Bottoms',
      'Dresses',
      'Outerwear',
      'Shoes',
      'Accessories',
      'Others'
    )
  ),
  cost_price numeric(10, 2) not null check (cost_price >= 0),
  selling_price numeric(10, 2) not null check (selling_price >= 0),
  sale_price numeric(10, 2) check (sale_price >= 0),
  status text not null default 'Available' check (
    status in ('Available', 'Sold', 'Archived')
  ),
  date_sold date,
  notes text,
  photo_url text
);

create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists items_updated_at on public.items;

create trigger items_updated_at
before update on public.items
for each row
execute function public.update_updated_at();

alter table public.items enable row level security;

drop policy if exists "Users own their items" on public.items;

create policy "Users own their items"
on public.items
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('item-photos', 'item-photos', true)
on conflict (id) do nothing;

drop policy if exists "Public can view item photos" on storage.objects;
drop policy if exists "Authenticated users can upload item photos" on storage.objects;
drop policy if exists "Users can update their own item photos" on storage.objects;
drop policy if exists "Users can delete their own item photos" on storage.objects;

create policy "Public can view item photos"
on storage.objects
for select
to public
using (bucket_id = 'item-photos');

create policy "Authenticated users can upload item photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'item-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update their own item photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'item-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'item-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete their own item photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'item-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
