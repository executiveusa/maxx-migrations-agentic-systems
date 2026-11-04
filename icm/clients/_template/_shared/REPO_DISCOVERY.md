# Repository gap discovery — inspect before integrating

The client system may discover candidate code, but must not auto-execute, auto-install, copy unknown-license code or silently change the production stack.

1. Identify a measurable missing capability in a verified client workflow.
2. Search the existing `icm/maxx-suite/REPO_REGISTRY.yaml` first; inspect actual code, tests, interfaces, license, dependencies, maintainers and current release status.
3. Search external GitHub only if existing MACS code cannot meet the job. Record exact repo, commit SHA, license, supply-chain risk, CVEs, maintenance and integration surface.
4. Score candidate `SELL | USE | MERGE | PARK | ARCHIVE` with `icm/maxx-suite/04_product-pipeline/SKILL.md`; prefer WRAP over FORK and existing Paperclip/Hermes/Composio adapters over new code.
5. Create a sandboxed proof with fake/synthetic data, minimal privileges and bounded spend. Record failures and independent review.
6. Promote only through isolated PR, tests, human approval, rollback and direct production evidence. Never ingest client data into unreviewed code.

**Known audit flags:** MAXX Migrations root is an ERPNext/GPLv3-derived tree; review distribution obligations. PARE is Apache-2.0. Paperclip is MIT. Foundry defaults to mock and its bash backend is not a security boundary. ACFS `--mode vibe` enables broad permissions and its license contains an additional rider; do not vendor or run that installer in client production without legal/security review. The existing flywheel VPS bridge returns `launched` without starting an agent; do not count it as a live worker.

Output: missing job, tested candidate, evidence, license decision, selected owner, integration contract, rollback and next action.
