import { describe, expect, it } from "vitest";
import { intakePayloadSchema } from "@/lib/intake/schema";
import { workflowSchema } from "@/lib/validation/workflow";

describe("Zod 4 schema migration boundaries", () => {
  it("preserves default empty object records in Client Zero intake", () => {
    const parsed = intakePayloadSchema.parse({});
    expect(parsed.answers).toEqual({});
    expect(parsed.icm).toEqual({});
    expect(parsed.ontology).toEqual({});
    expect(parsed.evidence).toEqual({});
    expect(parsed.open_questions).toEqual([]);
  });
  it("preserves caller supplied structured intake data", () => {
    const parsed = intakePayloadSchema.parse({
      answers: { company_name: "Synthetic Test Co." },
      icm: { consent: false },
      evidence: [{ source: "test" }],
    });
    expect(parsed.answers.company_name).toBe("Synthetic Test Co.");
    expect(parsed.evidence).toEqual([{ source: "test" }]);
  });
  it("applies WorkflowStep config defaults and validates string values", () => {
    const parsed = workflowSchema.parse({
      name:"Test Workflow", description:"No real customer data",
      steps:[{type:"human_approval",label:"Owner approval"}],
    });
    expect(parsed.steps[0]?.config).toEqual({});
    expect(workflowSchema.safeParse({
      name:"Test Workflow", description:"Synthetic",
      steps:[{type:"send_email",label:"Send",config:{maxRetries:3}}],
    }).success).toBe(false);
  });
});
