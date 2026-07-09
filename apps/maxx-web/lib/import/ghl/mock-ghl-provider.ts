import type { GhlObjectType } from "@/lib/types/imports";
import type { ParsedCsv } from "@/lib/import/ghl/types";

export class MockGhlProvider {
  readonly name = "mock";

  isConfigured(): boolean {
    return true;
  }

  async fetchObjects(objects: GhlObjectType[]): Promise<ParsedCsv> {
    const headers = ["Full Name", "Email", "Phone", "Pipeline Stage", "Tags"];
    const rows = [
      { "Full Name": "Sample Contact One", Email: "contact.one@example.org", Phone: "+15035550001", "Pipeline Stage": "New Lead", Tags: "sample" },
      { "Full Name": "Sample Contact Two", Email: "contact.two@example.org", Phone: "+15035550002", "Pipeline Stage": "Contacted", Tags: "sample" },
    ];
    void objects;
    return { headers, rows };
  }
}
