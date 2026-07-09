import type Anthropic from "@anthropic-ai/sdk";
import { getSupabaseClient, getCurrentOrgId, supabaseErrorStatus } from "@/lib/data/supabase-client";
import { isSeedMode } from "@/lib/data/mode";
import { getStore } from "@/lib/data/store";

export type ToolName = "search_contacts" | "get_pipeline" | "create_contact" | "move_deal" | "delete_contact";

export interface ToolInput {
  search_contacts?: { organizationId?: string; query: string; limit?: number };
  get_pipeline?: { organizationId?: string };
  create_contact?: { organizationId?: string; firstName: string; lastName: string; email: string; source?: string; status?: string };
  move_deal?: { organizationId?: string; opportunityId: string; stageId: string };
  delete_contact?: { organizationId?: string; contactId: string };
}

/**
 * Tool schema definitions for the Claude agent.
 * Each tool represents a CRM operation: search, read, or write (with confirmation required for writes).
 */
export function getToolDefinitions(): Anthropic.Tool[] {
  return [
    {
      name: "search_contacts",
      description: "Search contacts by name or email. Use this when the user asks to find a contact.",
      input_schema: {
        type: "object" as const,
        properties: {
          query: {
            type: "string",
            description: "Name or email to search for (e.g. 'John' or 'john@example.com')",
          },
          limit: {
            type: "number",
            description: "Max number of results to return (default 10)",
          },
        },
        required: ["query"],
      },
    },
    {
      name: "get_pipeline",
      description: "Get the full pipeline with all stages and opportunities. Use this to see the sales pipeline.",
      input_schema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    {
      name: "create_contact",
      description: "Create a new contact. REQUIRES USER APPROVAL before executing. Use this when the user asks to add a contact.",
      input_schema: {
        type: "object" as const,
        properties: {
          firstName: {
            type: "string",
            description: "Contact first name",
          },
          lastName: {
            type: "string",
            description: "Contact last name",
          },
          email: {
            type: "string",
            description: "Contact email address",
          },
          source: {
            type: "string",
            enum: ["manual", "ghl", "imported", "form"],
            description: "Contact source (default: manual)",
          },
          status: {
            type: "string",
            enum: ["active", "inactive", "archived"],
            description: "Contact status (default: active)",
          },
        },
        required: ["firstName", "lastName", "email"],
      },
    },
    {
      name: "move_deal",
      description: "Move an opportunity to a different pipeline stage. REQUIRES USER APPROVAL before executing.",
      input_schema: {
        type: "object" as const,
        properties: {
          opportunityId: {
            type: "string",
            description: "ID of the opportunity to move",
          },
          stageId: {
            type: "string",
            description: "ID of the target stage",
          },
        },
        required: ["opportunityId", "stageId"],
      },
    },
    {
      name: "delete_contact",
      description: "Delete a contact. REQUIRES USER APPROVAL before executing. This is irreversible.",
      input_schema: {
        type: "object" as const,
        properties: {
          contactId: {
            type: "string",
            description: "ID of the contact to delete",
          },
        },
        required: ["contactId"],
      },
    },
  ];
}

/**
 * Execute a tool call. For write tools, returns a pending result that requires confirmation.
 * For read tools, executes immediately and returns the result.
 */
export async function executeTool(
  toolName: ToolName,
  toolInput: unknown,
  orgId: string,
): Promise<string> {
  try {
    // This is where we'd validate org_id and check RLS later
    switch (toolName) {
      case "search_contacts":
        return await executeSearchContacts(toolInput, orgId);
      case "get_pipeline":
        return await executeGetPipeline(orgId);
      case "create_contact":
        return await executeCreateContact(toolInput, orgId);
      case "move_deal":
        return await executeMoveDeal(toolInput, orgId);
      case "delete_contact":
        return await executeDeleteContact(toolInput, orgId);
      default:
        return JSON.stringify({ error: "Unknown tool" });
    }
  } catch (error) {
    return JSON.stringify({ error: (error as Error).message });
  }
}

async function executeSearchContacts(input: unknown, orgId: string): Promise<string> {
  const params = input as { query: string; limit?: number };
  const limit = Math.min(params.limit ?? 10, 50);

  if (isSeedMode()) {
    const store = getStore();
    const query = params.query.toLowerCase();
    const results = store.contacts
      .filter(
        (c) =>
          c.firstName.toLowerCase().includes(query) ||
          c.lastName.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query),
      )
      .slice(0, limit);
    return JSON.stringify({ contacts: results });
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("maxx_contacts")
      .select("id, first_name, last_name, email, status, source")
      .eq("organization_id", orgId)
      .or(`first_name.ilike.%${params.query}%,last_name.ilike.%${params.query}%,email.ilike.%${params.query}%`)
      .limit(limit);

    if (error) {
      return JSON.stringify({ error: error.message });
    }

    return JSON.stringify({
      contacts: (data ?? []).map((c) => ({
        id: c.id,
        firstName: c.first_name,
        lastName: c.last_name,
        email: c.email,
        status: c.status,
        source: c.source,
      })),
    });
  } catch (err) {
    return JSON.stringify({ error: (err as Error).message });
  }
}

