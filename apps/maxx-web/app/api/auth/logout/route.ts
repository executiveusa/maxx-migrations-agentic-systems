import { NextRequest, NextResponse } from "next/server";
import { signOut } from "@/lib/auth/supabase-auth";

export async function POST(request: NextRequest) {
  try {
    await signOut();
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export async function GET(request: NextRequest) {
  try {
    await signOut();
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
