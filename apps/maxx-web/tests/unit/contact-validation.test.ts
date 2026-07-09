import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/validation/contact";

describe("contactSchema", () => {
  it("accepts a valid contact", () => {
    const result = contactSchema.safeParse({
      firstName: "Alicia",
      lastName: "Ferreira",
      email: "alicia@example.org",
      status: "lead",
      source: "manual",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing email", () => {
    const result = contactSchema.safeParse({
      firstName: "Alicia",
      lastName: "Ferreira",
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing first name", () => {
    const result = contactSchema.safeParse({
      firstName: "",
      lastName: "Ferreira",
      email: "alicia@example.org",
    });
    expect(result.success).toBe(false);
  });
});
