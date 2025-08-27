import { describe, it, expect } from "vitest";
import { contactSchema } from "@/lib/validation";

describe("contactSchema", () => {
  it("should validate a valid contact form", () => {
    const validData = {
      name: "John Doe",
      company: "",
      phone: "555-123-4567",
      email: "john@example.com",
      jobAddress: "123 Main St",
      municipality: "Philadelphia",
      inspectionType: "Rough-In Electrical Inspection",
      preferred: "Morning",
      notes: "Test notes",
      _hp: "",
    };

    const result = contactSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should validate a contact form without company", () => {
    const validData = {
      name: "Jane Doe",
      company: null,
      phone: "555-987-6543",
      email: "jane@example.com",
      jobAddress: "456 Oak Ave",
      municipality: "Philadelphia",
      inspectionType: "Final Electrical Inspection",
      preferred: "Afternoon",
      notes: "",
      _hp: "",
    };

    const result = contactSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});

