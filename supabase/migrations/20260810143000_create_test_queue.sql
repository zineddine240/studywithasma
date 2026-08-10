-- Create test_documents storage bucket
insert into storage.buckets (id, name, public)
values ('test_documents', 'test_documents', false)
on conflict (id) do nothing;

-- Set up RLS for test_documents bucket
create policy "Admin and teachers can upload documents"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'test_documents' AND
    exists (
      select 1 from public.profiles
      where id = auth.uid() and (role = 'admin' or role = 'teacher')
    )
  );

create policy "Admin and teachers can view documents"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'test_documents' AND
    exists (
      select 1 from public.profiles
      where id = auth.uid() and (role = 'admin' or role = 'teacher')
    )
  );

create policy "Admin and teachers can update documents"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'test_documents' AND
    exists (
      select 1 from public.profiles
      where id = auth.uid() and (role = 'admin' or role = 'teacher')
    )
  );

create policy "Admin and teachers can delete documents"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'test_documents' AND
    exists (
      select 1 from public.profiles
      where id = auth.uid() and (role = 'admin' or role = 'teacher')
    )
  );

-- Create test_queue table
create table public.test_queue (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_by uuid references auth.users not null,
    original_filename text not null,
    file_path text not null,
    type text not null default 'reading',
    status text not null default 'pending', -- pending, processing, completed, failed
    error text
);

-- RLS for test_queue
alter table public.test_queue enable row level security;

create policy "Admins and teachers can manage test_queue"
    on public.test_queue
    for all
    to authenticated
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and (role = 'admin' or role = 'teacher')
        )
    )
    with check (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and (role = 'admin' or role = 'teacher')
        )
    );
