# Assets Inventory — LeadStack Clone

Live browser/asset capture was not performed: outbound network access to
`leadstack.dev` returned `HTTP 403` at the proxy `CONNECT` layer for both
the `WebFetch` tool and a direct `curl` attempt (see bead-0003 for the
raw command/response). No HTML, CSS, or image bytes were retrieved from
the live site in this session.

## What this means for asset handling

Per spec §7/§22 (legal/IP guardrails): when source asset capture is
unavailable or ownership is uncertain, **do not fabricate or substitute
third-party imagery** — preserve structure only and use original/licensed
assets for the new build.

## Assets used in this build instead

- Typography: Cormorant Garamond (display) + DM Sans (body) — both
  open-license Google Fonts, loaded via `next/font`, no asset files
  vendored.
- Imagery: none vendored. Hero/feature sections use CSS-only visuals
  (gradients, shapes, icon set) so there is zero risk of carrying over
  copyrighted photography or product screenshots from the legacy site.
- Icons: inline SVG, hand-authored, no icon-pack license to track.

## Follow-up required (tracked, not blocking)

To do a true pixel-level clone (per spec §16 crawler/extractor pipeline),
a human needs to either:
1. Provide an authenticated/allow-listed path to fetch leadstack.dev from
   this environment, or
2. Supply exported HTML/screenshots directly (e.g. via file upload), or
3. Run the migration engine's crawler (Stage 3 stub, see
   `apps/maxx-web/src/lib/migration/crawler.ts`) from an environment with
   outbound access to the target domain.

This gap is logged in bead-0003 with `human_needed: true` is NOT set
because it does not block Stage 1 landing-page rebuild (we have enough
structural detail from the user-supplied spec to proceed), but it DOES
block true pixel-parity verification, which is logged as a known gap in
the final builder report.
