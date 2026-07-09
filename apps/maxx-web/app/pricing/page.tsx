import type { Metadata } from "next";
import { MainNav } from "@/components/landing/MainNav";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { OwnershipValueCalculator } from "@/components/artifacts/OwnershipValueCalculator";

export const metadata: Metadata = {
  title: "Pricing — Maxx Migrations",
};

export default function PricingPage() {
  return (
    <>
      <MainNav />
      <main id="main-content">
        <PricingSection />
        <section className="mx-auto max-w-3xl px-4 pb-20">
          <OwnershipValueCalculator />
        </section>
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
