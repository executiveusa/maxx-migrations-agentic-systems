import { AnnouncementBar } from "@/components/landing/AnnouncementBar";
import { MainNav } from "@/components/landing/MainNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProofPanel } from "@/components/landing/ProofPanel";
import { HowItWorks } from "@/components/landing/HowItWorks";
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
        <ProofPanel />
        <HowItWorks />
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
