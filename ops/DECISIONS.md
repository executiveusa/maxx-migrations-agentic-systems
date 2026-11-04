# MACS Client Zero — approved decisions
Confirmed by owner on 2026-11-04: “yes to all” four proposed decisions. Do not treat this as blanket release approval.

| ID | Decision | Owner-approved boundary |
| --- | --- | --- |
| D1 | Infrastructure | Separate MACS-controlled Supabase project; correctly configured Next.js staging. Preserve existing production and never use unrelated databases. |
| D2 | Authority | Owner approves spending and production release. Stacy is designated MACS action reviewer; verify her authenticated identity and tenant membership before granting access. Separate independent code reviewer. No self-approval. |
| D3 | Budget | Synthetic-data development, isolated branches, draft PRs and reversible no-cost staging preparation allowed. Incremental paid inference and recurring infrastructure ceiling **$0** until separately approved. No external sends. |
| D4 | Instinct | Keep authenticated MAXX portal as fallback. Integrate Instinct only through verified, consented interface. No shared credentials, invented A2A endpoint or duplicate control plane. |

## Scope and commercial position
Classification: USE (MACS internal pilot), then MERGE into existing MAXX if proven. Do not claim SELL until a realistic paid opportunity is validated. Revenue offer remains Vibe Audit. Existing MAXX is the shared platform; live Mercury is a separate bounded experiment and is not required for this pilot.

Required journey: intake → tenant-isolated ICM record → benign CRM note proposal → independent human approve/reject → exactly-once effect → evidence → authorized export and rollback. No real client PII until security gates pass.

## Protected operations
Production merge/deploy, paid services, spending, account/secret/permission changes, destructive database operations, real external sends, contracts, and public claims require separate owner approval. A reviewer may approve only the exact scoped action payload after identity, role, and payload integrity checks. Silence is never approval.

## Revisit
Revisit D1 when correct Supabase project is connected; D2 when Stacy's user identity is verified; D3 upon an explicit itemized cost request; D4 upon an official authenticated Instinct interface. All other engineering choices should proceed without another routine interview.
