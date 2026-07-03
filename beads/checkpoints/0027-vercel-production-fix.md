id: bead-0027
timestamp: 2026-07-03T00:00:00Z
actor: ChatGPT
phase: deployment-fix
repo: executiveusa/maxx-migrations-agentic-systems
branch: develop
files_changed:
  - vercel.json
  - docs/deployment/VERCEL_MONOREPO_FIX.md
decision: Add root-level Vercel fallback configuration so the existing Vercel project builds apps/maxx-web instead of the root ERPNext/Frappe Python project.
reason: Vercel was building the repository root and failing with "No python entrypoint found" because it detected pyproject.toml. The deployable Maxx Migrations Next.js app lives in apps/maxx-web.
rollback_command: git revert ac9bb3912b5444ed66c44942a738ac6f19124a5a && git revert 1afacd0d5f88e2faea31bec68fe618e1c08203c4
risks:
  - Vercel may still require the project Root Directory setting to be changed manually to apps/maxx-web if it ignores repository-level fallback settings.
  - Production deployment status could not be verified through Vercel MCP because the connector is not authenticated to the the-pauli-effect scope.
next_action: Watch the next Vercel deployment from develop. If it still fails, set Vercel Root Directory to apps/maxx-web in the dashboard and redeploy.
human_needed: true
