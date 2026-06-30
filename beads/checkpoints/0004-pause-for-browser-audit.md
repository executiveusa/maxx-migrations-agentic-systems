```yaml
id: bead-0004
timestamp: 2026-06-30T07:05:00Z
actor: claude-build-agent
phase: stage-1
repo: executiveusa/maxx-migrations-agentic-systems
branch: claude/exciting-knuth-r1yf6s
files_changed:
  - beads/checkpoints/0004-pause-for-browser-audit.md
  - docs/clone/leadstack/BROWSER_AUDIT_PROMPT.md
decision: >
  Paused Stage 1 build at user request to hand off a real site audit to a
  browser-capable agent, since this session's own outbound network access
  to leadstack.dev is blocked (HTTP 403 at proxy CONNECT layer — see
  bead-0003). Wrote a standalone audit prompt
  (docs/clone/leadstack/BROWSER_AUDIT_PROMPT.md) for a separate agent with
  working browser/network access to crawl every reachable page of
  leadstack.dev and report back: route map, section-by-section component
  patterns, structural copy patterns (paraphrased, not verbatim), pricing
  tier structure, FAQ topics, footer structure, visual/responsive/animation
  patterns, and asset/integration references — diffed against what this
  build has already implemented, to produce a concrete gap list.
reason: >
  User instruction. Also technically correct: this session cannot itself
  fetch the live site, so delegating to an agent with real browser access
  is the only way to close the clone-fidelity gap flagged as "known gap"
  in bead-0003.
rollback_command: "git clean -fd apps/ docs/ beads/  # nothing has been committed yet; all work is in the untracked working tree"
risks:
  - None of the work below has been committed to git yet. If the session
    ends before a commit, in-progress files are lost (tracked as an
    explicit risk, not yet acted on since user has not asked for a commit
    at this checkpoint).
next_action: >
  Awaiting the browser-audit agent's report. Once received: update
  section-map.json, rebrand-map.md, and visual-audit.md with real findings,
  re-verify/adjust already-built components (HeroSection, ProofPanel,
  HowItWorks, MigrationCockpitPreview, FeatureStack, NonprofitUseCases,
  PricingSection, FAQSection, FinalCTA, Footer, MainNav, AnnouncementBar —
  all already implemented in apps/maxx-web/components/landing/), then
  resume the implementation order at: app/migration-audit/page.tsx +
  /api/migrations/extract route (the form at
  components/forms/MigrationAuditForm.tsx already POSTs there but the
  route does not exist yet), Supabase schema, migration engine + agent
  interfaces, dashboard MVP, docs, tests, build/lint, commit, PR.
human_needed: false
```

## Current build state (uncommitted working tree)

**Scaffolded (`apps/maxx-web/`):** package.json, tsconfig.json,
next.config.mjs, tailwind.config.ts, postcss.config.mjs, .eslintrc.json,
.gitignore, app/globals.css (design tokens), app/layout.tsx (fonts,
skip-link).

**Landing components built:** AnnouncementBar, MainNav, HeroSection,
ProofPanel, HowItWorks, MigrationCockpitPreview, FeatureStack,
NonprofitUseCases, PricingSection, FAQSection, FinalCTA, Footer
(`components/landing/`), Button (`components/ui/`).

**Routes built:** `app/page.tsx` (full landing assembly), `app/how-it-works/page.tsx`,
`app/pricing/page.tsx`.

**Forms:** `lib/validation/migration-audit.ts` (Zod schema),
`components/forms/MigrationAuditForm.tsx` (React Hook Form, posts to
`/api/migrations/extract` — **route not yet implemented**).

**Not yet started:** `app/migration-audit/page.tsx`, all API routes,
Supabase schema/migrations, `lib/migration/*`, `lib/agents/*`, dashboard
MVP (`app/app/*`), `.env.example`, docs (PRD/architecture/pipeline/QA),
tests, lint/build/typecheck run, commit, PR.
