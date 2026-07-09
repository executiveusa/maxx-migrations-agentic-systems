import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CourseProgressArtifact } from "@/components/artifacts/CourseProgressArtifact";
import { courses, courseEnrollments } from "@/lib/mock-data/courses";

export const metadata: Metadata = { title: "Courses" };

export default function CoursesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="Courses"
        description="Onboarding and training for staff, volunteers, and board members."
      />
      <div className="mb-6 max-w-md">
        <CourseProgressArtifact courses={courses} enrollments={courseEnrollments} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const enrollment = courseEnrollments.find((e) => e.courseId === course.id);
          return (
            <Link key={course.id} href={`/app/community/courses/${course.id}`}>
              <Card className="h-full transition-colors hover:bg-surface-2">
                <Badge>{course.category}</Badge>
                <h3 className="mt-3 font-display text-lg font-semibold text-text">{course.title}</h3>
                <p className="mt-2 text-sm text-muted">{course.description}</p>
                <p className="mt-4 text-xs text-muted">{course.enrolledCount} enrolled</p>
                {enrollment && (
                  <div className="mt-3 h-1.5 w-full rounded-full bg-surface-2">
                    <div className="h-1.5 rounded-full bg-accent" style={{ width: `${enrollment.progressPercent}%` }} />
                  </div>
                )}
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}
