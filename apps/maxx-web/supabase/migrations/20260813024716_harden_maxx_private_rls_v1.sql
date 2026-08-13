-- Applied first to temporary Botanic Creations project cyxdevcjycmffhmwxojh.
-- Purpose: defense-in-depth for server-only MAXX tables.
-- These tables intentionally have no anon/authenticated RLS policies.

alter table maxx_private.integration_bindings enable row level security;
alter table maxx_private.ingress_events enable row level security;

revoke all on maxx_private.integration_bindings from public, anon, authenticated;
revoke all on maxx_private.ingress_events from public, anon, authenticated;
revoke usage on schema maxx_private from public, anon, authenticated;
