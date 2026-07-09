# No-Stub Policy

Banned in `app/`, `components/`, and `lib/` (enforced by
`scripts/harness/no-stubs.mjs`): `TODO`, `FIXME`, `stub`, placeholder copy,
`lorem`, `coming soon`, `fake`, `dummy`, `mock only`, `not implemented`,
`under construction`, `href="#"`, `javascript:void(0)`, `console.log`.

## The one allowed exception

`MOCK_INTEGRATIONS=true` (default) is a local safety mode for external
APIs when credentials are missing. It is allowed because it never fakes
success silently: every mock path returns a clearly-labeled local-mode
message, and every path that needs real credentials returns a
"setup required" state instead. This is the literal wording of the
exception in the build prompt, and it's why `no-stubs.mjs` bans the phrase
"mock only" rather than the word "mock" itself.

## What happened when this was enforced

Two real violations were found and fixed during this stage, not
theoretical ones:

1. `components/landing/NonprofitUseCases.tsx` shipped with literal
   `"Placeholder — real testimonial pending client engagement."` copy —
   rewritten as clearly-labeled illustrative examples per the spec's
   testimonial rule.
2. Marketing copy on `/features/social-planner` used the word "fake" in a
   sentence describing correct behavior ("No fake publish confirmations")
   — reworded to "Publish status is always accurate" since the banned-word
   scan can't distinguish "this describes an anti-pattern" from "this is
   an anti-pattern."

Both are documented here rather than silently patched so future
maintainers understand why the wording looks the way it does.
