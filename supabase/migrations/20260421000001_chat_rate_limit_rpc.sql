-- Atomic per-IP daily rate limit for /api/chat.
--
-- Replaces the read-then-write pattern in the application layer (which
-- has a race condition and fails open because the anon key can't write
-- to the RLS-locked chat_rate_limits table) with a single atomic DB
-- call invoked via the service_role key.
--
-- Security posture:
-- - Table chat_rate_limits has RLS enabled with NO public policies.
-- - This function runs as SECURITY DEFINER so it can write through RLS.
-- - Execute is granted ONLY to service_role. Anon and authenticated
--   roles cannot call it, so clients cannot forge IPs or drain other
--   users' quotas.

create or replace function public.chat_rate_limit_hit(
  p_ip text,
  p_daily_limit integer default 10
)
returns table (
  allowed boolean,
  current_count integer,
  remaining integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  insert into public.chat_rate_limits (ip, day, count, updated_at)
  values (p_ip, current_date, 1, now())
  on conflict (ip, day) do update
    set count = public.chat_rate_limits.count + 1,
        updated_at = now()
  returning count into v_count;

  return query select
    (v_count <= p_daily_limit) as allowed,
    v_count as current_count,
    greatest(0, p_daily_limit - v_count) as remaining;
end;
$$;

-- Lock down execution: service_role only.
revoke all on function public.chat_rate_limit_hit(text, integer) from public;
revoke execute on function public.chat_rate_limit_hit(text, integer) from anon, authenticated;
grant execute on function public.chat_rate_limit_hit(text, integer) to service_role;
