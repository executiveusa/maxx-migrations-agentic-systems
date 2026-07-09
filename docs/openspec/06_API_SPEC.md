# 06 — API Spec

All 30 routes live under `apps/maxx-web/app/api/`. Full list:
`icm/11_full_app_completion/FULL_ROUTE_MAP.md`. Conventions:

- Every route with a body validates it against the matching Zod schema
  from `lib/validation/` and returns `{ error: string }` with a 4xx status
  on failure — never a silent 200 on bad input.
- Every mutating route reads/writes through `lib/data/store.ts`, so
  `GET` immediately after a `POST` reflects the new state within the same
  process.
- `/api/health` returns `{ status: "ok", seedMode: boolean, timestamp }` —
  used by `harness:api`'s optional live check and by e2e tests.
- `/api/twilio/voice` returns TwiML (`Content-Type: text/xml`), not JSON —
  it's a Twilio webhook, not a JSON API.
- `/api/twilio/status` and `/api/twilio/sms` are also Twilio webhooks
  (form-encoded bodies via `request.formData()`), driving the missed-call
  text-back and STOP opt-out flows respectively.
- `/api/social/publish` and `/api/social/oauth/callback` are the only
  routes that call out to a real third-party API (Meta Graph API) when
  configured; both degrade to a documented "setup required" response
  otherwise.
- No route returns "not implemented" — every route either does the real
  work, does the real work against seed data, or returns a specific
  setup-required error naming the missing environment variable.
