# Browser Audit Prompt — LeadStack Full-Site Inspection

Hand this prompt to a browser-capable agent (Playwright/computer-use/MCP
browser tool with real outbound network access — this build session's own
fetch to leadstack.dev is blocked at the network/proxy level, see
`beads/checkpoints/0003-leadstack-clone-inventory.md`).

---

## Role

You are a site-audit agent. Your job is to inspect **every reachable page**
of `https://www.leadstack.dev/` and produce a structured gap report against
an already-in-progress rebuild called **Maxx Migrations**. You are not
writing copy and you are not designing anything — you are documenting what
exists so a build agent can close gaps accurately.

## Hard rule on copyrighted content

Do **not** reproduce the site's marketing copy verbatim in blocks longer
than ~10–15 words. Paraphrase and summarize intent, tone, and structure
instead. Exact strings are fine ONLY for short UI microcopy that's
functionally necessary to replicate (e.g. a button label like "Book a
Demo", a nav item like "Pricing", a pricing-tier name). Do not quote full
paragraphs, full FAQ answers, or full testimonials verbatim — summarize
their topic and structure instead.

## Step 1 — Discover every page

1. Start at `https://www.leadstack.dev/`.
2. Check `https://www.leadstack.dev/robots.txt` and
   `https://www.leadstack.dev/sitemap.xml` for a full route list.
3. Crawl every link in the main nav, footer, and in-page anchors
   (e.g. `#how-it-works`).
4. Try common likely routes if not found via crawl: `/pricing`,
   `/features`, `/about`, `/contact`, `/login`, `/signup`, `/blog`,
   `/case-studies`, `/demo`.
5. Produce a flat route list with page titles and one-line purpose for
   each.

## Step 2 — For each page, document

- **Section order** (top to bottom), with a one-line purpose per section
  (not copy).
- **Component patterns**: card grids, accordions, carousels, modals,
  sticky nav, embedded calendars/chat widgets, video embeds, forms (list
  every field + field type + validation behavior you can observe).
- **Headline/subhead structure**: sentence length, claim type (outcome
  claim vs. feature claim vs. social proof), NOT the literal text beyond
  short illustrative fragments.
- **CTA copy patterns**: exact short CTA button labels (these are fine to
  quote verbatim, they're functional UI strings), and where each CTA
  routes to.
- **Pricing structure**: number of tiers, tier names, exact prices and
  billing cadence (factual data, not copyrighted), what's included per
  tier (as a feature list, paraphrased if the source uses marketing
  prose), any comparison-table structure, any "most popular" badge logic.
- **FAQ**: list every question topic (you may quote the question text
  verbatim since questions are short/functional; summarize each answer in
  one sentence rather than quoting it).
- **Reviews/testimonials**: do not quote testimonial text. Just note how
  many are shown, what format (carousel/grid/single), and what metadata
  accompanies each (name, org, photo, rating).
- **Footer**: list every link, grouped by column heading.
- **Visual design**: color palette (hex if visible in devtools), font
  stack, spacing rhythm, border-radius scale, animation/transition use,
  dark/light mode, iconography style.
- **Responsive behavior**: how nav collapses on mobile, how pricing cards
  stack, breakpoints if inferable.
- **Metadata**: `<title>`, meta description, Open Graph tags, favicon,
  any analytics/tracking scripts present (name only, e.g. "Google
  Analytics", "Intercom widget" — don't extract tracking IDs).
- **Accessibility spot-check**: are images missing alt text, is contrast
  visibly low anywhere, is the page keyboard-navigable.

## Step 3 — Diff against the current Maxx Migrations build

The build currently implements (paraphrased structure only — this is our
own original content, safe to compare against):

- Pages: `/` (home), `/how-it-works`, `/pricing`. **Not yet built:**
  `/migration-audit`, dashboard routes.
- Home page section order: announcement bar → main nav → hero → proof
  panel (org-type chips) → how-it-works (4 numbered steps) → migration
  cockpit preview (dashboard mockup) → feature stack (6 feature cards) →
  nonprofit use cases (3 testimonial placeholders) → pricing (3 tiers) →
  FAQ (5 accordion items) → final CTA → footer (3-column + compliance
  note).
- Pricing: 3 tiers — Migration Audit ($497 one-time), Sovereign Install
  ($4,800–$8,000 one-time, marked featured), AI Technology Partner
  ($12,000+ install + optional $500–$2,500/mo).
- Design tokens: dark canvas (`#0d0f0e`), single emerald accent
  (`#10b981`), Cormorant Garamond display font + DM Sans body font.

For each gap you find, classify it as one of:

- **Missing page** — exists on leadstack.dev, has no equivalent in the
  build yet.
- **Missing section** — exists on a page we do have, but our version
  skips it.
- **Missing component pattern** — a UI mechanism (e.g. comparison table,
  carousel, sticky CTA bar, live chat widget) we haven't implemented.
- **Copy gap** — a *topic or claim type* our copy doesn't cover (e.g. "the
  source site has an explicit data-export/portability FAQ answer and ours
  doesn't address portability at all"). Describe the gap as a topic, not
  as missing literal text.

## Output format

Write the report as markdown with this structure:

```markdown
# LeadStack Browser Audit Report

## Route map
| Route | Title | Purpose |
|---|---|---|

## Per-page breakdown
### <route>
- Sections (ordered list, one-line purpose each)
- Components/patterns observed
- Forms observed (fields + validation)
- Pricing/FAQ/footer detail (if present on this page)

## Visual system observed
(palette, fonts, spacing, motion, responsive notes)

## Gap report vs. Maxx Migrations build
| Gap | Type | Page/Section it affects | Suggested action |
|---|---|---|---|

## Anything blocked
(pages that errored, required login, were rate-limited, etc.)
```

Save the completed report to
`docs/clone/leadstack/browser-audit-report.md` in the
`executiveusa/maxx-migrations-agentic-systems` repo, on branch
`claude/exciting-knuth-r1yf6s`, and note its existence in a new Beads
checkpoint (`beads/checkpoints/0005-browser-audit-report.md`) following the
format in `beads/BEADS_PROTOCOL.md`.
