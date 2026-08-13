# MAXX Suite — Canonical Portfolio Router

This folder is the lazy-loaded map for the MAXX ecosystem. It does not duplicate product code. It tells agents which repository owns which job, what to inspect next, and what is core vs. experimental.

## Three surfaces that matter now

1. `executiveusa/macsdigitalmedia` — public MACS Digital Media storefront only.
2. `executiveusa/maxx-migrations-agentic-systems` — canonical MAXX data, ICM, workflow, approval, evidence, migration and agentic backend.
3. `executiveusa/macs-agent-portal` — Agent MAXX customer/operator interface. It should access the backend as a library/control API, never become a second source of truth.

## Operating rule

Do not autoload every MAXX repository. Start at `00_router/CONTEXT.md`, then load only the core/product folder relevant to the current outcome.

Every new product, repo, model, workflow or major idea must pass `04_product-pipeline/SKILL.md` before build work.

## Portfolio zones

- `01_core/` — current three-repo product architecture.
- `02_products/` — reusable product/capability candidates.
- `03_legacy-incubator/` — salvage, quarantine or archive candidates.
- `04_product-pipeline/` — future-facing product-analysis gate.
- `05_go-to-market/` — Pacific Northwest go-to-market and AI social flywheel.
- `06_interfaces/` — contracts between public site, Agent MAXX and backend.
- `working-state/` — next inspections and unresolved decisions.

Secrets are never stored here.