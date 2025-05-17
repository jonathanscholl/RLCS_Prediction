-- Create groups table
create table groups (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    join_link text not null unique,
    owner_id uuid references auth.users(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Add RLS policies
alter table groups enable row level security;

-- Allow users to read all groups
create policy "Users can read groups"
    on groups
    for select
    to authenticated
    using (true);

-- Allow users to create groups
create policy "Users can create groups"
    on groups
    for insert
    to authenticated
    with check (auth.uid() = owner_id);

-- Allow group owners to update their groups
create policy "Group owners can update their groups"
    on groups
    for update
    to authenticated
    using (auth.uid() = owner_id)
    with check (auth.uid() = owner_id);

-- Allow group owners to delete their groups
create policy "Group owners can delete their groups"
    on groups
    for delete
    to authenticated
    using (auth.uid() = owner_id);

-- Add updated_at trigger
create trigger set_updated_at
    before update on groups
    for each row
    execute function set_updated_at(); 