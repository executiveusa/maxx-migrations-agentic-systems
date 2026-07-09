import type { TelephonyProvider } from "@/lib/integrations/telephony/telephony-provider";
import { TwilioProvider } from "@/lib/integrations/telephony/twilio-provider";
import { MockTelephonyProvider } from "@/lib/integrations/telephony/mock-telephony-provider";
import { mockIntegrationsEnabled } from "@/lib/data/mode";

export * from "@/lib/integrations/telephony/telephony-provider";
export { MockTelephonyProvider } from "@/lib/integrations/telephony/mock-telephony-provider";
export { TwilioProvider } from "@/lib/integrations/telephony/twilio-provider";

export function getTelephonyProvider(): TelephonyProvider {
  const twilio = new TwilioProvider();
  if (twilio.isConfigured()) return twilio;
  if (mockIntegrationsEnabled()) return new MockTelephonyProvider();
  return twilio;
}
