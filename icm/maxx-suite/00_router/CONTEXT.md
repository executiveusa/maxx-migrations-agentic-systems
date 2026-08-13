# Router

## Load order

1. Read `../REPO_REGISTRY.yaml`.
2. Identify the requested business outcome.
3. Load only the matching repo context below.
4. If the request is a new product/idea/workflow, load `../04_product-pipeline/SKILL.md` before proposing build work.
5. If execution crosses repositories, define one source of truth and explicit interface contract first.

## Routing buckets

- Public brand, SEO, landing pages, blog, forms: `01_core/macs-digital-media/`.
- Customer data, ICM, workflows, approvals, evidence, migrations, agent tools: `01_core/maxx-migrations/`.
- Chat/voice/avatar/operator UX: `01_core/agent-maxx-portal/`.
- Video clipping: `02_products/maxx-clipz/`.
- Social publishing/distribution: `02_products/postiz-maxx-social/`.
- Research: `02_products/maxx-research/`.
- Generative video: `02_products/maxx-edits-vimax/`.
- Video understanding/editing/remaking: `02_products/maxx-video-agent/`.
- Visual agent/workflow authoring: `02_products/maxx-coze-studio/`.
- Website migration primitives: `02_products/maxx-craft/`.
- Scraping/research salvage: `02_products/maxxiescraper/`.

## Hard rule

Do not create another control plane. MACS public site is a storefront, Agent MAXX is the interface, MAXX Migrations is the backend brain.