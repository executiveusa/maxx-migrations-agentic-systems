"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ButtonEl } from "@/components/ui/Button";
import { Field, Select, Textarea, Input } from "@/components/ui/Input";
import { StatusPill } from "@/components/ui/StatusPill";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import type { CampaignTemplate, SocialAccount, SocialChannel, SocialPost } from "@/lib/types/social";

const channelLabels: Record<SocialChannel, string> = {
  facebook_page: "Facebook Page",
  instagram_business: "Instagram Business",
};

export function SocialPlannerView({
  initialPosts,
  accounts,
  templates,
}: {
  initialPosts: SocialPost[];
  accounts: SocialAccount[];
  templates: CampaignTemplate[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [composerOpen, setComposerOpen] = useState(false);
  const [copy, setCopy] = useState("");
  const [channels, setChannels] = useState<SocialChannel[]>([]);
  const [scheduledFor, setScheduledFor] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const { pushToast } = useToast();

  const drafts = posts.filter((p) => p.status === "draft");
  const scheduled = posts.filter((p) => p.status === "scheduled" || p.status === "setup_required");
  const published = posts.filter((p) => p.status === "published" || p.status === "failed");

  function toggleChannel(channel: SocialChannel) {
    setChannels((prev) => (prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]));
  }

  function applyTemplate(id: string) {
    setTemplateId(id);
    const template = templates.find((t) => t.id === id);
    if (template) setCopy(template.suggestedCopy);
  }

  async function saveDraft() {
    const res = await fetch("/api/social/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channels, copy, scheduledFor: scheduledFor || new Date().toISOString(), campaignTemplateId: templateId || undefined }),
    });
    if (!res.ok) {
      const body = await res.json();
      pushToast(body.error ?? "Could not save post.", "error");
      return;
    }
    const { post } = await res.json();
    setPosts((prev) => [post as SocialPost, ...prev]);
    setComposerOpen(false);
    setCopy("");
    setChannels([]);
    setScheduledFor("");
    pushToast("Post saved.", "success");
  }

  async function publish(post: SocialPost) {
    setPublishingId(post.id);
    const res = await fetch("/api/social/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post.id }),
    });
    const body = await res.json();
    setPublishingId(null);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, status: body.status, publishLog: [...p.publishLog, body.message] }
          : p,
      ),
    );
    pushToast(body.message, body.success ? "success" : "info");
  }

  return (
    <>
      <PageHeader
        eyebrow="Social"
        title="Social Media Planner"
        description="Draft, schedule, and publish to Facebook and Instagram from one calendar."
        actions={<ButtonEl onClick={() => setComposerOpen(true)}>New post</ButtonEl>}
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {accounts.map((account) => (
          <Card key={account.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text">{channelLabels[account.channel]}</p>
              <p className="text-xs text-muted">{account.displayName}</p>
            </div>
            <StatusPill status={account.connected ? "connected" : "setup_required"} />
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <PostColumn title="Drafts" posts={drafts} onPublish={publish} publishingId={publishingId} />
        <PostColumn title="Scheduled" posts={scheduled} onPublish={publish} publishingId={publishingId} />
        <PostColumn title="Published" posts={published} onPublish={publish} publishingId={publishingId} />
      </div>

      <Dialog open={composerOpen} onClose={() => setComposerOpen(false)} title="New post">
        <div className="space-y-4">
          <Field label="Campaign template (optional)">
            <Select value={templateId} onChange={(e) => applyTemplate(e.target.value)}>
              <option value="">No template</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Channels">
            <div className="flex gap-3">
              {(["facebook_page", "instagram_business"] as SocialChannel[]).map((channel) => (
                <label key={channel} className="flex items-center gap-2 text-sm text-text">
                  <input type="checkbox" checked={channels.includes(channel)} onChange={() => toggleChannel(channel)} />
                  {channelLabels[channel]}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Post copy">
            <Textarea value={copy} onChange={(e) => setCopy(e.target.value)} maxLength={2200} />
          </Field>
          <Field label="Schedule for">
            <Input type="datetime-local" value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} />
          </Field>
          <ButtonEl className="w-full" onClick={saveDraft} disabled={!copy.trim() || channels.length === 0}>
            Save post
          </ButtonEl>
        </div>
      </Dialog>
    </>
  );
}

function PostColumn({
  title,
  posts,
  onPublish,
  publishingId,
}: {
  title: string;
  posts: SocialPost[];
  onPublish: (post: SocialPost) => void;
  publishingId: string | null;
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-text">{title} ({posts.length})</h3>
      <div className="space-y-3">
        {posts.length === 0 ? (
          <EmptyState title="Nothing here yet" description={`No ${title.toLowerCase()} posts.`} />
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <div className="mb-2 flex flex-wrap gap-1">
                {post.channels.map((c) => (
                  <Badge key={c}>{channelLabels[c]}</Badge>
                ))}
              </div>
              <p className="text-sm text-text">{post.copy}</p>
              <div className="mt-3 flex items-center justify-between">
                <StatusPill status={post.status} />
                {post.status !== "published" && (
                  <ButtonEl size="sm" variant="secondary" onClick={() => onPublish(post)} disabled={publishingId === post.id}>
                    {publishingId === post.id ? "Publishing…" : "Publish now"}
                  </ButtonEl>
                )}
              </div>
              {post.publishLog.length > 0 && (
                <p className="mt-2 text-xs text-muted">{post.publishLog[post.publishLog.length - 1]}</p>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
