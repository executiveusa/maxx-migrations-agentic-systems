import type { Metadata } from "next";
import { ContactsView } from "@/components/contacts/ContactsView";
import { getStore } from "@/lib/data/store";

export const metadata: Metadata = { title: "Contacts" };
export const dynamic = "force-dynamic";

export default function ContactsPage() {
  const { contacts } = getStore();
  return <ContactsView initialContacts={contacts} />;
}
