-- Complete the service-role-only recovery claim boundary.
grant select,insert,update,delete on public.maxx_missed_call_recovery_claims to service_role;
create or replace function public.maxx_revenue_claim_missed_call_recovery(
  p_organization_id uuid,p_call_sid text,p_from text,p_to text,p_message_hash text
) returns jsonb language plpgsql security definer
set search_path=pg_catalog,public as $$
declare v_row public.maxx_missed_call_recovery_claims%rowtype;
begin
  if coalesce(auth.role(),'') <> 'service_role' then raise exception 'service_role_required' using errcode='42501'; end if;
  if coalesce(length(p_call_sid),0)=0 or coalesce(length(p_message_hash),0)<>64 then raise exception 'invalid_recovery_claim' using errcode='22023'; end if;
  -- Return existing claims before any new authorization checks, so repeated callbacks never send again.
  select * into v_row from public.maxx_missed_call_recovery_claims where provider='twilio' and provider_call_id=p_call_sid;
  if found then
    if v_row.organization_id<>p_organization_id then raise exception 'recovery_tenant_conflict' using errcode='42501'; end if;
    return jsonb_build_object('claimed',false,'claim_id',v_row.id,'status',v_row.status);
  end if;
  if not exists(select 1 from public.maxx_phone_numbers where organization_id=p_organization_id and number=p_to and mctb_enabled=true) then raise exception 'recovery_number_not_enabled' using errcode='42501'; end if;
  if not exists(select 1 from public.maxx_integration_connections where organization_id=p_organization_id and provider='twilio' and status='connected') then raise exception 'recovery_provider_not_connected' using errcode='42501'; end if;
  if exists(select 1 from public.maxx_sms_opt_outs where organization_id=p_organization_id and phone_number=p_from) then raise exception 'recovery_recipient_opted_out' using errcode='42501'; end if;
  insert into public.maxx_missed_call_recovery_claims(organization_id,provider_call_id,message_hash)
    values(p_organization_id,p_call_sid,p_message_hash)
    on conflict(provider,provider_call_id) do nothing returning * into v_row;
  if found then return jsonb_build_object('claimed',true,'claim_id',v_row.id,'status',v_row.status); end if;
  select * into v_row from public.maxx_missed_call_recovery_claims where provider='twilio' and provider_call_id=p_call_sid;
  if v_row.organization_id<>p_organization_id then raise exception 'recovery_tenant_conflict' using errcode='42501'; end if;
  return jsonb_build_object('claimed',false,'claim_id',v_row.id,'status',v_row.status);
end;$$;
revoke all on function public.maxx_revenue_claim_missed_call_recovery(uuid,text,text,text,text) from public,anon,authenticated;
grant execute on function public.maxx_revenue_claim_missed_call_recovery(uuid,text,text,text,text) to service_role;
