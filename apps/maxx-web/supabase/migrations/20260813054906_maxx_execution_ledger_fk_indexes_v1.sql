create index if not exists maxx_execution_ledger_org_idx
  on maxx_private.execution_ledger (organization_id);

create index if not exists maxx_execution_ledger_actor_idx
  on maxx_private.execution_ledger (actor_user_id);
