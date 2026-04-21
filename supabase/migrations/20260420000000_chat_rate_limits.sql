-- Ask AiCensus chat rate-limit table
-- Tracks per-IP daily request counts for the /api/chat endpoint.
-- The chat route is designed to fail open if this table is missing, so
-- the feature keeps working pre-migration (with no rate limit applied).

create table if not exists public.chat_rate_limits (
  ip text not null,
  day date not null,
  count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (ip, day)
);

-- Row-level security: only the service role / server may read or write.
alter table public.chat_rate_limits enable row level security;

-- No policies are added for anon or authenticated; the chat route uses the
-- anon key via a server handler, but the table is intended to be updated
-- through a future server-side path. If you want to let the anon key
-- upsert counters, uncomment the policy below.
--
-- create policy "Anon can upsert own IP counter"
--   on public.chat_rate_limits
--   for all
--   to anon
--   using (true)
--   with check (true);

-- Helpful index for periodic cleanup of old rows.
create index if not exists chat_rate_limits_day_idx
  on public.chat_rate_limits (day);

-- Optional helper: prune rows older than 30 days. Call from a cron job or
-- run manually: select public.prune_chat_rate_limits();
create or replace function public.prune_chat_rate_limits()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.chat_rate_limits where day < (current_date - interval '30 days');
$$;
