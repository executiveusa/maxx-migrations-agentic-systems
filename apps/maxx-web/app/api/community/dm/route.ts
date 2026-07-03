import { NextRequest, NextResponse } from "next/server";
import { directMessageSchema } from "@/lib/validation/community";
import { getStore } from "@/lib/data/store";

export async function GET() {
  const { directMessageThreads } = getStore();
  return NextResponse.json({ threads: directMessageThreads });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = directMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid message." }, { status: 400 });
  }

  const store = getStore();
  const thread = store.directMessageThreads.find((t) => t.id === parsed.data.threadId);
  if (!thread) {
    return NextResponse.json({ error: "Thread not found." }, { status: 404 });
  }

  const now = new Date().toISOString();
  const message = {
    id: `dm_${Date.now()}`,
    threadId: parsed.data.threadId,
    senderId: "me",
    senderName: "You",
    body: parsed.data.body,
    createdAt: now,
  };
  thread.messages = [...thread.messages, message];
  thread.lastMessageAt = now;

  return NextResponse.json({ message }, { status: 201 });
}
