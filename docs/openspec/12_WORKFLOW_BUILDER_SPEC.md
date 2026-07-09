# 12 — Workflow Builder Spec

## Design principle

A workflow is a numbered, ordered list of steps rendered top to bottom —
not a node-and-edge canvas. This is a deliberate UX choice per the build
prompt ("without flowchart spaghetti") so a program director can read and
edit a workflow without learning a diagramming tool.

## Step types (12)

`trigger, condition, wait, send_email, send_sms, create_task,
update_contact, move_pipeline_stage, notify_user, webhook, ai_generate,
human_approval` — `WorkflowStepType` in `lib/types/workflows.ts`.

## Templates (7)

New Donor Follow-Up, Volunteer Onboarding, Missed Call Recovery, Event
Registration Nurture, Grant Application Reminder, Course Completion
Follow-Up, GHL Imported Lead Cleanup — `lib/mock-data/workflows.ts`
`workflowTemplates`.

## Flow

`/app/workflows/new` → choose a template or start from scratch → edit
steps (add/reorder/relabel/remove) → save as draft
(`POST /api/workflows`). `/app/workflows/[workflowId]` → view steps and
run history, toggle active/inactive, run a no-op preview.
`POST /api/workflows/[workflowId]/run` requires `status === "active"`
before recording a run.
