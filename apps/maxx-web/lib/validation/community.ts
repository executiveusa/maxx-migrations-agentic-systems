import { z } from "zod";

export const communityPostSchema = z.object({
  body: z.string().min(1, "Write something before posting."),
});

export const communityCommentSchema = z.object({
  postId: z.string().min(1),
  body: z.string().min(1, "Comment cannot be empty."),
});

export const directMessageSchema = z.object({
  threadId: z.string().min(1),
  body: z.string().min(1, "Message cannot be empty."),
});

export type CommunityPostInput = z.infer<typeof communityPostSchema>;
