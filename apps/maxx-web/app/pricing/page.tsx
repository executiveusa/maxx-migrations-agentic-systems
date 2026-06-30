import type { Metadata } from "next";
import { MainNav } from "@/components/landing/MainNav";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Pricing — Maxx Migrations",
};

export default function PricingPage() {
  return (
    <>
      <MainNav />
      <main id="main-content">
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
