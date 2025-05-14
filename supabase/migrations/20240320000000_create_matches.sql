-- Create matches table
create table matches (
    id uuid default uuid_generate_v4() primary key,
    event_id uuid references events(id) on delete cascade,
    team1 text not null,
    team2 text not null,
    team1_score integer default 0,
    team2_score integer default 0,
    winner text,
    match_number integer not null,
    round text not null,
    status text not null default 'upcoming',
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Add RLS policies
alter table matches enable row level security;

-- Allow admins to do everything
create policy "Admins can do everything"
    on matches
    for all
    using (
        exists (
            select 1 from profiles
            where profiles.user_id = auth.uid()
            and profiles.is_admin = true
        )
    );

-- Allow users to read matches
create policy "Users can read matches"
    on matches
    for select
    to authenticated
    using (true);

-- Add updated_at trigger
create trigger set_updated_at
    before update on matches
    for each row
    execute function set_updated_at(); 