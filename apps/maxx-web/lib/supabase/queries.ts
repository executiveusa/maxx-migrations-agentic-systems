import { createClient } from "@/lib/supabase/server";
import { isIntegrationConfigured } from "@/lib/data/mode";
import { getStore } from "@/lib/data/store";
import type { Contact } from "@/lib/types/contacts";
import type { Opportunity } from "@/lib/types/pipeline";
import type { CrmForm, FormSubmission } from "@/lib/types/forms";
import type { Workflow } from "@/lib/types/workflows";

export async function getContacts(): Promise<Contact[]> {
  if (!isIntegrationConfigured("NEXT_PUBLIC_SUPABASE_URL")) {
    return getStore().contacts;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("maxx_contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch contacts from Supabase:", error);
      return getStore().contacts;
    }

    return (data || []) as Contact[];
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return getStore().contacts;
  }
}

export async function getOpportunities(): Promise<Opportunity[]> {
  if (!isIntegrationConfigured("NEXT_PUBLIC_SUPABASE_URL")) {
    return getStore().opportunities;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("maxx_opportunities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch opportunities from Supabase:", error);
      return getStore().opportunities;
    }

    return (data || []) as Opportunity[];
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    return getStore().opportunities;
  }
}

export async function getForms(): Promise<CrmForm[]> {
  if (!isIntegrationConfigured("NEXT_PUBLIC_SUPABASE_URL")) {
    return getStore().forms;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("maxx_forms")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch forms from Supabase:", error);
      return getStore().forms;
    }

    return (data || []) as CrmForm[];
  } catch (error) {
    console.error("Error fetching forms:", error);
    return getStore().forms;
  }
}

export async function getWorkflows(): Promise<Workflow[]> {
  if (!isIntegrationConfigured("NEXT_PUBLIC_SUPABASE_URL")) {
    return getStore().workflows;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("maxx_workflows")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch workflows from Supabase:", error);
      return getStore().workflows;
    }

    return (data || []) as Workflow[];
  } catch (error) {
    console.error("Error fetching workflows:", error);
    return getStore().workflows;
  }
}
