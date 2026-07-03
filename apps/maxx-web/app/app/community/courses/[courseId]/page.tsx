import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourseById, courseEnrollments } from "@/lib/mock-data/courses";
import { CourseDetailView } from "@/components/courses/CourseDetailView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>;
}): Promise<Metadata> {
  const { courseId } = await params;
  const course = getCourseById(courseId);
  return { title: course ? course.title : "Course" };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = getCourseById(courseId);
  if (!course) notFound();
  const enrollment = courseEnrollments.find((e) => e.courseId === courseId);
  return <CourseDetailView course={course} enrollment={enrollment} />;
}
