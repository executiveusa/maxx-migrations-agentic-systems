# MAXX Federation Walk Test

Status is `PASS` only when every required row is supported by current evidence.

## Cold orientation

- [ ] From the local entry file, a memoryless agent can identify the three-repo boundary.
- [ ] Within at most two additional reads, it can name the canonical owner for the current task.
- [ ] It can locate the exact ICM stage/context without loading the full workspace.

## ICM contract

- [ ] The selected working folder has a clear one-job contract.
- [ ] Inputs are exact paths and distinguish working inputs from stable references.
- [ ] Outputs are inspectable/editable artifacts or durable canonical records.
- [ ] The human check is explicit.
- [ ] No routing file is carrying a large content payload.
- [ ] No material fact has two independent canonical homes.

## Machine surfaces

- [ ] Backend API: authenticated `/api/system/health` returns a truthful ready/degraded result.
- [ ] Backend API: authenticated `/api/system/manifest` returns the same federation/version expected by clients.
- [ ] Backend API: authenticated `/api/system/route` returns only Reset/Momentum/Scale/Launch.
- [ ] Backend CLI reaches the same API and does not own separate state.
- [ ] Backend MCP reaches the same API and does not own separate state.
- [ ] Agent MAXX control plane reaches the backend through its server-side adapter.
- [ ] Agent MAXX CLI reaches the control plane route for MAXX Migrations.
- [ ] Agent MAXX MCP reaches the control plane route for MAXX Migrations.
- [ ] Hermes reaches the same control-plane route through the scoped Hermes MCP credential; Hermes never receives the backend machine key.

## Motion gate

At least one real cross-repo path must execute before PASS:

`Agent MAXX surface -> control plane -> MAXX Migrations API -> canonical result -> control plane -> surface`

Evidence must include:

- [ ] exact repository revision(s);
- [ ] exact deployment/runtime target(s);
- [ ] a successful call or truthful degraded response;
- [ ] no secret values in the evidence;
- [ ] current evidence state (`TESTED` vs `VERIFIED` etc.).

## Authority / failure path

- [ ] Unauthenticated machine calls fail closed.
- [ ] Missing backend config reports unavailable/degraded instead of faking success.
- [ ] Consequential operations still pass the human approval gate.
- [ ] Emergency/production locks still block mutations.
- [ ] Rollback target is known before production changes.

## Release result

Write one of:

- `PASS — VERIFIED`: motion proven against the intended deployed runtime.
- `PASS — TESTED`: deterministic tests prove the wiring, but deployed runtime motion is not yet proven.
- `HOLD`: one or more required rows lack evidence.

Never convert `PASS — TESTED` to `VERIFIED` because a build, PR, or deployment record exists.
