# MACS Client Zero — Rollback and Recovery

## Scope
This rollback applies only to the additive Client Zero intake/ICM proof slice introduced by PR #17.

## Application rollback
1. Disable or remove access to `/intake/` submission and `/app/client-zero` review routes.
2. Revert the Client Zero commits/PR branch to the prior `develop` SHA.
3. Confirm existing CRM/migration routes still respond using the pre-existing harness.

The slice does not replace existing contact, pipeline, migration, website, domain, or authentication data.

## Database data rollback
For a single test submission, delete in dependency order inside one transaction:

```sql
begin;

delete from public.maxx_evidence_ledger where intake_submission_id = :submission_id;
delete from public.maxx_client_notes where intake_submission_id = :submission_id;
delete from public.maxx_action_proposals where intake_submission_id = :submission_id;
delete from public.maxx_intake_submissions where id = :submission_id;

commit;
```

Before deleting, export the authorized evidence bundle and record its checksum/location in the test report.

## Schema rollback
Do not drop Client Zero tables in normal rollback if any real client data exists. Prefer disabling routes and preserving evidence.

For an empty test-only project, after verifying zero retained rows, drop in dependency order:

```sql
drop function if exists public.maxx_export_intake_context(uuid);
drop function if exists public.maxx_review_action_proposal(uuid, text);
drop policy if exists maxx_evidence_ledger_select on public.maxx_evidence_ledger;
drop policy if exists maxx_client_notes_select on public.maxx_client_notes;
drop policy if exists maxx_action_proposals_select on public.maxx_action_proposals;
drop policy if exists maxx_intake_submissions_select on public.maxx_intake_submissions;
drop policy if exists maxx_icm_memberships_select on public.maxx_icm_memberships;
drop policy if exists maxx_icm_tenants_select on public.maxx_icm_tenants;
drop function if exists public.maxx_icm_role(uuid);
drop function if exists public.maxx_is_icm_member(uuid);
drop table if exists public.maxx_evidence_ledger;
drop table if exists public.maxx_client_notes;
drop table if exists public.maxx_action_proposals;
drop table if exists public.maxx_intake_submissions;
drop table if exists public.maxx_icm_memberships;
drop table if exists public.maxx_icm_tenants;
```

## Proof of rollback
A rollback rehearsal passes only when:
- the test submission cannot be retrieved after data rollback;
- unrelated pre-existing records are unchanged;
- the app returns to the prior known-good revision;
- the rollback/export evidence is retained outside the deleted test rows;
- an independent reviewer signs the result.
