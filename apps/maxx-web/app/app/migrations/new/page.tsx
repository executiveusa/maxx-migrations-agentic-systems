import type { Metadata } from "next";
import { NewMigrationForm } from "@/components/migrations/NewMigrationForm";

export const metadata: Metadata = { title: "New Migration" };

export default function NewMigrationPage() {
  return <NewMigrationForm />;
}
