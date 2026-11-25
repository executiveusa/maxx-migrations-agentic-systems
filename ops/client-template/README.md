# MAXX client workspace scaffolder

This is the **first safe, reversible slice** of the per-client installation workflow. It creates a portable, non-secret ICM folder with a machine-readable graph and provider-neutral contracts. It is not a server installer.

## Requirements
Node.js 22+, a checkout of `executiveusa/maxx-migrations-agentic-systems`.

```sh
node ops/client-template/validate.mjs
node ops/client-template/scaffold.mjs --slug example-founder --name "Example Founder" --out ./tmp/example-founder
node ops/client-template/validate.mjs ./tmp/example-founder
```

`--dry-run` validates arguments without writing. Existing destinations are never overwritten. The scaffold performs no network calls, does not provision accounts or touch client data. Keep the generated workspace in a private client-controlled repository after reviewing it. Never commit credentials, raw LLM exports or private business data.

## Later production provisioning (not yet implemented)
1. Owner buys a Hostinger VPS and retains account ownership.
2. Pin a reviewed container/runtime release and apply least-privilege bootstrap; do not use ACFS `--mode vibe` in client production.
3. Deploy Postgres/auth, encrypted object store, Hermes, Paperclip and MAXX capability gateway as separately permissioned services; install only needed tools.
4. Verify sandbox isolation, backups/restore, cost caps, monitoring and exact-action approvals.
5. Connect Composio separately per client. Instinct stays manual/third-party until an officially supported bridge is approved.
6. Run the upstream Paperclip Hermes gateway smoke, the MAXX tenant-isolation suite, and one actual draft-only client job.
7. Independent reviewer signs release; record revision and rollback image.

Existing `ops/flywheel-vps-api/server.ts` reports launched without spawning a process. It must be repaired or replaced with a proven Paperclip/Hermes run contract before use as a live client control plane.
