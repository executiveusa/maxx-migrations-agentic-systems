```yaml
id: bead-0015
timestamp: 2026-07-03T09:00:00Z
actor: claude-build-agent
phase: stage-2
repo: executiveusa/maxx-migrations-agentic-systems
branch: claude/maxx-migrations-full-build-5jh55a
files_changed:
  - apps/maxx-web/components/workflows/WorkflowBuilder.tsx
  - apps/maxx-web/components/workflows/WorkflowDetailView.tsx
  - apps/maxx-web/lib/mock-data/workflows.ts
  - apps/maxx-web/app/api/workflows/**/*.ts
decision: >
  Built a linear, ordered-step workflow builder (not a node canvas) with
  all 12 required step types (trigger, condition, wait, send_email,
  send_sms, create_task, update_contact, move_pipeline_stage, notify_user,
  webhook, ai_generate, human_approval) and all 7 required templates (New
  Donor Follow-Up, Volunteer Onboarding, Missed Call Recovery, Event
  Registration Nurture, Grant Application Reminder, Course Completion
  Follow-Up, GHL Imported Lead Cleanup). Supports template selection,
  add/edit/reorder/remove steps, activate/deactivate, preview run, and run
  history.
reason: Matches spec 8.5.
rollback_command: git checkout -- apps/maxx-web/components/workflows
risks: []
next_action: Build Social Media Planner (bead-0016).
human_needed: false
```
