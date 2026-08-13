# MAXX Coze Studio

Repo: `executiveusa/maxx-coze-studio`
Fork source: coze-dev/coze-studio
License observed: Apache-2.0.
Preliminary portfolio decision: `STUDY` as internal builder.

Current upstream-style README describes visual agent/app/workflow building, prompts, RAG, plugins, knowledge bases, databases and API/SDK integration. It also explicitly warns about public-network security risks.

## Suite role

Potential internal no-code/low-code workflow authoring lab for MAXX operators, not the canonical runtime/source of truth.

## Guardrail

Do not expose publicly before an independent auth/SSRF/code-execution/privilege audit. Avoid creating a competing control plane; export useful workflow definitions into MAXX's governed backend where possible.