import { contacts as seedContacts } from "@/lib/mock-data/contacts";
import { opportunities as seedOpportunities } from "@/lib/mock-data/pipeline";
import { forms as seedForms, formSubmissions as seedFormSubmissions } from "@/lib/mock-data/forms";
import { workflows as seedWorkflows } from "@/lib/mock-data/workflows";
import { communityPosts as seedCommunityPosts, directMessageThreads as seedDirectMessageThreads } from "@/lib/mock-data/community";
import { socialPosts as seedSocialPosts } from "@/lib/mock-data/social";
import { importJobs as seedImportJobs } from "@/lib/mock-data/imports";
import { migrationJobs as seedMigrationJobs } from "@/lib/mock-data/migrations";
import { mctbRules as seedMctbRules, smsOptOuts as seedSmsOptOuts } from "@/lib/mock-data/telephony";
import { courseEnrollments as seedCourseEnrollments } from "@/lib/mock-data/courses";
import { agencies as seedAgencies, flywheelProjects as seedFlywheelProjects, beads as seedBeads, flywheelSessions as seedFlywheelSessions } from "@/lib/mock-data/flywheel";
import { migrationAuditRequests as seedMigrationAuditRequests } from "@/lib/mock-data/migration-audit-requests";
import type { Contact } from "@/lib/types/contacts";
import type { Opportunity } from "@/lib/types/pipeline";
import type { CrmForm, FormSubmission } from "@/lib/types/forms";
import type { Workflow } from "@/lib/types/workflows";
import type { CommunityPost, DirectMessageThread } from "@/lib/types/community";
import type { SocialPost } from "@/lib/types/social";
import type { ImportJob } from "@/lib/types/imports";
import type { MigrationJob } from "@/lib/types/migrations";
import type { MctbRule, SmsOptOut } from "@/lib/types/telephony";
import type { CourseEnrollment } from "@/lib/types/courses";
import type { Organization } from "@/lib/types/organizations";
import type { FlywheelProject } from "@/lib/types/project";
import type { Bead, FlywheelSession } from "@/lib/types/bead";
import type { MigrationAuditRequest } from "@/lib/types/migration-audit-request";

/**
 * Process-lifetime in-memory store used while no Supabase project is
 * configured (see lib/data/mode.ts). It seeds from lib/mock-data and lets
 * API routes append real records so create flows (new form, new workflow,
 * new migration job, GHL import run) behave consistently within a session
 * instead of silently discarding writes.
 *
 * Seed vs. prod mode branching lives in each API route, not here:
 * `getStore()` is ONLY for isSeedMode() === true. Prod-mode branches call
 * lib/data/supabase-client.ts and query the maxx_-prefixed Supabase tables
 * directly (see app/api/contacts, app/api/pipeline, app/api/workflows).
 * getStore() intentionally has no Supabase-aware branch: mixing the two
 * here would make it easy for a route to accidentally read/write the
 * in-memory store in prod mode.
 */
interface Store {
  contacts: Contact[];
  opportunities: Opportunity[];
  forms: CrmForm[];
  formSubmissions: FormSubmission[];
  workflows: Workflow[];
  communityPosts: CommunityPost[];
  directMessageThreads: DirectMessageThread[];
  socialPosts: SocialPost[];
  importJobs: ImportJob[];
  migrationJobs: MigrationJob[];
  mctbRules: MctbRule[];
  courseEnrollments: CourseEnrollment[];
  smsOptOuts: SmsOptOut[];
  agencies: Organization[];
  flywheelProjects: FlywheelProject[];
  beads: Bead[];
  flywheelSessions: FlywheelSession[];
  migrationAuditRequests: MigrationAuditRequest[];
}

const globalForStore = globalThis as unknown as { __maxxStore?: Store };

function createStore(): Store {
  return {
    contacts: [...seedContacts],
    opportunities: [...seedOpportunities],
    forms: [...seedForms],
    formSubmissions: [...seedFormSubmissions],
    workflows: [...seedWorkflows],
    communityPosts: [...seedCommunityPosts],
    directMessageThreads: [...seedDirectMessageThreads],
    socialPosts: [...seedSocialPosts],
    importJobs: [...seedImportJobs],
    migrationJobs: [...seedMigrationJobs],
    mctbRules: [...seedMctbRules],
    courseEnrollments: seedCourseEnrollments.map((e) => ({ ...e, lessonProgress: [...e.lessonProgress] })),
    smsOptOuts: [...seedSmsOptOuts],
    agencies: [...seedAgencies],
    flywheelProjects: [...seedFlywheelProjects],
    beads: [...seedBeads],
    flywheelSessions: [...seedFlywheelSessions],
    migrationAuditRequests: [...seedMigrationAuditRequests],
  };
}

export function getStore(): Store {
  if (!globalForStore.__maxxStore) {
    globalForStore.__maxxStore = createStore();
  }
  return globalForStore.__maxxStore;
}
