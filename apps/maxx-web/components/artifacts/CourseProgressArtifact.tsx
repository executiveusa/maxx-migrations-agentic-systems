import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Course, CourseEnrollment } from "@/lib/types/courses";

export function CourseProgressArtifact({
  courses,
  enrollments,
}: {
  courses: Course[];
  enrollments: CourseEnrollment[];
}) {
  if (enrollments.length === 0) {
    return (
      <Card>
        <EmptyState title="No enrollments yet" description="Progress will appear here once staff start a course." />
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="mb-4 font-display text-lg font-semibold text-text">Course progress</h3>
      <ul className="space-y-3">
        {enrollments.map((enrollment) => {
          const course = courses.find((c) => c.id === enrollment.courseId);
          return (
            <li key={enrollment.courseId}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text">{course?.title ?? "Unknown course"}</span>
                <span className="text-muted">{enrollment.progressPercent}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-surface-2">
                <div className="h-1.5 rounded-full bg-accent" style={{ width: `${enrollment.progressPercent}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
