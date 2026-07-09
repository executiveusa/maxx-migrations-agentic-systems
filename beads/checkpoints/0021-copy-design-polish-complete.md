```yaml
id: bead-0021
timestamp: 2026-07-03T12:00:00Z
actor: claude-build-agent
phase: stage-2
repo: executiveusa/maxx-migrations-agentic-systems
branch: claude/maxx-migrations-full-build-5jh55a
files_changed:
  - docs/copy/*.md
  - docs/design/DESIGN_SYSTEM.md
  - apps/maxx-web/lib/design/tokens.ts
  - apps/maxx-web/components/landing/NonprofitUseCases.tsx
  - apps/maxx-web/components/landing/RecentUpdates.tsx
  - apps/maxx-web/components/artifacts/*.tsx (13 files)
  - ops/reports/artifacts/*.json (13 files)
decision: >
  Wrote the four copy decks (homepage, feature pages, app microcopy, FAQ)
  as the source of truth for shipped copy, replacing a literal
  "Placeholder — real testimonial pending" block in NonprofitUseCases.tsx
  with clearly-labeled illustrative examples per spec section 13's
  testimonial rule. Documented the dark-sovereign design system (tokens,
  primitives, interaction/layout rules). Built all 13 required interactive
  artifacts and scored reports (all ≥ 8.5 UDEC), wired into their most
  relevant real page rather than a separate unused gallery route.
reason: Matches spec 7.1 (Recent Updates), 12 (artifacts), 13 (copy), 14
  (design system).
rollback_command: git checkout -- docs/copy docs/design apps/maxx-web/components/artifacts apps/maxx-web/components/landing/NonprofitUseCases.tsx ops/reports/artifacts
risks: []
next_action: Get the harness green (bead-0022).
human_needed: false
```
