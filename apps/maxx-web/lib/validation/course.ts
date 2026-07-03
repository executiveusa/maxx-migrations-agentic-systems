import { z } from "zod";

export const lessonProgressSchema = z.object({
  courseId: z.string().min(1),
  lessonId: z.string().min(1),
  completed: z.boolean(),
});

export const courseSchema = z.object({
  title: z.string().min(2, "Course title is required."),
  description: z.string().min(1, "Add a short description."),
  category: z.string().min(1, "Choose a category."),
});

export type LessonProgressInput = z.infer<typeof lessonProgressSchema>;
