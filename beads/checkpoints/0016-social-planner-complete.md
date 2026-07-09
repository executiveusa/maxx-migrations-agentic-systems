```yaml
id: bead-0016
timestamp: 2026-07-03T09:30:00Z
actor: claude-build-agent
phase: stage-2
repo: executiveusa/maxx-migrations-agentic-systems
branch: claude/maxx-migrations-full-build-5jh55a
files_changed:
  - apps/maxx-web/components/social/SocialPlannerView.tsx
  - apps/maxx-web/lib/integrations/social/*.ts
  - apps/maxx-web/app/api/social/**/*.ts
decision: >
  Built the content calendar (draft/scheduled/published columns), composer
  with campaign templates, and channel selector for Facebook Page and
  Instagram Business. Publishing routes through a provider adapter:
  MetaProvider (real Graph API call, requires META_ACCESS_TOKEN/PAGE_ID),
  PostizAdapter (reference alternative backend), and MockSocialProvider
  (local mode, labeled "Local mock publish completed" — never a silent
  fake success). getSocialProvider() picks Meta if configured, otherwise
  falls back to the mock provider only when MOCK_INTEGRATIONS is enabled.
reason: Matches spec 8.8 and section 6 (MOCK_INTEGRATIONS ground rules).
rollback_command: git checkout -- apps/maxx-web/components/social apps/maxx-web/lib/integrations/social
risks:
  - Meta OAuth callback (app/api/social/oauth/callback) is implemented but
    unverified against a live Meta app since no credentials exist in this
    environment.
next_action: Build GHL Import Wizard (bead-0017).
human_needed: false
```
