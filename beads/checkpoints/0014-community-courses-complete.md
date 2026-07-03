```yaml
id: bead-0014
timestamp: 2026-07-03T08:30:00Z
actor: claude-build-agent
phase: stage-2
repo: executiveusa/maxx-migrations-agentic-systems
branch: claude/maxx-migrations-full-build-5jh55a
files_changed:
  - apps/maxx-web/components/community/CommunityView.tsx
  - apps/maxx-web/components/courses/CourseDetailView.tsx
  - apps/maxx-web/app/app/community/**/*.tsx
  - apps/maxx-web/app/api/community/**/*.ts
  - apps/maxx-web/app/api/courses/**/*.ts
decision: >
  Implemented Community (feed, composer, comments, reactions, leaderboard,
  direct-message threads) and Courses (module/lesson browser, lesson
  player, progress tracking with server-recorded completion) using the
  five illustrative example organizations named in the spec (Community
  Garden Initiative, Youth Arts Northwest, Housing Justice Collective,
  Climate Resilience Lab, Mutual Aid Kitchen) plus five real starter
  courses (Volunteer Onboarding, Donor Stewardship Basics, Board Member
  Orientation, Grant Readiness Training, Community Response Playbook).
reason: Matches spec 8.6–8.7.
rollback_command: git checkout -- apps/maxx-web/components/community apps/maxx-web/components/courses
risks: []
next_action: Build Social Media Planner (bead-0016).
human_needed: false
```
