import { AnnouncementBar } from "@/components/landing/AnnouncementBar";
import { MainNav } from "@/components/landing/MainNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { ValueStack } from "@/components/landing/ValueStack";
import { OnboardingPath } from "@/components/landing/OnboardingPath";
import { ComparisonTable } from "@/components/landing/ComparisonTable";
import { OrganizationOwnership } from "@/components/landing/OrganizationOwnership";
import { WhoThisIsFor } from "@/components/landing/WhoThisIsFor";
import { ProofPanel } from "@/components/landing/ProofPanel";
import { MigrationCockpitPreview } from "@/components/landing/MigrationCockpitPreview";
import { RecentUpdates } from "@/components/landing/RecentUpdates";
import { FeatureStack } from "@/components/landing/FeatureStack";
import { NonprofitUseCases } from "@/components/landing/NonprofitUseCases";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <MainNav />
      <main id="main-content">
        <HeroSection />
        <ValueStack />
        <OnboardingPath />
        <ComparisonTable />
        <OrganizationOwnership />
        <WhoThisIsFor />
        <ProofPanel />
        <MigrationCockpitPreview />
        <RecentUpdates />
        <FeatureStack />
        <NonprofitUseCases />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
