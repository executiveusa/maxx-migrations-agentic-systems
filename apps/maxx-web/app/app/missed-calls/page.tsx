import type { Metadata } from "next";
import { getStore } from "@/lib/data/store";
import { callEvents, missedCallEvents, phoneNumbers, smsTemplates } from "@/lib/mock-data/telephony";
import { isIntegrationConfigured } from "@/lib/data/mode";
import { MissedCallsView } from "@/components/missed-calls/MissedCallsView";

export const metadata: Metadata = { title: "Missed Calls" };
export const dynamic = "force-dynamic";

export default function MissedCallsPage() {
  const { mctbRules, smsOptOuts } = getStore();
  const twilioConfigured = isIntegrationConfigured("TWILIO_ACCOUNT_SID");
  return (
    <MissedCallsView
      callEvents={callEvents}
      missedCallEvents={missedCallEvents}
      phoneNumbers={phoneNumbers}
      rules={mctbRules}
      templates={smsTemplates}
      optOuts={smsOptOuts}
      twilioConfigured={twilioConfigured}
    />
  );
}
