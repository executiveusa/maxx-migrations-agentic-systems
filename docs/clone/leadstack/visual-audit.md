# Visual Audit — LeadStack → Maxx Migrations

No live screenshots captured (see assets-inventory.md — fetch blocked).
This audit documents the *target* visual system Maxx Migrations implements,
derived from the build prompt's design tokens (Emerald Tablets / luxury
minimalism rules), to be diffed against the legacy site once a live capture
is possible.

## Target design system

| Token | Value |
|---|---|
| `--color-bg` | `#0d0f0e` |
| `--color-surface` | `#121714` |
| `--color-surface-2` | `#17211c` |
| `--color-text` | `#f4f7f2` |
| `--color-muted` | `#9aa89f` |
| `--color-accent` | `#10b981` |
| `--color-accent-soft` | `rgba(16, 185, 129, 0.14)` |
| `--color-border` | `rgba(255, 255, 255, 0.10)` |
| `--font-display` | Cormorant Garamond, serif |
| `--font-body` | DM Sans, system-ui, sans-serif |

## Layout principles

- Single accent color discipline — emerald is the only saturated color in
  the UI; everything else is near-monochrome dark surfaces.
- Golden-ratio-influenced vertical rhythm between sections.
- Generous whitespace, large readable type, no dense SaaS-template card
  walls.
- Mobile-first responsive breakpoints checked at 375px / 768px / 1440px.
- `prefers-reduced-motion` respected globally.

## Parity checklist (to run once live capture is possible)

- [ ] Section order matches `section-map.json`
- [ ] Nav item count/grouping matches legacy pattern
- [ ] Pricing tier count (3) and ascending structure matches
- [ ] FAQ topic categories covered
- [ ] Footer link categories covered
- [ ] No legacy "LeadStack" branding remains anywhere in new build
