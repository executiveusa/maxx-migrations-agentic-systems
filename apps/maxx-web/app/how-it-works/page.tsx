import type { Metadata } from "next";
import { MainNav } from "@/components/landing/MainNav";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { MigrationCockpitPreview } from "@/components/landing/MigrationCockpitPreview";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "How It Works — Maxx Migrations",
};

export default function HowItWorksPage() {
  return (
    <>
      <MainNav />
      <main id="main-content">
        <HowItWorks />
        <MigrationCockpitPreview />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
