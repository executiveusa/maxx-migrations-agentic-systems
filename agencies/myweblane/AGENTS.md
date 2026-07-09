# AGENTS.md — MyWebLane

## Purpose

Digital media agency owned by Akash, based in India, operating within the
6-agency Maxx flywheel collective. Specific brand mission and service focus
were not provided at the time this file was generated — see Handoff below.

## Architecture

- `maxx_organizations` row: slug `myweblane`, plan `sovereign_install`
- Standard Maxx CRM tenant — isolated from other agencies by RLS via
  `maxx_is_org_member(organization_id)`
- No hub-level cross-org visibility (that's The Pauli Effect's role only)

## Agent Rules

- Agents operating under this org see only `myweblane`-scoped rows in every
  `maxx_`-prefixed table
- No agent may act on another agency's data — RLS enforces this at the
  database layer

## Setup

Standard Maxx CRM Supabase connection, scoped to this org's
`maxx_organizations.id`. No special integrations configured yet.

## Verification

Standard `npm run verify:full` gate — no agency-specific overrides.

## Common Tasks

- Launch new projects via the Project Launcher, assigned to this org
- Track bead progress and agent sessions specific to MyWebLane projects

## Risk Zones

None specific to this agency beyond the standard multi-tenant RLS boundary.

## Deployment

Same Vercel/Supabase pipeline as the rest of Maxx.

## Handoff

Brand voice, visual identity, target audience, and project history for
MyWebLane were not provided at the time this file was generated. Update this
file with Akash's actual brand guidelines, service offerings, and current
projects before agents draft client-facing copy or designs for this agency —
do not fabricate a brand voice in the meantime.
