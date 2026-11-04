# Client template evidence status

| Area | Status | Proof required |
|---|---|---|
| ICM template and graph | BUILT (pending CI) | validator and generated-workspace smoke |
| Client consent and data | NOT STARTED | owner consent and source manifest |
| Instinct external bridge | BLOCKED | official supported API/authorization and end-to-end proof |
| MAXX portal fallback | EXISTING CANDIDATE | tenant-scoped integration test |
| Hermes + Paperclip | UPSTREAM ADAPTER EXISTS | deployed gateway/heartbeat smoke on client server |
| Composio | EXISTING CONNECTOR CANDIDATE | separate client OAuth and permission proof |
| Foundry sandbox | INTERNAL ALPHA | isolated OpenSandbox test and security review |
| Postgres/RLS | CANONICAL BACKEND PROOF DOCUMENTED | fresh per-client isolation + restore proof |
| Obsidian/LLM wiki | DESIGN CONTRACT | approved export ingestion + retrieval test |
| Metered costs | DESIGN CONTRACT | actual provider event and invoice reconciliation |
| Hostinger one-click | NOT BUILT | pinned, least-privilege installer + security/restore test |
| Client outcome | NOT STARTED | one accepted job with real source and receipt |

Do not promote BUILT to VERIFIED without direct evidence at an exact commit/deployment. No named client's private data is in this template.
