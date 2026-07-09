# 10 — CRM Spec

## Contacts (`/app/contacts`)

List, search (name/email), filter (status/tag), create (dialog form,
`contactSchema`), and detail view (notes + timeline) — `ContactsView.tsx`.
Statuses: `lead | active | donor | volunteer | archived`. Sources:
`website_form | ghl_import | manual | missed_call | event | referral`.

## Pipeline (`/app/pipeline`)

Single donor pipeline, 5 stages (New Lead → Contacted → Ask Sent →
Committed → Recurring Donor). Kanban columns with per-stage totals; move
an opportunity between stages via its card's stage selector (no drag
library — keyboard/select-driven for accessibility); create and view
opportunity detail — `PipelineView.tsx`.

## Forms (`/app/forms`)

List, builder (`/app/forms/new` — add/edit/remove fields of type text,
email, phone, textarea, select, checkbox), and detail
(`/app/forms/[formId]` — fields tab, public preview tab, submissions tab,
embed-code tab). Public submission goes through
`POST /api/forms/[formId]/submit`, which enforces the form is
`published` and all required fields are present.

## Persistence

All of the above read/write through `lib/data/store.ts` — see
`docs/openspec/03_ARCHITECTURE.md` for why an in-memory store is the
correct seed-mode substitute here rather than a stub.
