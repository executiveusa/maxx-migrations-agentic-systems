import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { RestaurantGrowthPanel } from "@/components/revenue-capture/RestaurantGrowthPanel";

export const metadata: Metadata = { title: "Restaurant Revenue Proof" };

export default function RestaurantRevenuePage() {
  return (
    <>
      <PageHeader
        eyebrow="MAXX Operations · Restaurant"
        title="Know what brought in real money."
        description="A simple read-only place to reconcile restaurant payments—including cash—and prepare the next owner-approved growth experiment."
      />
      <RestaurantGrowthPanel />
    </>
  );
}
