# MACS Client Zero — acceptance matrix v1.0
All results start **NOT RUN** unless direct proof is linked. Reviewers must record SHA, staging URL/project, UTC timestamp, test command, expected/actual, evidence and PASS/FAIL/BLOCKED. Documentation and successful build alone do not satisfy live acceptance.

| ID | Requirement | Reproducible acceptance test | Release gate |
| --- | --- | --- | --- |
| A01 | FR01 | Malformed JSON, invalid schema, over-size payload and burst requests fail safely; real abuse test returns 429. | BLOCKED: no verified limiter |
| A02 | FR02 | Inject failure between writes; zero orphan records. Retry same request with stable key; one logical intake. | NOT RUN |
| A03 | FR03 | Tenant A/B, member/nonmember, guessed IDs/receipts across GET, POST, review and export; zero cross-tenant reads/writes. | BLOCKED: MACS DB not connected |
| A04 | FR04 | Author cannot approve; reviewer role verified; modified payload hash and revoked membership reject; independent approval only. | NOT RUN |
| A05 | FR04 | Reject action; count notes before/after = 0; rejection ledger recorded once. | NOT RUN |
| A06 | FR05 | Approve in parallel and replay after restart; one note, one canonical execution result, replay=true. | NOT RUN |
| A07 | FR06 | Authorized export round-trip and checksum; no receipt token, secrets or other tenant data. | NOT RUN |
| A08 | FR06 | Evidence completeness for intake, proposal, rejection/execution, actor and timestamps; ledger errors fail closed. | NOT RUN |
| A09 | FR07 | Browser click test at 320/390/430/desktop; keyboard, screen-reader labels, errors, no horizontal overflow. | NOT RUN |
| A10 | FR07 | Run existing lint, typecheck, unit tests, dependency audit and build at exact candidate SHA; no CRM regression. | NOT RUN |
| A11 | FR07 | Rehearse disable/rollback, preserve exported evidence and other tenant's records; independent review. | NOT RUN |
| A12 | FR08 | Verify Instinct A2A authenticated transport, stable mailbox ID, ACK and no duplicate messages. Otherwise fallback stays in use. | BLOCKED: Instinct interface not verified |
| A13 | FR08 | Real timed ten-minute invocation, durable checkpoint, crash/restart/lease recovery, duplicate prevention and pause. | BLOCKED: Instinct scheduler not verified |
| A14 | ALL | Independent code/security reviewer reproduces critical tests and signs PASS; owner separately approves release. | NOT RUN |
| A15 | ALL | Following owner approval, inspect actual deployed SHA, production UX/API/DB flow, monitoring and rollback. | BLOCKED: no release authorization |

## Evidence handling
Store non-secret synthetic evidence in `ops/evidence/client-zero/` or link to CI/PR artifacts. No personal data, credentials, raw session tokens or production payloads in public GitHub. Failed checks become tasks, not waived findings.

## Completion
A01–A11 and A14 must pass before release readiness. A12–A13 are required for a claim of verified autonomous Instinct operation; do not conflate optional transport with the mandatory safe portal fallback. A15 passes only after separate production authorization and direct verification. Any unresolved critical security or data-integrity failure blocks release.
