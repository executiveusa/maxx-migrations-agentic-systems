# Beads Protocol — Maxx Migrations

Beads is the decision/checkpoint ledger for the Maxx Migrations build. Every
major action, architectural decision, rollback, or verification step is
recorded as a "bead" — a small, append-only markdown record. No work is
reported as "done" without a corresponding bead.

## Structure

```
beads/
├── BEADS_PROTOCOL.md      this file
├── manifest.json          index of all beads, status, timestamps
├── checkpoints/           one file per major milestone (bead-NNNN-*.md)
├── rollback/              rollback notes for any destructive/risky change
└── decisions/             standalone architectural decisions not tied to a checkpoint
```

## Bead record format

```yaml
id: bead-NNNN
timestamp: <ISO8601>
actor: <agent/human>
phase: <stage-1|stage-2|stage-3|cross-cutting>
repo: executiveusa/maxx-migrations-agentic-systems
branch: claude/exciting-knuth-r1yf6s
files_changed:
  - path/one
  - path/two
decision: <what was decided/done>
reason: <why>
rollback_command: <git command or N/A>
risks:
  - <risk 1>
next_action: <what follows>
human_needed: <true|false>
```

## Rules

1. No "done" claims without a bead.
2. Every bead is appended to `manifest.json`.
3. Destructive or hard-to-reverse actions get a rollback note under
   `rollback/` before they are executed, not after.
4. Beads are immutable once written — corrections are new beads, not edits.
5. `human_needed: true` blocks forward progress on that thread until a human
   responds (e.g. missing secret, legal/ownership ambiguity, destructive
   decision).
