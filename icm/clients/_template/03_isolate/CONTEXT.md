# 03 — Isolate: client sovereignty

**Inputs:** authorized tenant, private repository, server ownership, provider accounts and approved tool scopes.

**Process:** provision isolated Postgres/RLS, encrypted files, backups, secret references and per-client Composio OAuth. Pin container images and separate runtime identities. Run two-tenant denial tests and sandbox egress tests before external actions.

**Outputs:** authenticated tenant API and private workspace with revocable scoped integrations.

**Human gate:** owner approves connections, data locations, retention, hosting and any credentials or production access.

**Exit proof:** tenant A cannot read/write tenant B, no credentials in Git/logs, backups exist, restore rehearsal succeeds. Foundry mock/bash does not count as isolation.
