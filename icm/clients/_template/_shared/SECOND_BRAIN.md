# Second brain and self-improving wiki — source of truth policy

## Inputs
Client-approved CRM, documents, interviews, website, connected app exports, and uploaded ChatGPT/Claude archives. No automatic scraping of private provider accounts. Obtain consent, purpose, data classification, retention and deletion instructions before ingestion.

## Safe pipeline
1. Upload to a private, encrypted object store; malware/format scan, size limits, checksum, immutable source ID and quarantine.
2. Parse in bounded streaming jobs; redact or quarantine secrets, health/financial identifiers and third-party private data according to client policy.
3. Extract entities, relations, dates and claims with document/page/message provenance and confidence. Deduplicate without deleting original evidence.
4. Store source pointers and approved canonical records in tenant-isolated Postgres. Use pgvector for semantic retrieval only when required; graph edges can start in relational tables.
5. Draft Markdown/Obsidian notes with wikilinks and YAML metadata; produce LLM wiki summaries and optional OpenViking indexes as regenerable projections.
6. Human/independent review promotes material claims from INFERENCE to FACT or DECISION. A self-evolving wiki may propose updates but cannot silently rewrite verified truth.
7. Record retrieval quality, outdated claims, conflicts, access, ingestion costs and deletions; reindex on source revision.

## Required fields
`tenant_id, object_id, type, title, source_system, source_locator, source_checksum, observed_at, classification, status, confidence, reviewed_by, review_by, relations[]`.

## Security and portability
Raw exports, embeddings, customer content and credentials stay outside Git. The private client repo stores only contracts, source references and approved non-sensitive notes. Enforce per-tenant keys, RLS, access audit, backups, retention, deletion and a tested export/restore path. A customer may export Markdown, graph JSON, records and source manifests on exit.

## Obsidian
An Obsidian vault is a readable *view* of the knowledge graph. Wikilinks make relationships visible. The vault does not override the CRM, source documents, or approved database records.
