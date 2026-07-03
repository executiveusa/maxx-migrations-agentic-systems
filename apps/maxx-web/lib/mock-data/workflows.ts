import type { Workflow, WorkflowTemplate } from "@/lib/types/workflows";
import { currentOrganization } from "@/lib/mock-data/organizations";

const orgId = currentOrganization.id;

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "tpl_new_donor_follow_up",
    name: "New donor follow-up",
    description: "Thanks a first-time donor and invites them into a recurring gift.",
    category: "Fundraising",
    steps: [
      { type: "trigger", label: "Opportunity moves to Committed" },
      { type: "send_email", label: "Send thank-you email" },
      { type: "wait", label: "Wait 3 days" },
      { type: "send_sms", label: "Send recurring-gift invite" },
      { type: "create_task", label: "Task: personal thank-you call" },
    ],
  },
  {
    id: "tpl_volunteer_onboarding",
    name: "Volunteer onboarding",
    description: "Moves a new volunteer sign-up through orientation and first shift.",
    category: "Volunteers",
    steps: [
      { type: "trigger", label: "Volunteer Sign-Up form submitted" },
      { type: "send_email", label: "Send orientation packet" },
      { type: "create_task", label: "Task: schedule first shift" },
      { type: "update_contact", label: "Tag contact as volunteer" },
    ],
  },
  {
    id: "tpl_missed_call_recovery",
    name: "Missed call recovery",
    description: "Recovers a missed call with an instant text and staff notification.",
    category: "Missed Call Text Back",
    steps: [
      { type: "trigger", label: "Call missed" },
      { type: "send_sms", label: "Send text-back template" },
      { type: "notify_user", label: "Notify on-call staff" },
      { type: "wait", label: "Wait 1 hour" },
      { type: "condition", label: "If no reply, escalate" },
    ],
  },
  {
    id: "tpl_event_registration_nurture",
    name: "Event registration nurture",
    description: "Nurtures a community event registrant through reminders and follow-up.",
    category: "Events",
    steps: [
      { type: "trigger", label: "Event registration form submitted" },
      { type: "send_email", label: "Send confirmation email" },
      { type: "wait", label: "Wait until 1 day before event" },
      { type: "send_sms", label: "Send reminder text" },
      { type: "send_email", label: "Send post-event thank-you" },
    ],
  },
  {
    id: "tpl_grant_application_reminder",
    name: "Grant application reminder",
    description: "Keeps a board member on track for an upcoming grant deadline.",
    category: "Grants",
    steps: [
      { type: "trigger", label: "Grant readiness intake submitted" },
      { type: "create_task", label: "Task: draft narrative" },
      { type: "wait", label: "Wait until 7 days before deadline" },
      { type: "notify_user", label: "Notify grant lead" },
      { type: "human_approval", label: "Approve before submission" },
    ],
  },
  {
    id: "tpl_course_completion_follow_up",
    name: "Course completion follow-up",
    description: "Celebrates a finished course and suggests the next one.",
    category: "Courses",
    steps: [
      { type: "trigger", label: "Course marked complete" },
      { type: "send_email", label: "Send completion certificate" },
      { type: "ai_generate", label: "Draft personalized next-course suggestion" },
      { type: "notify_user", label: "Notify community manager" },
    ],
  },
  {
    id: "tpl_ghl_imported_lead_cleanup",
    name: "GHL imported lead cleanup",
    description: "Normalizes and re-engages leads brought over from a GHL import.",
    category: "GHL Import",
    steps: [
      { type: "trigger", label: "Contact created via GHL import" },
      { type: "condition", label: "If missing tags, apply defaults" },
      { type: "send_email", label: "Send re-introduction email" },
      { type: "webhook", label: "Notify CRM Agent for review" },
    ],
  },
];

export const workflows: Workflow[] = [
  {
    id: "wf_1",
    organizationId: orgId,
    name: "New donor follow-up",
    description: "Thanks a first-time donor and invites them into a recurring gift.",
    templateId: "tpl_new_donor_follow_up",
    status: "active",
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-06-01T00:00:00.000Z",
    steps: [
      { id: "step_1", workflowId: "wf_1", type: "trigger", order: 1, label: "Opportunity moves to Committed", config: {} },
      { id: "step_2", workflowId: "wf_1", type: "send_email", order: 2, label: "Send thank-you email", config: { template: "donor-thank-you" } },
      { id: "step_3", workflowId: "wf_1", type: "wait", order: 3, label: "Wait 3 days", config: { duration: "3d" } },
      { id: "step_4", workflowId: "wf_1", type: "send_sms", order: 4, label: "Send recurring-gift invite", config: { template: "recurring-invite" } },
    ],
    runs: [
      { id: "run_1", workflowId: "wf_1", status: "success", triggeredBy: "Sunny Okoye — Board matching gift", startedAt: "2026-06-01T13:00:00.000Z", finishedAt: "2026-06-04T13:00:00.000Z", stepsCompleted: 4, stepsTotal: 4 },
    ],
  },
  {
    id: "wf_2",
    organizationId: orgId,
    name: "Missed call recovery",
    description: "Recovers a missed call with an instant text and staff notification.",
    templateId: "tpl_missed_call_recovery",
    status: "active",
    createdAt: "2026-04-10T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
    steps: [
      { id: "step_5", workflowId: "wf_2", type: "trigger", order: 1, label: "Call missed", config: {} },
      { id: "step_6", workflowId: "wf_2", type: "send_sms", order: 2, label: "Send text-back template", config: { template: "missed-call-default" } },
      { id: "step_7", workflowId: "wf_2", type: "notify_user", order: 3, label: "Notify on-call staff", config: { user: "Dana Okafor" } },
    ],
    runs: [
      { id: "run_2", workflowId: "wf_2", status: "success", triggeredBy: "Missed call from +15035550199", startedAt: "2026-07-01T15:20:00.000Z", finishedAt: "2026-07-01T15:21:00.000Z", stepsCompleted: 3, stepsTotal: 3 },
    ],
  },
  {
    id: "wf_3",
    organizationId: orgId,
    name: "GHL imported lead cleanup",
    description: "Normalizes and re-engages leads brought over from a GHL import.",
    templateId: "tpl_ghl_imported_lead_cleanup",
    status: "draft",
    createdAt: "2026-06-25T00:00:00.000Z",
    updatedAt: "2026-06-25T00:00:00.000Z",
    steps: [
      { id: "step_8", workflowId: "wf_3", type: "trigger", order: 1, label: "Contact created via GHL import", config: {} },
      { id: "step_9", workflowId: "wf_3", type: "condition", order: 2, label: "If missing tags, apply defaults", config: {} },
    ],
    runs: [],
  },
];

export function getWorkflowById(id: string): Workflow | undefined {
  return workflows.find((w) => w.id === id);
}
