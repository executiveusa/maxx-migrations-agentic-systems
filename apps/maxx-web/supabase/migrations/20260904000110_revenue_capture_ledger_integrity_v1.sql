-- Economic identities and tenant ownership are immutable. No silent cross-tenant reassignment.
create or replace function public.maxx_revenue_guard_event_update() returns trigger language plpgsql set search_path=pg_catalog,public as $$
begin
  if new.organization_id is distinct from old.organization_id or new.provider is distinct from old.provider or new.provider_event_id is distinct from old.provider_event_id or new.event_type is distinct from old.event_type then
    raise exception 'provider_event_identity_immutable' using errcode='23514';
  end if;
  return new;
end;$$;
drop trigger if exists maxx_revenue_guard_event_update on public.maxx_provider_events;
create trigger maxx_revenue_guard_event_update before update on public.maxx_provider_events for each row execute function public.maxx_revenue_guard_event_update();
create or replace function public.maxx_revenue_guard_ledger_update() returns trigger language plpgsql set search_path=pg_catalog,public as $$
begin
  if new.organization_id is distinct from old.organization_id or new.entry_type is distinct from old.entry_type or new.source_provider is distinct from old.source_provider or new.source_ref is distinct from old.source_ref or new.amount_cents is distinct from old.amount_cents or new.currency is distinct from old.currency or new.confidence is distinct from old.confidence then
    raise exception 'economic_entry_immutable_use_adjustment' using errcode='23514';
  end if;
  return new;
end;$$;
drop trigger if exists maxx_revenue_guard_ledger_update on public.maxx_value_ledger_entries;
create trigger maxx_revenue_guard_ledger_update before update on public.maxx_value_ledger_entries for each row execute function public.maxx_revenue_guard_ledger_update();
