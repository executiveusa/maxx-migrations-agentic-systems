export interface CommunityMember {
  id: string;
  name: string;
  role: string;
  avatarInitial: string;
  points: number;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  organizationId: string;
  authorId: string;
  authorName: string;
  body: string;
  reactionCount: number;
  comments: CommunityComment[];
  createdAt: string;
}

export interface DirectMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  body: string;
  createdAt: string;
}

export interface DirectMessageThread {
  id: string;
  participantIds: string[];
  participantNames: string[];
  messages: DirectMessage[];
  lastMessageAt: string;
}
