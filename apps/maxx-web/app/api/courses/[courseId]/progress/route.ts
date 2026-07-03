import { NextRequest, NextResponse } from "next/server";
import { lessonProgressSchema } from "@/lib/validation/course";
import { getStore } from "@/lib/data/store";

const DEMO_USER_ID = "member_3";

export async function POST(request: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const body = await request.json();
  const parsed = lessonProgressSchema.safeParse({ ...body, courseId });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid progress update." }, { status: 400 });
  }

  const store = getStore();
  let enrollment = store.courseEnrollments.find((e) => e.courseId === courseId && e.userId === DEMO_USER_ID);
  if (!enrollment) {
    enrollment = { courseId, userId: DEMO_USER_ID, progressPercent: 0, lessonProgress: [] };
    store.courseEnrollments.push(enrollment);
  }

  const existing = enrollment.lessonProgress.find((l) => l.lessonId === parsed.data.lessonId);
  if (existing) {
    existing.completed = parsed.data.completed;
    existing.completedAt = parsed.data.completed ? new Date().toISOString() : undefined;
  } else {
    enrollment.lessonProgress.push({
      lessonId: parsed.data.lessonId,
      userId: DEMO_USER_ID,
      completed: parsed.data.completed,
      completedAt: parsed.data.completed ? new Date().toISOString() : undefined,
    });
  }

  const completedCount = enrollment.lessonProgress.filter((l) => l.completed).length;
  enrollment.progressPercent =
    enrollment.lessonProgress.length === 0 ? 0 : Math.round((completedCount / enrollment.lessonProgress.length) * 100);

  return NextResponse.json({ enrollment });
}
