"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ButtonEl } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { CommunityPulseArtifact } from "@/components/artifacts/CommunityPulseArtifact";
import type { CommunityMember, CommunityPost, DirectMessageThread } from "@/lib/types/community";

export function CommunityView({
  initialPosts,
  members,
  threads,
}: {
  initialPosts: CommunityPost[];
  members: CommunityMember[];
  threads: DirectMessageThread[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [draft, setDraft] = useState("");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [activeThread, setActiveThread] = useState(threads[0]?.id ?? null);
  const [threadDraft, setThreadDraft] = useState("");
  const [threadState, setThreadState] = useState(threads);
  const { pushToast } = useToast();

  async function submitPost() {
    if (!draft.trim()) return;
    const res = await fetch("/api/community/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: draft }),
    });
    if (!res.ok) {
      pushToast("Could not post — try again.", "error");
      return;
    }
    const { post } = await res.json();
    setPosts((prev) => [post as CommunityPost, ...prev]);
    setDraft("");
  }

  function react(postId: string) {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, reactionCount: p.reactionCount + 1 } : p)));
  }

  function submitComment(postId: string) {
    const body = commentDrafts[postId];
    if (!body?.trim()) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                { id: `cmt_${Date.now()}`, postId, authorId: "me", authorName: "You", body, createdAt: new Date().toISOString() },
              ],
            }
          : p,
      ),
    );
    setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
  }

  function sendMessage() {
    if (!threadDraft.trim() || !activeThread) return;
    setThreadState((prev) =>
      prev.map((t) =>
        t.id === activeThread
          ? {
              ...t,
              lastMessageAt: new Date().toISOString(),
              messages: [
                ...t.messages,
                { id: `dm_${Date.now()}`, threadId: activeThread, senderId: "me", senderName: "You", body: threadDraft, createdAt: new Date().toISOString() },
              ],
            }
          : t,
      ),
    );
    setThreadDraft("");
  }

  const leaderboard = [...members].sort((a, b) => b.points - a.points);
  const currentThread = threadState.find((t) => t.id === activeThread);

  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="Community"
        description="A shared feed, direct messages, and a leaderboard for your staff and volunteers."
      />
      <div className="mb-6 max-w-md">
        <CommunityPulseArtifact posts={posts} />
      </div>
      <Tabs
        items={[
          {
            id: "feed",
            label: "Feed",
            content: (
              <div className="mx-auto max-w-2xl space-y-6">
                <Card>
                  <Textarea
                    placeholder="Share an update with your community…"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                  />
                  <div className="mt-3 flex justify-end">
                    <ButtonEl onClick={submitPost} disabled={!draft.trim()}>Post</ButtonEl>
                  </div>
                </Card>
                {posts.length === 0 ? (
                  <EmptyState title="No posts yet" description="Be the first to share an update." />
                ) : (
                  posts.map((post) => (
                    <Card key={post.id}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft font-display text-sm font-semibold text-accent">
                          {post.authorName.slice(0, 1)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text">{post.authorName}</p>
                          <p className="text-xs text-muted">{new Date(post.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-text">{post.body}</p>
                      <div className="mt-3 flex items-center gap-4 text-sm text-muted">
                        <button type="button" onClick={() => react(post.id)} className="hover:text-accent">
                          👍 {post.reactionCount}
                        </button>
                        <span>{post.comments.length} comments</span>
                      </div>
                      <div className="mt-3 space-y-2 border-t border-border pt-3">
                        {post.comments.map((comment) => (
                          <p key={comment.id} className="text-sm text-muted">
                            <span className="font-medium text-text">{comment.authorName}: </span>
                            {comment.body}
                          </p>
                        ))}
                        <div className="flex gap-2">
                          <input
                            value={commentDrafts[post.id] ?? ""}
                            onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder="Write a comment…"
                            className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm"
                          />
                          <ButtonEl size="sm" variant="secondary" onClick={() => submitComment(post.id)}>
                            Reply
                          </ButtonEl>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            ),
          },
          {
            id: "members",
            label: "Members & Leaderboard",
            content: (
              <div className="max-w-xl">
                <Card>
                  <h3 className="mb-4 font-display text-lg font-semibold text-text">Leaderboard</h3>
                  <ol className="space-y-2">
                    {leaderboard.map((member, index) => (
                      <li key={member.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5">
                        <span className="text-sm text-text">{index + 1}. {member.name} <span className="text-muted">— {member.role}</span></span>
                        <span className="text-sm font-medium text-accent">{member.points} pts</span>
                      </li>
                    ))}
                  </ol>
                </Card>
              </div>
            ),
          },
          {
            id: "messages",
            label: "Direct messages",
            content: (
              <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-1">
                  <h3 className="mb-3 text-sm font-medium text-muted">Threads</h3>
                  <ul className="space-y-1">
                    {threadState.map((thread) => (
                      <li key={thread.id}>
                        <button
                          type="button"
                          onClick={() => setActiveThread(thread.id)}
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                            activeThread === thread.id ? "bg-accent-soft text-accent" : "text-text hover:bg-surface-2"
                          }`}
                        >
                          {thread.participantNames.join(", ")}
                        </button>
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card className="lg:col-span-2">
                  {currentThread ? (
                    <div className="flex h-full flex-col">
                      <div className="flex-1 space-y-3">
                        {currentThread.messages.map((message) => (
                          <div key={message.id} className="rounded-lg border border-border px-4 py-2.5">
                            <p className="text-xs text-muted">{message.senderName}</p>
                            <p className="text-sm text-text">{message.body}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <input
                          value={threadDraft}
                          onChange={(e) => setThreadDraft(e.target.value)}
                          placeholder="Write a message…"
                          className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm"
                        />
                        <ButtonEl onClick={sendMessage} disabled={!threadDraft.trim()}>Send</ButtonEl>
                      </div>
                    </div>
                  ) : (
                    <EmptyState title="No conversation selected" description="Choose a thread to view messages." />
                  )}
                </Card>
              </div>
            ),
          },
        ]}
      />
    </>
  );
}
