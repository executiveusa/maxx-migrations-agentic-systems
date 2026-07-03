# MAXX MIGRATIONS — AI EXECUTION KERNEL
> Self-ingesting operating system for every AI agent that touches this repo.
> Read this before any tool call. It replaces all human-time thinking.

---

## IDENTITY CONSTRAINT

You are not a human. You do not have weeks, days, or roadmaps.

You have:
- **200K token context window**
- **Parallel sub-agent spawns** (unlimited, concurrent)
- **Inference at ~50 tok/s output** (Sonnet) / ~120 tok/s (Haiku)
- **Cost per decision**: ~$0.003/1K tok (Sonnet) · ~$0.00025/1K tok (Haiku)

**Banned vocabulary**: `weeks` · `days` · `roadmap` · `timeline` · `schedule` · `sprint`
**Required vocabulary**: `context load` · `token budget` · `phase gate` · `sub-agent verify` · `parallel spawn` · `inference cost` · `deterministic node` · `agentic node`

16 weeks = ~400K Sonnet output tokens = 2 context windows = **execute now.**

---

## THE BLUEPRINT EXECUTION MODEL
*(Derived from Stripe Minions — 1,300 autonomous PRs/week, zero human code)*

Every unit of work follows this state machine:

```
DETERMINISTIC PREFETCH
  → read specs, grep codebase, curate ≤15 relevant files
  → cost: Haiku reads only, ~$0.005

AGENTIC NODE (Sonnet-5)
  → reason, generate, write files, call tools
  → token budget declared before starting

DETERMINISTIC GATE
  → run harness / tests / typecheck — NO LLM compute on formatting
  → binary output: PASS | FAIL + error list

  ┌─ PASS → commit, advance to next phase
  └─ FAIL → feed error back to agentic node (max 3 loops)
              if 3 failures → STOP + report diagnosis to human

ONE PR AT THE END
  → Sonnet-5 reviewer sub-agent writes review summary
  → Human reviews diff
  → Human merges to main
  → AI executes everything else
```

**No phase starts without the previous gate passing.**
**No human intervention between phases.**
**Human in the loop: final merge only.**

---

## MODEL ROUTING MATRIX

| Task | Model | Token budget | Est. cost |
|------|-------|-------------|-----------|
| Read file, grep, search | `claude-haiku-4-5-20251001` | 8K | ~$0.001 |
| Write component, schema, route | `claude-sonnet-5` | 64K | ~$0.02 |
| One-shot full module | `claude-sonnet-5` | 128K | ~$0.05 |
| Cross-file refactor | `claude-sonnet-5` | 200K | ~$0.10 |
| Voice/real-time queries in product | `claude-haiku-4-5-20251001` | 4K | ~$0.0003 |
| Complex CRM ops in product | `claude-sonnet-5` | 32K | ~$0.015 |
| Never route here automatically | `claude-opus-4-8` | — | — |

**Routing rule**: If `estimatedTokens < 20K AND requiresGeneration = false` → Haiku. Everything else → Sonnet. Nothing reaches Opus without explicit human instruction.

---

## SUB-AGENT VERIFICATION PROTOCOL (SAV)

After every phase gate, spawn a verifier:

```
Agent(
  description: "Phase N gate check",
  prompt: """
    cd /home/user/maxx-migrations-agentic-systems/apps/maxx-web
    Run: npm run verify:full
    Report PASS or FAIL.
    On FAIL: list every failing check name and its first error line. Nothing else.
  """,
  run_in_background: false
)
```

- **PASS** → commit with token budget in commit body → advance
- **FAIL** → read error → fix inline → re-run gate → max 3 attempts
- **3 failures** → stop, post diagnosis, wait for human

---

## THIS REPO'S GATE COMMANDS

```bash
# Master gate — run this after every phase
cd apps/maxx-web && npm run verify:full

# Individual gates (use when scoped to one subsystem)
npm run typecheck          # tsc --noEmit
npm run lint               # eslint
npm run test               # vitest (27 unit tests)
npm run harness:routes     # all app routes return 200
npm run harness:api        # all API routes respond correctly
npm run harness:links      # no broken internal links
npm run harness:copy       # no stub/placeholder copy
npm run harness:env        # env vars documented
npm run harness:artifacts  # 13 interactive artifacts present
npm run harness:browser    # playwright smoke (3 e2e suites)
npm run harness:no-stubs   # zero TODO/FIXME/stub in production paths
npm run harness:all        # all sub-harnesses combined
npm run test:e2e           # full playwright suite
```

All gates green = commit allowed. Any red = fix before committing.

---

## BUILD PHASES — THIS REPO

### Current state (as of context load)
- 58 pages compile · 27/27 unit tests pass · lint clean
- **All data is mock/seed** — no real backend, no real auth, no real sends
- Supabase schema exists (`supabase/migrations/20260101000000_maxx_crm_core.sql`)
- `getStore()` is the single data access point — swap arrays for Supabase queries = backend done

### Phase execution order

**Phase 1 — SUPABASE BACKEND** (~80K Sonnet tokens)
- Deploy schema to live Supabase project via MCP
- Enable RLS, verify `is_org_member()` function
- Wire `lib/data/store.ts` → Supabase queries via `getStore()`
- Gate: schema deployed · RLS policies active · `npm test` passes

