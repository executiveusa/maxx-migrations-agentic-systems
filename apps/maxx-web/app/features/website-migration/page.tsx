import type { Metadata } from "next";
import { FeaturePageLayout } from "@/components/features/FeaturePageLayout";

export const metadata: Metadata = {
  title: "Website Migration — Maxx Migrations",
  description: "Crawl, rewrite, and rebuild your existing site into an owned component system.",
};

export default function WebsiteMigrationFeaturePage() {
  return (
    <FeaturePageLayout
      eyebrow="Core product"
      title="Website Migration Engine"
      description="We crawl your existing site, inventory every page and asset, rewrite the copy in your voice, and rebuild it on an owned, sovereign component system — with a full task timeline you can watch in real time."
      appRoute="/app/migrations"
      appRouteLabel="Open Migrations"
      highlights={[
        { title: "Page & asset inventory", body: "Every page, image, and document from your current site is cataloged before anything is rebuilt." },
        { title: "Design audit", body: "Each migration is scored against accessibility, contrast, and clarity checks before publish." },
        { title: "Agent task timeline", body: "Watch the Migration, Copy, and QA agents work through your migration step by step." },
      ]}
      detailTitle="From old site to owned site, with a checklist at every step"
      detailBody="A migration job moves through intake, crawling, extraction, design, review, and a publish checklist — with before/after previews so nothing goes live until a human approves it."
    />
  );
}
