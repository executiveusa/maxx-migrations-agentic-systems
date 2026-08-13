# MAXX Craft / MAXX Migration

Repo: `executiveusa/maxx-craft` (private)
Preliminary portfolio decision: `EXTRACT_AND_MERGE` into MAXX Migrations rather than grow as a separate flagship.

Current spec/README describe an agent-powered WordPress → Next.js migration system with source acquisition, HTML→MDX transformation, SEO/slug/media preservation, plugin mapping, FastAPI orchestration, queues, artifacts, payments and deploy flows.

## Suite role

A migration primitive library for MAXX Migrations. Keep the useful acquisition/transformation/deploy/evidence pieces; avoid a second migration control plane.

## Audit

Compare module-by-module against the ERPNext-derived MAXX backend and CloneFlow before selecting what to merge/wrap/study.