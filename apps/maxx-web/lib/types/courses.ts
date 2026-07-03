export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  durationMinutes: number;
  videoUrl?: string;
  body: string;
  order: number;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  category: string;
  modules: CourseModule[];
  enrolledCount: number;
}

export interface LessonProgress {
  lessonId: string;
  userId: string;
  completed: boolean;
  completedAt?: string;
}

export interface CourseEnrollment {
  courseId: string;
  userId: string;
  progressPercent: number;
  lessonProgress: LessonProgress[];
}
