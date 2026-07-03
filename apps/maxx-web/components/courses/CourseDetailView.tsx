"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ButtonEl } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import type { Course, CourseEnrollment, Lesson } from "@/lib/types/courses";

export function CourseDetailView({
  course,
  enrollment,
}: {
  course: Course;
  enrollment: CourseEnrollment | undefined;
}) {
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(allLessons[0] ?? null);
  const [completed, setCompleted] = useState<Set<string>>(
    new Set(enrollment?.lessonProgress.filter((l) => l.completed).map((l) => l.lessonId) ?? []),
  );
  const { pushToast } = useToast();

  const progressPercent = allLessons.length === 0 ? 0 : Math.round((completed.size / allLessons.length) * 100);

  async function markComplete(lessonId: string) {
    setCompleted((prev) => new Set(prev).add(lessonId));
    await fetch(`/api/courses/${course.id}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: course.id, lessonId, completed: true }),
    });
    pushToast("Lesson marked complete.", "success");
  }

  return (
    <>
      <PageHeader
        eyebrow={course.category}
        title={course.title}
        description={course.description}
      />
      <div className="mb-6">
        <div className="h-2 w-full max-w-md rounded-full bg-surface-2">
          <div className="h-2 rounded-full bg-accent" style={{ width: `${progressPercent}%` }} />
        </div>
        <p className="mt-1 text-xs text-muted">{progressPercent}% complete</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          {course.modules.map((module) => (
            <div key={module.id} className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">{module.title}</p>
              <ul className="mt-2 space-y-1">
                {module.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <button
                      type="button"
                      onClick={() => setActiveLesson(lesson)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                        activeLesson?.id === lesson.id ? "bg-accent-soft text-accent" : "text-text hover:bg-surface-2"
                      }`}
                    >
                      <span>{lesson.title}</span>
                      {completed.has(lesson.id) && <span aria-hidden>✓</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Card>
        <Card className="lg:col-span-2">
          {activeLesson ? (
            <div>
              <h3 className="font-display text-xl font-semibold text-text">{activeLesson.title}</h3>
              <p className="mt-1 text-xs text-muted">{activeLesson.durationMinutes} min lesson</p>
              <p className="mt-4 text-sm text-muted">{activeLesson.body}</p>
              <ButtonEl
                className="mt-6"
                onClick={() => markComplete(activeLesson.id)}
                disabled={completed.has(activeLesson.id)}
              >
                {completed.has(activeLesson.id) ? "Completed" : "Mark lesson complete"}
              </ButtonEl>
            </div>
          ) : (
            <p className="text-sm text-muted">Select a lesson to begin.</p>
          )}
        </Card>
      </div>
    </>
  );
}
