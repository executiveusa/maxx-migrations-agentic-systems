export interface PhoneNumber {
  id: string;
  organizationId: string;
  number: string;
  provider: "twilio";
  mctbEnabled: boolean;
}

export interface CallEvent {
  id: string;
  organizationId: string;
  fromNumber: string;
  toNumber: string;
  direction: "inbound" | "outbound";
  status: "completed" | "missed" | "voicemail";
  durationSeconds: number;
  occurredAt: string;
}

export interface MissedCallEvent {
  id: string;
  callEventId: string;
  contactId?: string;
  fromNumber: string;
  textBackSent: boolean;
  textBackStatus: "sent" | "opted_out" | "not_configured" | "failed";
  occurredAt: string;
}

export interface MctbRule {
  id: string;
  organizationId: string;
  name: string;
  templateId: string;
  active: boolean;
  delaySeconds: number;
}

export interface SmsTemplate {
  id: string;
  organizationId: string;
  name: string;
  body: string;
}

export interface SmsMessage {
  id: string;
  organizationId: string;
  toNumber: string;
  body: string;
  status: "sent" | "failed" | "blocked_opt_out";
  createdAt: string;
}

export interface SmsOptOut {
  id: string;
  organizationId: string;
  phoneNumber: string;
  optedOutAt: string;
}
