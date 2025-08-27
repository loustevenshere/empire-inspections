import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/validation";

describe("contactSchema", () => {
  it("validates a correct payload", () => {
    const parsed = contactSchema.safeParse({
      name: "Alice",
      company: "",
      phone: "5551234567",
      email: "alice@example.com",
      jobAddress: "1 Main St",
      municipality: "Albany",
      inspectionType: "General",
      preferred: "Tomorrow",
      notes: "",
      _hp: "",
    });
    expect(parsed.success).toBe(true);
  });

  it("fails on invalid email", () => {
    const parsed = contactSchema.safeParse({
      name: "Alice",
      company: "",
      phone: "5551234567",
      email: "not-an-email",
      jobAddress: "1 Main St",
      municipality: "Albany",
      inspectionType: "General",
      preferred: "Tomorrow",
      notes: "",
    });
    expect(parsed.success).toBe(false);
  });
});

