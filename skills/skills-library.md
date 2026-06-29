# Skills Agent Library Report

**Normalized skill/source count:** 76

**Purpose:** This report organizes the source list into a usable skills library for a repo-aware Skills Agent. The agent should not install everything. It should inspect a repo first, detect the repo type, and select only the smallest high-leverage skill chain needed for that repo.

**Confidence policy:** Entries marked `low` or `verify first` are treated as candidate sources until the repo is inspected. Entries that touch auth, secrets, deploys, payments, user data, or production databases require explicit human approval before live execution.

## Category Map

| Category | Count | What this category is for |
|---|---:|---|
| Agent Conversion / Engineering | 1 | Tools that convert software, processes, or engineering knowledge into agent-operable systems. |
| Agent Harness / Autonomous Loop | 3 | Runtimes and loops that let coding agents keep working across long tasks, PRDs, or multi-step execution. |
| Agent Harness / Claude Code | 2 | Claude Code-specific setup patterns, harnesses, and environment conventions. |
| Agent Harness / Evaluation | 1 | Harnesses for evaluating agent work, workflows, and task execution reliability. |
| Agent Rules / Governance | 1 | Durable rulebooks and operating policies that keep agents consistent across repos. |
| Agent Runtime / Toolkit | 1 | General-purpose runtime/toolkit layer for reusable AI-agent operations. |
| Backend / Data / Infra | 2 | Backend, database, storage, auth, and infrastructure integration skills. |
| Browser / Web Automation | 1 | Browser-control skills for letting agents operate, inspect, and test real websites. |
| Cloud Agent Platform | 1 | Deployable platforms for background coding agents and web-controlled agent operations. |
| Content / Growth | 1 | Content strategy, idea generation, and campaign planning sources. |
| Content / Media / Publishing | 2 | Media generation, podcast, UGC, and publishing-related skills. |
| Content / Publishing Automation | 1 | Social publishing and scheduling systems for automated distribution. |
| Core Skill Library | 4 | Reusable SKILL.md libraries and pattern collections that teach how to package agent capabilities. |
| Decision / Optimization | 1 | Decision support and option-routing utilities. |
| Design Taste / Review | 4 | Taste, UI, UX, brand, and product-quality review skills. |
| Docs / Current Code Context | 1 | Current documentation retrieval for frameworks, APIs, and libraries. |
| Docs / Document Generation | 1 | Programmatic document creation tools. |
| Docs / Knowledge / Training | 3 | Tools for turning repos or long references into lessons, docs, glossaries, or training material. |
| Docs / Repo Summaries | 1 | Compact repo/file summarization formats for efficient agent intake. |
| Execution / Project Management | 1 | Skills that turn vague work into concrete task loops and shipping systems. |
| Execution / Task Routing | 1 | Task routing and interchangeable execution utilities. |
| Handoff / Context Compression | 1 | Skills for moving context, decisions, and next actions across sessions or models. |
| Human / Avatar / Social AI | 3 | Digital-human, avatar, character, and social-interaction systems. |
| Knowledge Graph / Repo Map | 1 | Graph and relationship mapping over code, docs, and product systems. |
| LLM Provider / Model Routing | 3 | Model/provider catalogs and routing utilities for cost, quality, and availability decisions. |
| MCP / Interactive Apps | 1 | MCP app/UI protocol sources for rich interactive agent tools. |
| MCP / Research Tools | 1 | Research and web-retrieval MCP integrations. |
| MCP / Tool Bridges | 1 | Bridges that expose MCP tools through CLI or terminal workflows. |
| Observability / Agent Collaboration | 1 | Coordination and collaboration tools for multiple agents and experiments. |
| Observability / Agent Hooks | 1 | Hooks and telemetry for tracking agent behavior inside coding workflows. |
| Observability / Control Surface | 1 | Dashboards and control planes for monitoring coding-agent fleets. |
| QA / Code Review | 1 | Review and critique skills for code quality and PR gates. |
| QA / Formal Verification | 1 | Formal verification and model checking for high-risk stateful systems. |
| QA / Review Workflow | 1 | Staged review, approval, and release gate tooling. |
| QA / Testing | 1 | End-to-end and user-journey testing skills. |
| Refactor / Code Simplification | 1 | Targeted simplification, cleanup, and maintainability-improvement skills. |
| Repo Company / Work Memory | 1 | Persistent company/repo memory and decision-tracking layers. |
| Repo Intelligence / Code Search | 3 | Code indexing, semantic/structural search, and targeted retrieval skills. |
| Repo Intelligence / Knowledge Extraction | 1 | Deep repo understanding and explainability tools. |
| Repo Intelligence / Open Source | 1 | Open-source package/repo exploration sources. |
| Security / Secrets | 1 | Secret-management and security reference sources. |
| Skill Creation / Knowledge Distillation | 1 | Skills that transform books, references, and documents into reusable agent knowledge. |
| Skill Runtime / API | 1 | APIs/runtimes that expose skills as callable services. |
| Studio-Owned Skills / Pauli Stack | 4 | Pauli-owned repos and operating assets for the internal studio stack. |
| Studio-Owned Skills / Vision | 1 | Pauli-owned visual/multimodal repo assets. |
| UI / Design Canvas | 1 | Canvas/design-board systems for visual product planning. |
| UI / Frontend / Components | 1 | Component and layout helper skills. |
| UI / Frontend / Design Systems | 1 | Native-feel, design-system, and polish skills for frontend apps. |
| UI / Frontend / Generation | 1 | Schema/API-to-UI generation skills. |
| UI / Frontend / Rendering | 1 | Canvas/rendering references for visual UI surfaces. |
| UI / Motion | 1 | Animation and motion tooling. |
| Voice / Realtime Assistant | 1 | Realtime voice/assistant interaction patterns. |
| Workflow Engine / Durable State | 1 | Durable workflow/state/retry systems for long-running jobs. |
| Writing / Quality Rules | 1 | Writing-quality rules that prevent generic AI copy and improve public-facing text. |

## Repo Skill Router Default Stack

For unknown repos, start with **repo intelligence first**, then add only the specialized lane that matches the repo. A safe default shortlist is:

- **jcodemunch-mcp** — Token-efficient MCP server for indexing repos with tree-sitter and retrieving precise symbols/classes/functions.
- **ast-grep-mcp** — AST-grep MCP for structural code search and precise refactors across supported languages.
- **Understand-Anything** — Discovery and understanding tool for turning complex repos or knowledge sources into explainable maps/wikis.
- **context7** — Current, version-specific documentation and code examples for coding agents via MCP/CLI/SDK.
- **claude-handoff** — Handoff pattern for transferring project state, decisions, and next actions across model/session boundaries.
- **agent-rules-books** — Rules-books source for establishing durable coding-agent policies, style, and repo conventions.
- **pauli-taste-skill** — Studio-owned taste rubric for evaluating UI, brand, layout, and product polish.
- **impeccable** — Quality/taste review source for pushing frontends toward high-polish UX and implementation quality.
- **no_ai_slop_writing_rules** — Ruleset for reducing generic AI writing and enforcing clearer human-readable copy.

This file serves as the central reference for all skills available to agents working in this repository.
