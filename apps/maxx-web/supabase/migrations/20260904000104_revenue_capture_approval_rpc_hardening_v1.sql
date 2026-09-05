-- The legacy maxx_action_proposals table intentionally exposes only SELECT via RLS.
-- Revenue Capture mutation RPCs therefore run as SECURITY DEFINER, but each function
-- performs explicit auth/membership/role/expiry/hash checks and has a fixed search_path.

alter function public.maxx_revenue_create_action_proposal(uuid,text,jsonb,text,text,timestamptz) security definer;
alter function public.maxx_revenue_decide_action_proposal(uuid,text) security definer;
alter function public.maxx_revenue_claim_approved_action(uuid) security definer;
alter function public.maxx_revenue_finish_action(uuid,text,jsonb) security definer;

revoke all on function public.maxx_revenue_create_action_proposal(uuid,text,jsonb,text,text,timestamptz) from public, anon;
revoke all on function public.maxx_revenue_decide_action_proposal(uuid,text) from public, anon;
revoke all on function public.maxx_revenue_claim_approved_action(uuid) from public, anon;
revoke all on function public.maxx_revenue_finish_action(uuid,text,jsonb) from public, anon;

grant execute on function public.maxx_revenue_create_action_proposal(uuid,text,jsonb,text,text,timestamptz) to authenticated;
grant execute on function public.maxx_revenue_decide_action_proposal(uuid,text) to authenticated;
grant execute on function public.maxx_revenue_claim_approved_action(uuid) to authenticated;
grant execute on function public.maxx_revenue_finish_action(uuid,text,jsonb) to authenticated;
