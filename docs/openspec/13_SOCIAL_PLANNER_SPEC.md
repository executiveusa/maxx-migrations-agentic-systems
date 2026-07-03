# 13 — Social Planner Spec

## Channels

`facebook_page`, `instagram_business` only (`SocialChannel` in
`lib/types/social.ts`) — no scraping, no unsupported networks.

## Flow

`/app/social-planner` shows three columns (Drafts, Scheduled, Published)
computed from `SocialPost.status`. The composer lets a user pick a
campaign template (Weekly Meal Count, Volunteer Shoutout, Donation
Appeal — `lib/mock-data/social.ts`), select channels, write copy (2200
char cap, matching `socialPostSchema`), and set a schedule time
(`POST /api/social/schedule`). "Publish now" calls
`POST /api/social/publish`, which routes through `getSocialProvider()`.

## Honesty rule

`MockSocialProvider.publish()` returns `status: "published"` with message
`"Local mock publish completed for {channels}."` — never silent, always
labeled as local. `MetaProvider.publish()` returns `status:
"setup_required"` with a specific message naming the missing env vars
when unconfigured, or makes a real Graph API POST when configured.
