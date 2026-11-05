import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { notFound } from "next/navigation";
import { getSupabaseAuth } from "@/lib/auth/supabase-auth";
import { CrownOfferConsole } from "@/components/crown-core/CrownOfferConsole";

export const metadata: Metadata = { title: "Crown & Core · Vibe Audit" };

/**
 * Server authorization is distinct from Vercel preview protection.
 * Fail closed without a real Supabase session + confirmed tenant membership.
 * The browser UI does not accept a machine key or caller-supplied tenant ID.
 */
export default async function CrownAndCoreInternalPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    notFound();
  }
  let authorized = false;
  try {
    const db = await getSupabaseAuth();
    const { data: identity, error: userError } = await db.auth.getUser();
    if (!userError && identity.user) {
      const { data: tenant, error: tenantError } = await db
        .from("maxx_icm_tenants")
        .select("id")
        .eq("slug", "crown-and-core")
        .maybeSingle();
      if (!tenantError && tenant) {
        const { data: member, error: membershipError } = await db
          .from("maxx_icm_memberships")
          .select("user_id")
          .eq("tenant_id", tenant.id)
          .eq("user_id", identity.user.id)
          .maybeSingle();
        authorized = !membershipError && Boolean(member);
      }
    }
  } catch {
    authorized = false;
  }
  if (!authorized) notFound();
  return (
    <>
      <PageHeader eyebrow="MACS / MAXX · Internal only"
        title="Crown & Core"
        description="Evidence-led Vibe Audit preparation and independent review. Crown & Core has not signed or approved a production service. Nothing here publishes, books, sends or executes a client action." />
      <CrownOfferConsole />
    </>
  );
}
