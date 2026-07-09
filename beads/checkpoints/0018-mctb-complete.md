```yaml
id: bead-0018
timestamp: 2026-07-03T10:30:00Z
actor: claude-build-agent
phase: stage-2
repo: executiveusa/maxx-migrations-agentic-systems
branch: claude/maxx-migrations-full-build-5jh55a
files_changed:
  - apps/maxx-web/components/missed-calls/MissedCallsView.tsx
  - apps/maxx-web/lib/integrations/telephony/*.ts
  - apps/maxx-web/app/api/twilio/**/*.ts
  - apps/maxx-web/app/api/missed-calls/text-back/route.ts
decision: >
  Built the missed-call table, rule editor, template editor, opt-out list,
  and webhook event log, backed by lib/integrations/telephony/mctb-engine.ts
  — a pure decision function (evaluateMissedCall) that only sends when the
  organization has MCTB enabled, a phone number is configured, and the
  caller has not opted out, checked in that order. /api/twilio/sms honors
  STOP-family keywords by recording a permanent opt-out; /api/twilio/status
  runs the same evaluateMissedCall path on real Twilio call-status
  webhooks. TwilioProvider makes a real Twilio REST call when credentials
  exist; otherwise sendSms returns a "setup required" result.
reason: Matches spec 8.10. The opt-out block is covered by
  tests/unit/mctb-engine.test.ts ("blocks a number that has opted out").
rollback_command: git checkout -- apps/maxx-web/components/missed-calls apps/maxx-web/lib/integrations/telephony
risks: []
next_action: Build Website Migration Engine (bead-0019).
human_needed: false
```
