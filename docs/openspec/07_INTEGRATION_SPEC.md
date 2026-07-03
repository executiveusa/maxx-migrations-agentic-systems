# 07 — Integration Spec

Every external integration follows the same shape: an interface, a mock
implementation, a real implementation gated by `isIntegrationConfigured()`
(`lib/data/mode.ts`), and a chooser function that picks real-if-configured,
else mock-if-`MOCK_INTEGRATIONS` is enabled, else the real provider's own
setup-required error.

| Integration | Interface | Mock | Real | Chooser |
| --- | --- | --- | --- | --- |
| Social publishing | `lib/integrations/social/social-provider.ts` | `MockSocialProvider` | `MetaProvider` (Graph API), `PostizAdapter` (reference alt backend) | `getSocialProvider()` |
| Telephony (SMS) | `lib/integrations/telephony/telephony-provider.ts` | `MockTelephonyProvider` | `TwilioProvider` (REST API) | `getTelephonyProvider()` |
| Missed-call decision logic | `lib/integrations/telephony/mctb-engine.ts` | n/a — pure function | n/a | `evaluateMissedCall()` / `runMissedCallTextBack()` |
| GHL import | `lib/import/ghl/types.ts` | `MockGhlProvider` | `GhlApiProvider` | selected explicitly by wizard step (CSV always available) |

Required env vars per integration are documented in `.env.example` and
checked by `harness:env`. `getIntegrationConnections()`
(`lib/mock-data/integrations.ts`) computes live `connected` /
`setup_required` status per provider for `/app/settings/integrations`.
