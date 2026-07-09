# Final Copy Deck — Index

This is the index for every piece of shipped copy in the Maxx Migrations
app. Each linked document is the source of truth for its section; when
copy changes in the app, update the matching document in the same PR.

- [`HOMEPAGE_COPY.md`](./HOMEPAGE_COPY.md) — `/` and the "Recent updates
  shipped to your CRM" section
- [`FEATURE_PAGE_COPY.md`](./FEATURE_PAGE_COPY.md) — all seven
  `/features/*` pages
- [`APP_MICROCOPY.md`](./APP_MICROCOPY.md) — setup-required states, empty
  states, compliance notices, and button labels inside `/app/*`
- [`FAQ.md`](./FAQ.md) — the FAQ block on `/pricing`

## Copy rules enforced across all of the above

- No lorem ipsum, no generic AI hype, no unlabeled placeholder testimonials.
- No overpromising autonomous AI — every AI-driven action is described with
  the human checkpoint that governs it (approval, review, or opt-in).
- Every feature claim maps to a real route: `/features/x` always links to
  `/app/x`, and that route renders working UI, not a stub.
- CTAs are specific verbs ("Start a Migration Audit," "Open Workflow
  Builder"), never generic ("Learn more," "Submit") except as a secondary,
  clearly-scoped link (e.g. "Learn more →" inside a card whose heading
  already states the topic).
