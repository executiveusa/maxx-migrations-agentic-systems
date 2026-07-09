# Full Route Map (as shipped)

Mirrors `apps/maxx-web/scripts/harness/_shared.mjs` `REQUIRED_ROUTES` and
`REQUIRED_API_ROUTES` — that file is the enforced source of truth; this is
the human-readable copy.

## Public routes (14)

/, /how-it-works, /pricing, /migration-audit, /features,
/features/community, /features/courses, /features/workflows,
/features/social-planner, /features/ghl-import,
/features/missed-call-text-back, /features/website-migration, /privacy,
/terms

## App routes (22)

/app, /app/contacts, /app/pipeline, /app/forms, /app/forms/new,
/app/forms/[formId], /app/workflows, /app/workflows/new,
/app/workflows/[workflowId], /app/community, /app/community/courses,
/app/community/courses/[courseId], /app/social-planner, /app/import/ghl,
/app/missed-calls, /app/migrations, /app/migrations/new,
/app/migrations/[jobId], /app/agents, /app/settings,
/app/settings/integrations, /app/settings/billing

## API routes (30)

/api/health, /api/contacts, /api/pipeline, /api/forms,
/api/forms/[formId], /api/forms/[formId]/submit, /api/workflows,
/api/workflows/[workflowId], /api/workflows/[workflowId]/run,
/api/community/posts, /api/community/comments, /api/community/dm,
/api/courses, /api/courses/[courseId]/progress, /api/social/posts,
/api/social/schedule, /api/social/publish, /api/social/oauth/callback,
/api/import/ghl/upload, /api/import/ghl/map, /api/import/ghl/run,
/api/twilio/voice, /api/twilio/status, /api/twilio/sms,
/api/missed-calls/text-back, /api/migrations/jobs,
/api/migrations/jobs/[jobId], /api/migrations/extract, /api/agents,
/api/agents/[agentId]/run

Verified by `npm run harness:routes` and `npm run harness:api`.
