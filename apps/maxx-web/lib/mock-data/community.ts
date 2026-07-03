import type { CommunityMember, CommunityPost, DirectMessageThread } from "@/lib/types/community";

export const communityOrganizationExamples = [
  "Community Garden Initiative",
  "Youth Arts Northwest",
  "Housing Justice Collective",
  "Climate Resilience Lab",
  "Mutual Aid Kitchen",
];

export const communityMembers: CommunityMember[] = [
  { id: "cm_1", name: "Dana Okafor", role: "Organizer", avatarInitial: "D", points: 1240 },
  { id: "cm_2", name: "Miguel Santos", role: "Kitchen Lead", avatarInitial: "M", points: 980 },
  { id: "cm_3", name: "Priya Nair", role: "Volunteer Coordinator", avatarInitial: "P", points: 860 },
  { id: "cm_4", name: "Jordan Ruiz", role: "Volunteer", avatarInitial: "J", points: 540 },
  { id: "cm_5", name: "Aiyana Whitehorse", role: "Board Member", avatarInitial: "A", points: 410 },
];

export const communityPosts: CommunityPost[] = [
  {
    id: "post_1",
    organizationId: "org_riverside_mutual_aid",
    authorId: "cm_1",
    authorName: "Dana Okafor",
    body: "We served 412 meals this week — a new record for the summer program. Thank you to every volunteer who showed up on the hottest day of the year.",
    reactionCount: 28,
    createdAt: "2026-07-01T18:00:00.000Z",
    comments: [
      { id: "cmt_1", postId: "post_1", authorId: "cm_3", authorName: "Priya Nair", body: "So proud of this crew!", createdAt: "2026-07-01T18:30:00.000Z" },
    ],
  },
  {
    id: "post_2",
    organizationId: "org_riverside_mutual_aid",
    authorId: "cm_2",
    authorName: "Miguel Santos",
    body: "Reminder: Saturday's shift starts at 7am sharp — we're prepping for the Community Garden Initiative produce delivery.",
    reactionCount: 14,
    createdAt: "2026-06-28T09:00:00.000Z",
    comments: [],
  },
  {
    id: "post_3",
    organizationId: "org_riverside_mutual_aid",
    authorId: "cm_5",
    authorName: "Aiyana Whitehorse",
    body: "Board approved the grant match for the Housing Justice Collective co-op kitchen build. Details in the Grants course module.",
    reactionCount: 21,
    createdAt: "2026-06-20T15:00:00.000Z",
    comments: [
      { id: "cmt_2", postId: "post_3", authorId: "cm_4", authorName: "Jordan Ruiz", body: "This is huge news.", createdAt: "2026-06-20T15:20:00.000Z" },
      { id: "cmt_3", postId: "post_3", authorId: "cm_1", authorName: "Dana Okafor", body: "Couldn't have done it without the board's advocacy.", createdAt: "2026-06-20T16:00:00.000Z" },
    ],
  },
];

export const directMessageThreads: DirectMessageThread[] = [
  {
    id: "thread_1",
    participantIds: ["cm_1", "cm_3"],
    participantNames: ["Dana Okafor", "Priya Nair"],
    lastMessageAt: "2026-07-02T10:00:00.000Z",
    messages: [
      { id: "dm_1", threadId: "thread_1", senderId: "cm_3", senderName: "Priya Nair", body: "Can you approve the new volunteer roster before Saturday?", createdAt: "2026-07-02T09:45:00.000Z" },
      { id: "dm_2", threadId: "thread_1", senderId: "cm_1", senderName: "Dana Okafor", body: "Just approved it — thank you for staying on top of this.", createdAt: "2026-07-02T10:00:00.000Z" },
    ],
  },
];
