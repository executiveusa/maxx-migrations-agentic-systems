import { NextResponse } from "next/server";
import { courses } from "@/lib/mock-data/courses";

export async function GET() {
  return NextResponse.json({ courses });
}
