import type { Opportunity, Pipeline } from "@/lib/types/pipeline";
import { currentOrganization } from "@/lib/mock-data/organizations";

const orgId = currentOrganization.id;

export const pipeline: Pipeline = {
  id: "pipeline_donor",
  organizationId: orgId,
  name: "Donor Pipeline",
  stages: [
    { id: "stage_new", pipelineId: "pipeline_donor", name: "New Lead", order: 1 },
    { id: "stage_contacted", pipelineId: "pipeline_donor", name: "Contacted", order: 2 },
    { id: "stage_proposal", pipelineId: "pipeline_donor", name: "Ask Sent", order: 3 },
    { id: "stage_committed", pipelineId: "pipeline_donor", name: "Committed", order: 4 },
    { id: "stage_recurring", pipelineId: "pipeline_donor", name: "Recurring Donor", order: 5 },
  ],
};

export const opportunities: Opportunity[] = [
  { id: "opp_1", organizationId: orgId, pipelineId: pipeline.id, stageId: "stage_new", contactId: "contact_3", contactName: "Renee Castillo", title: "First-time gift inquiry", value: 250, currency: "USD", createdAt: "2026-06-25T08:10:00.000Z", updatedAt: "2026-06-25T08:10:00.000Z" },
  { id: "opp_2", organizationId: orgId, pipelineId: pipeline.id, stageId: "stage_contacted", contactId: "contact_4", contactName: "Tomas Whitfeather", title: "Missed-call lead follow-up", value: 100, currency: "USD", createdAt: "2026-07-01T15:22:00.000Z", updatedAt: "2026-07-01T15:22:00.000Z" },
  { id: "opp_3", organizationId: orgId, pipelineId: pipeline.id, stageId: "stage_proposal", contactId: "contact_1", contactName: "Alicia Ferreira", title: "Recurring gift ask — summer program", value: 1200, currency: "USD", createdAt: "2026-06-01T10:05:00.000Z", updatedAt: "2026-06-20T09:00:00.000Z" },
  { id: "opp_4", organizationId: orgId, pipelineId: pipeline.id, stageId: "stage_committed", contactId: "contact_5", contactName: "Sunny Okoye", title: "Board matching gift", value: 5000, currency: "USD", createdAt: "2026-03-12T13:00:00.000Z", updatedAt: "2026-05-30T13:00:00.000Z" },
  { id: "opp_5", organizationId: orgId, pipelineId: pipeline.id, stageId: "stage_recurring", contactId: "contact_2", contactName: "Marcus Lee", title: "$25/mo kitchen supporter", value: 300, currency: "USD", createdAt: "2026-04-20T11:00:00.000Z", updatedAt: "2026-06-15T11:00:00.000Z" },
];

export function pipelineTotal(): number {
  return opportunities.reduce((sum, o) => sum + o.value, 0);
}