**Phase 2 — AUTH** (~40K Sonnet tokens)
- Supabase magic link via `@supabase/ssr`
- Middleware protecting `/app/*`
- Seed-mode banner off when `NEXT_PUBLIC_AUTH_CONFIGURED=true`
- Gate: `/app/` redirects unauthenticated → `/login` · magic link flow testable

**Phase 3 — REAL CONTACTS + PIPELINE CRUD** (~60K Sonnet tokens, parallel-eligible)
- Replace `getStore()` mock reads/writes with Supabase queries in contact + pipeline API routes
- RLS guarantees org isolation — no additional filtering needed
- Gate: `harness:api` green · e2e contacts + pipeline pass

**Phase 4 — AGENT CHAT PANEL + STREAMING** (~80K Sonnet tokens)
- `POST /api/agent/chat` → Anthropic SDK streaming
- Model routing: Haiku for read queries, Sonnet for write/complex ops
- Tool suite: `search_contacts` · `get_pipeline` · `create_contact` · `move_deal`
- Human-in-the-loop confirmation cards before any write/send/delete
- Conversation history: 20 turns persisted to Supabase
- Gate: tool calls execute · streaming works · confirmation cards block without approval

**Phase 5 — VOICE** (~40K Sonnet tokens)
- Push-to-talk button: bottom-right, every page, always visible
- Web Speech API STT → agent → Browser SpeechSynthesis TTS
- Visual waveform when listening (user must see mic is live)
- "Stop" or "Cancel" one-word abort
- Voice always falls through to text agent if speech fails
- Gate: waveform renders · voice → agent → spoken response round trip < 2s locally

**Phase 6 — VERCEL FIX** (~5K Sonnet tokens)
- `vercel.json` installCommand: `"npm install --prefix apps/maxx-web && npm install --ignore-scripts"`
- Gate: Vercel preview URL returns 200, no "No Next.js version detected" error

**Phase 7 — FINAL PR + REVIEW**
- One PR against `develop` with full diff
- Spawn Sonnet-5 reviewer sub-agent: reads diff, flags any stub/TODO/security issue
- Human reviews, human merges
- Cost report in PR body: token budget per phase, gate attempts

---

## PARALLEL EXECUTION RULES

Phases are parallelizable when they don't share files. Examples:
- Phase 3 contact routes + Phase 3 pipeline routes → **spawn both simultaneously**
- Phase 4 tool handlers + Phase 4 UI panel → **spawn both simultaneously**
- Phase 1 and Phase 2 → **sequential** (auth depends on DB)

When spawning parallel sub-agents, declare token budgets upfront and aggregate costs.

---

## COMMIT PROTOCOL

Every commit body includes:
```
[Phase N] Description of change

Token budget used: ~XXK Sonnet + ~XK Haiku
Gate: PASS (attempt 1) | PASS (attempt N after fixing: ...)
```

Feature branch: `claude/[phase-description]`
One PR per full build cycle, opened against `develop`.

---

## REPO STRUCTURE (MEMORIZE)

```
apps/maxx-web/              ← The product. Everything else is legacy ERPNext.
  app/                      ← Next.js App Router pages + API routes
  components/               ← UI components (ui/, app-shell/, features/, artifacts/)
  lib/
    types/                  ← Canonical TS domain types (45 tables)
    validation/             ← Zod schemas (shared client + server)
    mock-data/              ← Seed data (READ-ONLY — replace with Supabase)
    data/store.ts           ← THE SEAM: swap arrays → Supabase queries here
    data/mode.ts            ← Seed/prod mode flags
    agents/                 ← Model policy, router, tool policy, runner, logger
    integrations/           ← Twilio, Meta, GHL, Postiz adapters
  supabase/migrations/      ← 45-table schema, RLS, is_org_member() — READY TO DEPLOY
  scripts/harness/          ← All gate scripts

docs/openspec/              ← Specs for every subsystem (read these, not the code)
  00_CONTEXT.md             ← Start here
  02_FULL_APP_REQUIREMENTS.md ← The done checklist
  03_ARCHITECTURE.md        ← Stack + data flow
  05_DATA_SCHEMA_SPEC.md    ← All 45 tables
  08_AGENT_SPEC.md          ← Agent runtime + model routing
  18_HANDOFF.md             ← What's real vs what needs credentials
```

---

## PRODUCT CONTEXT (WHY THIS EXISTS)

**The sale**: GHL Pro = $297/mo × 24mo = $7,128. Data locked forever.  
**Our answer**: $6,000 once. Own the code. Own the data. AI agent included.

**The agent IS the product.** The UI is a confirmation surface. The user speaks or types. The agent does everything. Every write/send/publish/delete requires human confirmation — agent proposes, human approves, one click.

**Voice round-trip target**: < 1.5 seconds STT → agent → TTS.  
**Agent cost target**: < $0.63/org/month at 50 queries/day.

---

## SELF-INGESTION INSTRUCTION

When a new Claude instance reads this file, it must:
1. Suppress all human-time vocabulary from its responses
2. Load `docs/openspec/00_CONTEXT.md` → `18_HANDOFF.md` as Phase 0 context
3. Identify the current phase by checking which gate last passed
4. Execute the next phase using the Blueprint model above
5. Never ask "what should I build next?" — the phase list is the answer

This file is the agent. The agent is this file.
