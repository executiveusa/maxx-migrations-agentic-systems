export type ContactSource =
  | "website_form"
  | "ghl_import"
  | "manual"
  | "missed_call"
  | "event"
  | "referral";

export type ContactStatus = "lead" | "active" | "donor" | "volunteer" | "archived";

export interface ContactNote {
  id: string;
  contactId: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface ContactTimelineEvent {
  id: string;
  contactId: string;
  type: "note" | "email" | "sms" | "call" | "stage_change" | "form_submission" | "workflow";
  summary: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  tags: string[];
  status: ContactStatus;
  source: ContactSource;
  createdAt: string;
  updatedAt: string;
  notes: ContactNote[];
  timeline: ContactTimelineEvent[];
}
