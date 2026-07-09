import type { GhlObjectType } from "@/lib/types/imports";
import type { ParsedCsv } from "@/lib/import/ghl/types";
import { isIntegrationConfigured } from "@/lib/data/mode";

export class GhlApiProvider {
  readonly name = "ghl_api";

  isConfigured(): boolean {
    return isIntegrationConfigured("GHL_API_KEY") && isIntegrationConfigured("GHL_LOCATION_ID");
  }

  async fetchObjects(objects: GhlObjectType[]): Promise<ParsedCsv> {
    if (!this.isConfigured()) {
      throw new Error(
        "GHL connection required. Add GHL_API_KEY and GHL_LOCATION_ID in Settings → Integrations, or use CSV import instead.",
      );
    }

    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;
    const response = await fetch(
      `https://services.leadconnectorhq.com/contacts/?locationId=${locationId}&objects=${objects.join(",")}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Version: "2021-07-28",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`GHL API error: ${response.status}`);
    }

    const data = (await response.json()) as { contacts?: Record<string, string>[] };
    const rows = data.contacts ?? [];
    const headers = rows.length > 0 ? Object.keys(rows[0] ?? {}) : [];
    return { headers, rows };
  }
}
