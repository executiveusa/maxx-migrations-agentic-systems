# 01 — Product PRD

## Positioning

"We migrate your existing website, upgrade the design, connect your CRM,
automate follow-up, recover missed leads, and give your organization an
owned AI-powered operating system."

## Business model

One-time sovereign install → owned code, owned data, owned CRM, owned
workflows. Optional recurring: maintenance + AI technology partner
retainer (see `/app/settings/billing`).

## Target users

Nonprofits, social-purpose businesses, community organizations, and the
agencies/consultants who serve them — see `lib/validation/migration-audit.ts`
`orgTypes` for the exact intake taxonomy.

## Core jobs to be done

1. Get off a rented website builder and legacy CRM (SaaS) onto owned
   infrastructure without losing data — Website Migration Engine + GHL
   Import Wizard.
2. Run donor/volunteer relationships in one system — CRM core (contacts,
   pipeline, forms).
3. Automate follow-up without hiring an ops person — Workflow Builder,
   Missed Call Text Back.
4. Keep staff, board, and volunteers coordinated and trained — Community
   & Courses.
5. Keep a consistent public presence — Social Media Planner.

## Quality bar

Apple-like polish, Steve Krug clarity ("don't make me think"), dark
sovereign infrastructure visual direction — see
`docs/design/DESIGN_SYSTEM.md`.

## Definition of done for this build

See `icm/11_full_app_completion/QA_CHECKLIST.md`.
