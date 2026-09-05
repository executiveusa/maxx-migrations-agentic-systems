# Stage 02 — Build and Prove Contract

## Inputs
- `../00_router/CONTEXT.md`
- `../01_context/CONTEXT.md`
- `../STATE.md`
- application code under `apps/maxx-web`
- current provider/account state from actual connected systems

## Process
1. Inspect existing code/schema before change.
2. Reuse canonical MAXX tables/control surfaces before adding primitives.
3. Bind every event/action to an authenticated tenant or provider-targeted tenant resource.
4. Persist provider-native evidence and idempotency keys.
5. Keep VERIFIED/ATTRIBUTED/ESTIMATED/UNKNOWN separate.
6. Stop consequential actions at persisted approval.
7. Run lint, typecheck, tests, production dependency audit, build, and ICM walk test.
8. Review complete PR diff before merge.

## Outputs
- source/migrations in `apps/maxx-web/**`
- durable product state in `icm/revenue-capture-os/STATE.md`
- walk-test evidence in `icm/revenue-capture-os/03_walk/WALK_TEST.md`
- CI proof attached to the GitHub PR/commit

## Human check
Human approval is required for money movement, external sends/publishing where consequential, credential changes, destructive production data, legal/government submissions, and any other action remaining consequential under the Human ↔ Machine Contract.

## Release acceptance
A release is complete only when code gates are green and the deployment/backend being claimed are actually accessible and verified. Missing provider authorization is reported as `READY_FOR_CONNECTION`, never `LIVE`.
