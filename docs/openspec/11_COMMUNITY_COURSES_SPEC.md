# 11 — Community & Courses Spec

## Community (`/app/community`)

Three tabs: Feed (composer + posts with reactions and threaded comments),
Members & Leaderboard (points-sorted), Direct Messages (thread list +
conversation panel). Posting goes through `POST /api/community/posts`;
comments through `POST /api/community/comments`; DMs through
`POST /api/community/dm`. `CommunityPulseArtifact` summarizes live
post/reaction/comment counts.

## Courses (`/app/community/courses`)

Grid of 5 starter courses (Volunteer Onboarding, Donor Stewardship
Basics, Board Member Orientation, Grant Readiness Training, Community
Response Playbook), each with modules → lessons. Detail view
(`/app/community/courses/[courseId]`) is a lesson player: select a
lesson, read its content, mark complete
(`POST /api/courses/[courseId]/progress`), see the progress bar update.
`CourseProgressArtifact` shows enrollment progress across all courses.

## Example organizations

Community content uses five illustrative example organizations
(Community Garden Initiative, Youth Arts Northwest, Housing Justice
Collective, Climate Resilience Lab, Mutual Aid Kitchen) per spec section
8.6 — clearly framed as examples, never presented as real client
testimonials (see `docs/openspec/13` copy rules / `NO_STUB_POLICY.md`).
