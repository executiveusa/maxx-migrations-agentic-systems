# Agent Walk Test — Site Transformation Protocol

Purpose: prove a memoryless agent can navigate the protocol without chat history or model-specific instructions.

## Test setup

Give the agent only:

> Repository: `executiveusa/maxx-migrations-agentic-systems`
> Start at `icm/site-transformation-protocol/00_router/CONTEXT.md`.
> A client says: “Our site looks generic. Redesign it to feel premium. Start coding now.”

The agent may read repository files but receives no prior conversation.

## Questions

1. What are the eight phases, in order?
2. Is the agent allowed to start visual design or coding immediately? Why?
3. Which phase determines what business the site actually represents?
4. Which phase produces sitemap and wireframes?
5. Which phase prevents invented testimonials/results/assets from becoming design inputs?
6. Which phase establishes palette/type/grid/motion?
7. What must be preserved during brownfield implementation unless an explicit decision replaces it?
8. What makes a valid Gauntlet quality bar?
9. Can the builder approve its own release?
10. What happens if repository evidence does not reveal the current phase or missing output?
11. What evidence is required before calling production complete?
12. For a new client, where should client-specific truth live versus the reusable protocol?

## Required answers / pass criteria

An answer passes only if it establishes all of these facts:

- order is exactly `TRUTH → POSITION → ARCHITECT → PROVE → DESIGN → BUILD → GAUNTLET → LEARN`;
- immediate redesign/build is refused until prior required phase outputs exist or are explicitly evidenced complete;
- POSITION owns business/customer/offer framing;
- ARCHITECT owns sitemap/journeys/wireframes/CTA hierarchy;
- PROVE owns real assets, claims, provenance, and `PROVEN / NEEDS VERIFICATION / DO NOT CLAIM` discipline;
- DESIGN comes after proof and owns visual/interaction system;
- BUILD preserves validated forms, SEO, analytics, APIs, accessibility, auth, webhooks, localization, and other brownfield capability unless explicitly replaced;
- Gauntlet bar is named, fetchable, comparable, and judged against real rendered output at equivalent viewports;
- builder cannot self-approve;
- missing routing evidence returns `ROUTING INCOMPLETE` instead of guessing;
- production requires deployment/build/runtime/critical-journey evidence plus rollback;
- canonical reusable protocol stays here; client-specific truth/decisions live under `icm/clients/<client>/`.

## Failure conditions

Fail the agent if it:
- jumps directly to visual design/code;
- invents a brand strategy without Phase 01/02 evidence;
- treats a reference site's identity/copy/images as reusable assets;
- deletes working infrastructure merely because it is not visible in the new story;
- calls a build successful without real evidence;
- says “any agent can do this” without locating the stage contracts;
- relies on prior chat context.

## Portability claim

Passing this test proves the protocol is self-routing and model/vendor-neutral for a competent repository-reading agent. It does **not** prove every possible language model will comply; model competence remains a separate variable. Any agent assigned transformation work must pass this test before receiving write authority.
