import type { Metadata } from "next";
import { ContactsView } from "@/components/contacts/ContactsView";
import { getContacts } from "@/lib/supabase/queries";

export const metadata: Metadata = { title: "Contacts" };
export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const contacts = await getContacts();
  return <ContactsView initialContacts={contacts} />;
}