async function executeGetPipeline(orgId: string): Promise<string> {
  if (isSeedMode()) {
    const store = getStore();
    // For now, return a simplified pipeline structure
    const opportunities = store.opportunities.slice(0, 10);
    return JSON.stringify({
      opportunities,
      count: store.opportunities.length,
    });
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("maxx_opportunities")
      .select("id, title, stage_id, contact_id, value_cents, maxx_contacts(first_name, last_name)")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return JSON.stringify({ error: error.message });
    }

    return JSON.stringify({
      opportunities: (data ?? []).map((opp) => ({
        id: opp.id,
        title: opp.title,
        stageId: opp.stage_id,
        contactId: opp.contact_id,
        contactName: (opp.maxx_contacts as any)
          ? `${(opp.maxx_contacts as any).first_name} ${(opp.maxx_contacts as any).last_name}`
          : "Unknown",
        value: (opp.value_cents as number) / 100,
      })),
      count: (data ?? []).length,
    });
  } catch (err) {
    return JSON.stringify({ error: (err as Error).message });
  }
}

async function executeCreateContact(input: unknown, orgId: string): Promise<string> {
  const params = input as { firstName: string; lastName: string; email: string; source?: string; status?: string };

  if (isSeedMode()) {
    const now = new Date().toISOString();
    const contact = {
      id: `contact_${Date.now()}`,
      organizationId: orgId,
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      phone: undefined,
      tags: [],
      status: (params.status ?? "active") as any,
      source: (params.source ?? "manual") as any,
      createdAt: now,
      updatedAt: now,
      notes: [],
      timeline: [],
    };
    const store = getStore();
    store.contacts.push(contact);
    return JSON.stringify({ contact, created: true });
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("maxx_contacts")
      .insert([
        {
          organization_id: orgId,
          first_name: params.firstName,
          last_name: params.lastName,
          email: params.email,
          phone: null,
          status: params.status ?? "active",
          source: params.source ?? "manual",
        },
      ])
      .select("*")
      .single();

    if (error) {
      return JSON.stringify({ error: error.message });
    }

    return JSON.stringify({
      contact: {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        status: data.status,
        source: data.source,
      },
      created: true,
    });
  } catch (err) {
    return JSON.stringify({ error: (err as Error).message });
  }
}

async function executeMoveDeal(input: unknown, orgId: string): Promise<string> {
  const params = input as { opportunityId: string; stageId: string };

  if (isSeedMode()) {
    const store = getStore();
    const opp = store.opportunities.find((o) => o.id === params.opportunityId);
    if (!opp) {
      return JSON.stringify({ error: "Opportunity not found" });
    }
    opp.stageId = params.stageId;
    opp.updatedAt = new Date().toISOString();
    return JSON.stringify({ opportunity: opp, moved: true });
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("maxx_opportunities")
      .update({ stage_id: params.stageId, updated_at: new Date().toISOString() })
      .eq("id", params.opportunityId)
      .eq("organization_id", orgId)
      .select("*")
      .single();

    if (error) {
      return JSON.stringify({ error: error.message });
    }

    return JSON.stringify({
      opportunity: {
        id: data.id,
        title: data.title,
        stageId: data.stage_id,
      },
      moved: true,
    });
  } catch (err) {
    return JSON.stringify({ error: (err as Error).message });
  }
}

async function executeDeleteContact(input: unknown, orgId: string): Promise<string> {
  const params = input as { contactId: string };

  if (isSeedMode()) {
    const store = getStore();
    const idx = store.contacts.findIndex((c) => c.id === params.contactId);
    if (idx === -1) {
      return JSON.stringify({ error: "Contact not found" });
    }
    store.contacts.splice(idx, 1);
    return JSON.stringify({ deleted: true, contactId: params.contactId });
  }

  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("maxx_contacts")
      .delete()
      .eq("id", params.contactId)
      .eq("organization_id", orgId);

    if (error) {
      return JSON.stringify({ error: error.message });
    }

    return JSON.stringify({ deleted: true, contactId: params.contactId });
  } catch (err) {
    return JSON.stringify({ error: (err as Error).message });
  }
}
