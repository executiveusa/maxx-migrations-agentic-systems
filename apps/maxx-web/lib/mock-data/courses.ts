import type { Course, CourseEnrollment } from "@/lib/types/courses";
import { currentOrganization } from "@/lib/mock-data/organizations";

const orgId = currentOrganization.id;

export const courses: Course[] = [
  {
    id: "course_volunteer_onboarding",
    organizationId: orgId,
    title: "Volunteer Onboarding",
    description: "Everything a new volunteer needs before their first kitchen shift.",
    category: "Operations",
    enrolledCount: 38,
    modules: [
      {
        id: "mod_1",
        courseId: "course_volunteer_onboarding",
        title: "Getting Started",
        order: 1,
        lessons: [
          { id: "lesson_1", moduleId: "mod_1", title: "Mission and food safety basics", durationMinutes: 12, body: "Learn our mission, our service area, and the food-safety rules every shift follows.", order: 1 },
          { id: "lesson_2", moduleId: "mod_1", title: "Your first shift, step by step", durationMinutes: 9, body: "A walkthrough of check-in, prep, service, and cleanup for a typical Saturday shift.", order: 2 },
        ],
      },
    ],
  },
  {
    id: "course_donor_stewardship",
    organizationId: orgId,
    title: "Donor Stewardship Basics",
    description: "How we thank, retain, and grow relationships with recurring donors.",
    category: "Fundraising",
    enrolledCount: 12,
    modules: [
      {
        id: "mod_2",
        courseId: "course_donor_stewardship",
        title: "Foundations",
        order: 1,
        lessons: [
          { id: "lesson_3", moduleId: "mod_2", title: "Why stewardship comes before the ask", durationMinutes: 15, body: "The stewardship-first philosophy behind every donor touchpoint we send.", order: 1 },
          { id: "lesson_4", moduleId: "mod_2", title: "Writing a thank-you that gets remembered", durationMinutes: 10, body: "Templates and examples from our highest-performing thank-you emails.", order: 2 },
        ],
      },
    ],
  },
  {
    id: "course_board_orientation",
    organizationId: orgId,
    title: "Board Member Orientation",
    description: "Governance basics and current priorities for new board members.",
    category: "Governance",
    enrolledCount: 6,
    modules: [
      {
        id: "mod_3",
        courseId: "course_board_orientation",
        title: "Orientation",
        order: 1,
        lessons: [
          { id: "lesson_5", moduleId: "mod_3", title: "Fiduciary duties overview", durationMinutes: 18, body: "What every board member is legally and ethically responsible for.", order: 1 },
        ],
      },
    ],
  },
  {
    id: "course_grant_readiness",
    organizationId: orgId,
    title: "Grant Readiness Training",
    description: "Preparing a strong grant application from intake to submission.",
    category: "Grants",
    enrolledCount: 5,
    modules: [
      {
        id: "mod_4",
        courseId: "course_grant_readiness",
        title: "Building the Case",
        order: 1,
        lessons: [
          { id: "lesson_6", moduleId: "mod_4", title: "Telling our impact story with data", durationMinutes: 14, body: "How to pair program outcomes with the numbers funders want to see.", order: 1 },
        ],
      },
    ],
  },
  {
    id: "course_community_response",
    organizationId: orgId,
    title: "Community Response Playbook",
    description: "How we mobilize volunteers and resources during an emergency response.",
    category: "Operations",
    enrolledCount: 9,
    modules: [
      {
        id: "mod_5",
        courseId: "course_community_response",
        title: "Rapid Response",
        order: 1,
        lessons: [
          { id: "lesson_7", moduleId: "mod_5", title: "Activating the volunteer phone tree", durationMinutes: 8, body: "Step-by-step activation checklist for the first two hours of a response.", order: 1 },
        ],
      },
    ],
  },
];

export const courseEnrollments: CourseEnrollment[] = [
  {
    courseId: "course_volunteer_onboarding",
    userId: "member_3",
    progressPercent: 100,
    lessonProgress: [
      { lessonId: "lesson_1", userId: "member_3", completed: true, completedAt: "2026-05-01T00:00:00.000Z" },
      { lessonId: "lesson_2", userId: "member_3", completed: true, completedAt: "2026-05-02T00:00:00.000Z" },
    ],
  },
  {
    courseId: "course_donor_stewardship",
    userId: "member_3",
    progressPercent: 50,
    lessonProgress: [
      { lessonId: "lesson_3", userId: "member_3", completed: true, completedAt: "2026-06-01T00:00:00.000Z" },
      { lessonId: "lesson_4", userId: "member_3", completed: false },
    ],
  },
];

export function getCourseById(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}
