create extension if not exists "pgcrypto";

create table public.channels (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  color text not null default '#d95a1f',
  created_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  channel_id uuid not null references public.channels(id),
  location text,
  start_date date not null,
  end_date date not null,
  setup_datetime timestamptz,
  teardown_datetime timestamptz,
  booth_size text,
  booth_zone text,
  details text,
  contact_name text,
  contact_phone text,
  conditions text,
  participation_status text not null default 'pending'
    check (participation_status in ('joining', 'not_joining', 'pending')),
  sales_staff_required boolean not null default false,
  sales_target numeric(12, 2),
  actual_sales numeric(12, 2),
  notes text,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_files (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  category text not null default 'document',
  file_name text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid references auth.users(id),
  uploaded_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-files',
  'event-files',
  false,
  52428800,
  array[
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
on conflict (id) do nothing;

create index events_date_idx on public.events(start_date, end_date);
create index events_channel_idx on public.events(channel_id);
create index event_files_event_idx on public.event_files(event_id);

alter table public.channels enable row level security;
alter table public.events enable row level security;
alter table public.event_files enable row level security;

create policy "authenticated read channels"
  on public.channels for select
  to authenticated
  using (true);

create policy "authenticated write channels"
  on public.channels for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated read events"
  on public.events for select
  to authenticated
  using (true);

create policy "authenticated write events"
  on public.events for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated read files"
  on public.event_files for select
  to authenticated
  using (true);

create policy "authenticated write files"
  on public.event_files for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated read event storage"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'event-files');

create policy "authenticated upload event storage"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'event-files');

create policy "authenticated update event storage"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'event-files')
  with check (bucket_id = 'event-files');

create policy "authenticated delete event storage"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'event-files');

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();
