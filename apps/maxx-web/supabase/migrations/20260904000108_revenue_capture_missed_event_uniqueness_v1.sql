-- Repeated provider callbacks must update one missed-call record.
-- Refuse migration if historical duplicates require reconciliation; never delete them silently.
create unique index if not exists maxx_missed_call_events_call_event_idx on public.maxx_missed_call_events(call_event_id);
