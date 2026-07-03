```yaml
id: bead-0020
timestamp: 2026-07-03T11:30:00Z
actor: claude-build-agent
phase: stage-2
repo: executiveusa/maxx-migrations-agentic-systems
branch: claude/maxx-migrations-full-build-5jh55a
files_changed:
  - apps/maxx-web/app/app/agents/page.tsx
  - apps/maxx-web/lib/agents/*.ts
  - apps/maxx-web/app/api/agents/**/*.ts
  - apps/maxx-web/lib/mock-data/agents.ts
decision: >
  Implemented the 10 named agents (Migration, Copy, Workflow, CRM,
  Community, Course, Social Planner, Import, Missed Call, QA) with a real
  model router (routeModel: low-token/non-generative tasks → Haiku,
  generative/multi-step → Sonnet), a tool-permission checker
  (checkToolPermission/checkBudget), and a usage logger that computes cost
  from token counts against per-model pricing. POST
  /api/agents/[agentId]/run evaluates permission + budget before
  "approving" a run and returns 403 with a reason when denied.
reason: Matches spec 8.12 and 11.4 (lib/agents/*).
rollback_command: git checkout -- apps/maxx-web/lib/agents apps/maxx-web/app/app/agents apps/maxx-web/app/api/agents
risks: []
next_action: Copy, design polish, and artifact reports (bead-0021).
human_needed: false
```
