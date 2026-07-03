import { NextResponse } from "next/server";
import { getStore } from "@/lib/data/store";

export async function GET() {
  const { socialPosts } = getStore();
  return NextResponse.json({ posts: socialPosts });
}
