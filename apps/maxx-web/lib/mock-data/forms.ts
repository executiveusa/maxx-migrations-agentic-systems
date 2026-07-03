import type { CrmForm, FormSubmission } from "@/lib/types/forms";
import { currentOrganization } from "@/lib/mock-data/organizations";

const orgId = currentOrganization.id;

export const forms: CrmForm[] = [
  {
    id: "form_volunteer_signup",
    organizationId: orgId,
    name: "Volunteer Sign-Up",
    slug: "volunteer-signup",
    description: "Collects availability and kitchen skills from new volunteers.",
    status: "published",
    submissionCount: 42,
    createdAt: "2026-02-10T00:00:00.000Z",
    updatedAt: "2026-06-01T00:00:00.000Z",
    fields: [
      { id: "f_1", formId: "form_volunteer_signup", type: "text", label: "Full name", required: true, order: 1 },
      { id: "f_2", formId: "form_volunteer_signup", type: "email", label: "Email", required: true, order: 2 },
      { id: "f_3", formId: "form_volunteer_signup", type: "phone", label: "Phone", required: false, order: 3 },
      { id: "f_4", formId: "form_volunteer_signup", type: "select", label: "Preferred shift", required: true, options: ["Weekday mornings", "Weekday evenings", "Saturday"], order: 4 },
      { id: "f_5", formId: "form_volunteer_signup", type: "textarea", label: "Kitchen or driving experience", required: false, order: 5 },
    ],
  },
  {
    id: "form_donation_interest",
    organizationId: orgId,
    name: "Donation Interest",
    slug: "donation-interest",
    description: "Captures one-time and recurring donor interest from the homepage.",
    status: "published",
    submissionCount: 118,
    createdAt: "2025-12-01T00:00:00.000Z",
    updatedAt: "2026-05-15T00:00:00.000Z",
    fields: [
      { id: "f_6", formId: "form_donation_interest", type: "text", label: "Full name", required: true, order: 1 },
      { id: "f_7", formId: "form_donation_interest", type: "email", label: "Email", required: true, order: 2 },
      { id: "f_8", formId: "form_donation_interest", type: "select", label: "Gift type", required: true, options: ["One-time", "Monthly recurring"], order: 3 },
      { id: "f_9", formId: "form_donation_interest", type: "checkbox", label: "Subscribe to newsletter", required: false, order: 4 },
    ],
  },
  {
    id: "form_grant_readiness",
    organizationId: orgId,
    name: "Grant Readiness Intake",
    slug: "grant-readiness-intake",
    description: "Internal intake for board members preparing new grant applications.",
    status: "draft",
    submissionCount: 0,
    createdAt: "2026-06-28T00:00:00.000Z",
    updatedAt: "2026-06-28T00:00:00.000Z",
    fields: [
      { id: "f_10", formId: "form_grant_readiness", type: "text", label: "Funder name", required: true, order: 1 },
      { id: "f_11", formId: "form_grant_readiness", type: "textarea", label: "Program summary", required: true, order: 2 },
    ],
  },
];

export const formSubmissions: FormSubmission[] = [
  { id: "sub_1", formId: "form_volunteer_signup", data: { "Full name": "Marcus Lee", Email: "marcus.lee@example.org", "Preferred shift": "Saturday" }, createdAt: "2026-06-10T15:00:00.000Z" },
  { id: "sub_2", formId: "form_donation_interest", data: { "Full name": "Alicia Ferreira", Email: "alicia.ferreira@example.org", "Gift type": "Monthly recurring" }, createdAt: "2026-05-02T14:00:00.000Z" },
];

export function getFormById(id: string): CrmForm | undefined {
  return forms.find((f) => f.id === id);
}
