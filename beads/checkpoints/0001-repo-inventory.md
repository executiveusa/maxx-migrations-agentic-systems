```yaml
id: bead-0001
timestamp: 2026-06-30T06:35:00Z
actor: claude-build-agent
phase: stage-1
repo: executiveusa/maxx-migrations-agentic-systems
branch: claude/exciting-knuth-r1yf6s
files_changed:
  - beads/BEADS_PROTOCOL.md
  - beads/manifest.json
  - beads/checkpoints/0001-repo-inventory.md
decision: >
  Inventoried the target repo. Confirmed it currently holds the upstream
  Frappe ERPNext codebase (GPLv3), not an empty/minimal Maxx Migrations
  starter as the build prompt assumed. Root contains erpnext/ (Frappe app),
  banking/ (Vue SPA, yarn workspace, postinstall hook), license.txt (GPLv3),
  README.md (ERPNext branding), TRADEMARK_POLICY.md, semgrep/, .greptile/,
  pyproject.toml (Python tooling: black/ruff/flake8 config), commitlint,
  mergify, codecov, CODEOWNERS — i.e. a fully configured open-source ERP
  monorepo with its own CI/governance tooling. Git log shows live upstream
  ERPNext commit history (accounting, payment entries, purchase/sales
  registers), confirming this is not a stale fork snapshot but the real
  ERPNext tree.

  Per user direction (explicit, post-question): this is a REFRAME, not a
  rebuild — Maxx Migrations is being built as a new product *extending*
  this base, not replacing it. Decision: build the new product in an
  isolated top-level directory (apps/maxx-web/) plus root-level docs/ and
  beads/ directories, so the ERPNext tree is never touched, deleted, or
  reorganized. This avoids GPLv3 entanglement (the new app ships as a
  separate, independently-licensed codebase in the same monorepo rather
  than modifying ERPNext source) and avoids any destructive action against
  unfamiliar/owned architecture per repo-safety rules.

  Active branch is claude/exciting-knuth-r1yf6s (already exists, tracks
  develop per harness instructions). This satisfies the spec's "create a
  feat/ branch off develop" requirement in spirit — harness-level
  instructions designate this branch as the required development branch
  for this session and take precedence over the spec's branch-naming
  suggestion. No new branch created.
reason: >
  Repo-safety rules (spec §2.1) require inspecting the repo and not
  overwriting unknown architecture before changing files. The actual state
  diverged sharply from the spec's assumption ("minimal starter repo"),
  which is exactly the kind of "missing secret / destructive decision /
  ambiguity" condition the spec calls out as a legitimate reason to pause.
  Surfaced to the user via AskUserQuestion before any file changes; user
  confirmed "extend, don't rebuild, follow spec to a t."
rollback_command: "git checkout -- beads/ docs/ apps/  # or: git clean -fd beads docs apps (only these new, untracked top-level dirs)"
risks:
  - GPLv3 proximity: apps/maxx-web/ must remain a self-contained package
    (own package.json/lockfile) so it is not interpreted as a "combined
    work" with ERPNext's GPLv3 Python/JS under copyleft theories. Flagged
    in docs/architecture and risk register for legal review.
  - Monorepo CI (.github/, .mergify.yml, .pre-commit-config.yaml,
    commitlint.config.js) is tuned for ERPNext (Python/Frappe). New
    JS/TS app may not be covered by existing CI and needs its own
    workflow — tracked as a gap, not blocking MVP.
  - erpnext/ and banking/ are large; no files within them were read in
    bulk to conserve context — inventory is directory-level only.
next_action: Write bead-0002 (skill/reference-repo ingestion), then begin
  Stage 1 clone inventory of leadstack.dev.
human_needed: false
```
