# 08 — Agent Spec

## The 10 agents

Migration, Copy, Workflow, CRM, Community, Course, Social Planner, Import,
Missed Call, QA — defined in `lib/mock-data/agents.ts` with a model
policy, status, tool permissions, and monthly budget each.

## Runtime

- `lib/agents/model-policy.ts` — per-model pricing table
  (`claude-haiku-4-5`, `claude-sonnet-5`, `claude-opus-4-8`) and
  `estimateCostUsd()`.
- `lib/agents/model-router.ts` — `routeModel(estimatedTokens,
  requiresGeneration)`: low-token/non-generative → Haiku; generative or
  multi-step → Sonnet. Nothing routes to Opus automatically.
- `lib/agents/tool-policy.ts` — `checkToolPermission()` (denies inactive
  agents and missing permissions) and `checkBudget()` (denies once
  `monthlySpendUsd >= monthlyBudgetUsd`).
- `lib/agents/agent-runner.ts` — `evaluateAgentRun()` composes the above
  into a single allow/deny decision with a human-readable reason.
- `lib/agents/usage-logger.ts` — `recordUsageEvent()` computes actual cost
  from token counts for the model used.

## API

`GET /api/agents` lists agents; `POST /api/agents/[agentId]/run`
evaluates a run request and returns `403` with a reason when the agent is
inactive, lacks the required permission, or is over budget — otherwise
`200` with the routed model and a recorded usage event.

## UI

`/app/agents` renders `ModelCostGuard` (budget bar + over-budget list),
`AgentGraphExplorer` (per-agent session history), and
`ToolPermissionMatrix` (filterable grid) — all three are real interactive
artifacts, not static tables.
