# Feature Matrix

| Feature | Feature page | App route | Status |
| --- | --- | --- | --- |
| Community & Courses | `/features/community`, `/features/courses` | `/app/community`, `/app/community/courses` | Live |
| Workflow Builder | `/features/workflows` | `/app/workflows` | Live |
| Social Media Planner | `/features/social-planner` | `/app/social-planner` | Live (publish requires Meta credentials) |
| GHL Import Wizard | `/features/ghl-import` | `/app/import/ghl` | Live (CSV works with zero config; API path requires GHL credentials) |
| Missed Call Text Back | `/features/missed-call-text-back` | `/app/missed-calls` | Live (sending requires Twilio credentials) |
| Website Migration Engine | `/features/website-migration` | `/app/migrations` | Live (crawl runs in seed mode unless `MIGRATION_CRAWLER_ENABLED`) |
| AI Agent Runtime | n/a (internal) | `/app/agents` | Live |
| CRM Core (contacts/pipeline/forms) | n/a (core product) | `/app/contacts`, `/app/pipeline`, `/app/forms` | Live |

"Live" means: real UI, real client-side and server-side validation, real
state transitions in `lib/data/store.ts`, and — where an external service
is required — a real "setup required" state rather than a fake success.
No row in this table is a stub.
