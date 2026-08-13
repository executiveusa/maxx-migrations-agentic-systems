# Agent MAXX Portal — Interface

Repo: `https://github.com/executiveusa/macs-agent-portal`
Vercel project: `macs-agent-portal` (`prj_OkH9RAV46Ocr7zXxLZHKYJWt234c`)
Observed latest deployment: READY preview, `target: null`, `live: false`.

## Job

Agent MAXX customer/operator surface: chat, voice, avatar, next actions, approvals, summaries and access to the customer's Company Brain through the MAXX backend.

## Existing strengths

- Vite + React + shadcn/Tailwind surface.
- Existing `AGENTS.md` already requires lazy-loading reference buckets rather than loading everything.
- Repo includes agent/runtime and deployment documentation.

## Immediate risk

A root `.env` file is committed in this public repository. Do not read or reproduce its values in agent context. Treat it as a potential secret exposure until a security audit proves otherwise; rotate any real credentials found.

## Boundary

Agent MAXX should not become a second database/control plane. It requests tenant-scoped context and actions from MAXX Migrations through authenticated APIs. Consequential actions use persisted approval/evidence gates.

## UX north star

Nontechnical founder says the outcome in normal language. MAXX discovers what it can, asks only material decisions, does safe reversible work, presents one next action, and asks for judgment only where human authority is required.