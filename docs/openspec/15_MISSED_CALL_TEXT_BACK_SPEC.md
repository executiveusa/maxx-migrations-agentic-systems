# 15 — Missed Call Text Back Spec

## Decision logic

`lib/integrations/telephony/mctb-engine.ts` `evaluateMissedCall()` is a
pure function checked in this order: phone configured? → MCTB enabled for
the org? → caller opted out? → template exists? Only if all four pass
does it render the template and return `shouldSend: true`. This exact
order and the opt-out block are covered by
`tests/unit/mctb-engine.test.ts`.

## Compliance

- STOP-family keywords (`stop, unsubscribe, cancel, end, quit`, case
  insensitive) recorded via `isStopMessage()` in
  `POST /api/twilio/sms`, permanently added to `sms_opt_outs`.
- Every missed call produces a `MissedCallEvent` with a `textBackStatus`
  of `sent | opted_out | not_configured | failed` — never silently
  dropped.
- The compliance notice on `/app/missed-calls` states the rule in plain
  language for staff.

## Templates

Three default templates ship (`lib/mock-data/telephony.ts`
`smsTemplates`), each using `{{organizationName}}` / `{{bookingLink}}`
variables rendered by `renderTemplate()`.

## Live sending

`TwilioProvider.sendSms()` makes a real Twilio REST API call when
`TWILIO_ACCOUNT_SID`/`TWILIO_AUTH_TOKEN`/`TWILIO_PHONE_NUMBER` are set;
otherwise returns `status: "setup_required"` with the exact missing
variables named.
