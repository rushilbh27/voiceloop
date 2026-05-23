-- calls table
create table if not exists public.calls (
  id uuid primary key default gen_random_uuid(),
  call_id text,
  agent_slug text not null,
  agent_id text not null,
  phone_number text not null,
  template_context jsonb not null default '{}',
  status text not null default 'in_progress',
  output jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- index for polling by id (primary key already indexed)
-- index for history page (sort by created_at)
create index if not exists calls_created_at_idx on public.calls (created_at desc);

-- RLS
alter table public.calls enable row level security;

-- Service role has full access (used by API routes)
create policy "service_role_all" on public.calls
  for all
  using (true)
  with check (true);
