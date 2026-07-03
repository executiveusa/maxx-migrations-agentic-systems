import type { Contact } from "@/lib/types/contacts";
import { currentOrganization } from "@/lib/mock-data/organizations";

const orgId = currentOrganization.id;

export const contacts: Contact[] = [
  {
    id: "contact_1",
    organizationId: orgId,
    firstName: "Alicia",
    lastName: "Ferreira",
    email: "alicia.ferreira@example.org",
    phone: "+15035550142",
    tags: ["monthly-donor", "newsletter"],
    status: "donor",
    source: "website_form",
    createdAt: "2026-05-02T14:00:00.000Z",
    updatedAt: "2026-06-20T09:00:00.000Z",
    notes: [
      { id: "note_1", contactId: "contact_1", authorName: "Dana Okafor", body: "Wants to set up a recurring gift for the summer meal program.", createdAt: "2026-06-01T10:00:00.000Z" },
    ],
    timeline: [
      { id: "tl_1", contactId: "contact_1", type: "form_submission", summary: "Submitted donation interest form", createdAt: "2026-05-02T14:00:00.000Z" },
      { id: "tl_2", contactId: "contact_1", type: "email", summary: "Sent welcome sequence email 1", createdAt: "2026-05-03T09:00:00.000Z" },
    ],
  },
  {
    id: "contact_2",
    organizationId: orgId,
    firstName: "Marcus",
    lastName: "Lee",
    email: "marcus.lee@example.org",
    phone: "+15035550187",
    tags: ["volunteer", "kitchen-crew"],
    status: "volunteer",
    source: "manual",
    createdAt: "2026-04-18T11:00:00.000Z",
    updatedAt: "2026-06-15T11:00:00.000Z",
    notes: [],
    timeline: [
      { id: "tl_3", contactId: "contact_2", type: "call", summary: "Confirmed Saturday shift availability", createdAt: "2026-06-10T16:00:00.000Z" },
    ],
  },
  {
    id: "contact_3",
    organizationId: orgId,
    firstName: "Renee",
    lastName: "Castillo",
    email: "renee.castillo@example.org",
    tags: ["ghl-import"],
    status: "lead",
    source: "ghl_import",
    createdAt: "2026-06-25T08:00:00.000Z",
    updatedAt: "2026-06-25T08:00:00.000Z",
    notes: [],
    timeline: [
      { id: "tl_4", contactId: "contact_3", type: "workflow", summary: "Entered GHL imported lead cleanup workflow", createdAt: "2026-06-25T08:05:00.000Z" },
    ],
  },
  {
    id: "contact_4",
    organizationId: orgId,
    firstName: "Tomas",
    lastName: "Whitfeather",
    email: "tomas.w@example.org",
    phone: "+15035550199",
    tags: ["missed-call"],
    status: "lead",
    source: "missed_call",
    createdAt: "2026-07-01T15:20:00.000Z",
    updatedAt: "2026-07-01T15:21:00.000Z",
    notes: [],
    timeline: [
      { id: "tl_5", contactId: "contact_4", type: "sms", summary: "Missed call text-back sent automatically", createdAt: "2026-07-01T15:21:00.000Z" },
    ],
  },
  {
    id: "contact_5",
    organizationId: orgId,
    firstName: "Sunny",
    lastName: "Okoye",
    email: "sunny.okoye@example.org",
    tags: ["board-member"],
    status: "active",
    source: "event",
    createdAt: "2026-03-11T13:00:00.000Z",
    updatedAt: "2026-05-30T13:00:00.000Z",
    notes: [],
    timeline: [],
  },
];

export function getContactById(id: string): Contact | undefined {
  return contacts.find((c) => c.id === id);
}
