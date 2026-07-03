import type {
  CallEvent,
  MctbRule,
  MissedCallEvent,
  PhoneNumber,
  SmsOptOut,
  SmsTemplate,
} from "@/lib/types/telephony";
import { currentOrganization } from "@/lib/mock-data/organizations";

const orgId = currentOrganization.id;

export const phoneNumbers: PhoneNumber[] = [
  { id: "phone_1", organizationId: orgId, number: "+15035550100", provider: "twilio", mctbEnabled: false },
];

export const smsTemplates: SmsTemplate[] = [
  { id: "tmpl_default", organizationId: orgId, name: "Default missed-call reply", body: "Sorry we missed your call. This is {{organizationName}}. How can we help?" },
  { id: "tmpl_thanks", organizationId: orgId, name: "Thanks for calling", body: "Thanks for calling {{organizationName}}. Reply here and our team will follow up." },
  { id: "tmpl_booking", organizationId: orgId, name: "Booking link", body: "Sorry we missed you. Want to book a time? {{bookingLink}}" },
];

export const mctbRules: MctbRule[] = [
  { id: "rule_1", organizationId: orgId, name: "Default text-back", templateId: "tmpl_default", active: false, delaySeconds: 30 },
];

export const callEvents: CallEvent[] = [
  { id: "call_1", organizationId: orgId, fromNumber: "+15035550199", toNumber: "+15035550100", direction: "inbound", status: "missed", durationSeconds: 0, occurredAt: "2026-07-01T15:20:00.000Z" },
  { id: "call_2", organizationId: orgId, fromNumber: "+15035550212", toNumber: "+15035550100", direction: "inbound", status: "completed", durationSeconds: 184, occurredAt: "2026-06-29T10:12:00.000Z" },
  { id: "call_3", organizationId: orgId, fromNumber: "+15035550233", toNumber: "+15035550100", direction: "inbound", status: "missed", durationSeconds: 0, occurredAt: "2026-06-28T18:45:00.000Z" },
];

export const missedCallEvents: MissedCallEvent[] = [
  { id: "mc_1", callEventId: "call_1", contactId: "contact_4", fromNumber: "+15035550199", textBackSent: true, textBackStatus: "sent", occurredAt: "2026-07-01T15:20:00.000Z" },
  { id: "mc_2", callEventId: "call_3", fromNumber: "+15035550233", textBackSent: false, textBackStatus: "not_configured", occurredAt: "2026-06-28T18:45:00.000Z" },
];

export const smsOptOuts: SmsOptOut[] = [
  { id: "optout_1", organizationId: orgId, phoneNumber: "+15035559999", optedOutAt: "2026-05-01T00:00:00.000Z" },
];
