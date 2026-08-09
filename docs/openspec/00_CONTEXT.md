# 00 — Context

Maxx Migrations is the canonical owner-controlled ICM and agentic execution engine behind MACS Digital Media. CRM, website migration, social, grants/opportunity workflows, browser tools, voice, and future capabilities are modules beneath that operating-system boundary, not the product definition itself.

The public storefront lives in `executiveusa/macsdigitalmedia`. This repository owns private client context, isolation, agents, policy, approvals, execution, evidence, and export/handoff.

The north star is a voice-first, progressively disappearing interface: owners state outcomes conversationally; the system performs safe digital work and brings humans only the decisions their truth, judgment, relationships, or authority require.

The existing product is delivered The product is delivered
as a one-time sovereign install: migrated website, connected CRM, and
configured automations, deployed into infrastructure the customer owns
(their own Supabase project, their own hosting).

This document set specifies the full end-state build delivered on branch
`claude/maxx-migrations-full-build-5jh55a`, on top of the stage-1 scaffold
merged in PR #1. The app lives at `apps/maxx-web` in a monorepo that also
contains unrelated products (`erpnext/`, `banking/`) — see
`docs/deployment/VERCEL_MONOREPO_FIX.md` for why the Vercel root directory
must be set explicitly.

Read `docs/openspec/02_FULL_APP_REQUIREMENTS.md` next for the complete
scope, then the numbered specs for each subsystem.
