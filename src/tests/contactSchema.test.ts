import { describe, it, expect } from "vitest";
import { contactSchema } from "@/lib/validation";

describe("contactSchema", () => {
  it("should validate a valid contact form", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    
    const validData = {
      name: "John Doe",
      company: "",
      phone: "555-123-4567",
      email: "john@example.com",
      jobAddress: "123 Main St",
      municipality: "Philadelphia",
      inspectionType: "Rough",
      preferredDate: tomorrowString,
      preferredTime: "10:00",
      notes: "Test notes",
      _hp: "",
    };

    const result = contactSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should validate a contact form without company", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    
    const validData = {
      name: "Jane Doe",
      company: null,
      phone: "555-987-6543",
      email: "jane@example.com",
      jobAddress: "456 Oak Ave",
      municipality: "Philadelphia",
      inspectionType: "Final",
      preferredDate: tomorrowString,
      preferredTime: "14:00",
      notes: "",
      _hp: "",
    };

    const result = contactSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject time outside business hours", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    
    const invalidData = {
      name: "John Doe",
      company: "",
      phone: "555-123-4567",
      email: "john@example.com",
      jobAddress: "123 Main St",
      municipality: "Philadelphia",
      inspectionType: "Rough",
      preferredDate: tomorrowString,
      preferredTime: "05:00", // Before business hours
      notes: "Test notes",
      _hp: "",
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("7:00 AM and 6:00 PM");
    }
  });

  it("should reject time too close to now", () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const now = new Date();
    const tooSoon = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now
    const timeString = tooSoon.toTimeString().slice(0, 5);
    
    const invalidData = {
      name: "John Doe",
      company: "",
      phone: "555-123-4567",
      email: "john@example.com",
      jobAddress: "123 Main St",
      municipality: "Philadelphia",
      inspectionType: "Rough",
      preferredDate: todayString,
      preferredTime: timeString,
      notes: "Test notes",
      _hp: "",
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("at least 1 hour from now");
    }
  });

  it("should reject missing preferred date", () => {
    const invalidData = {
      name: "John Doe",
      company: "",
      phone: "555-123-4567",
      email: "john@example.com",
      jobAddress: "123 Main St",
      municipality: "Philadelphia",
      inspectionType: "Rough",
      preferredTime: "10:00",
      notes: "Test notes",
      _hp: "",
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("expected string, received undefined");
    }
  });

  it("should reject missing preferred time", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    
    const invalidData = {
      name: "John Doe",
      company: "",
      phone: "555-123-4567",
      email: "john@example.com",
      jobAddress: "123 Main St",
      municipality: "Philadelphia",
      inspectionType: "Rough",
      preferredDate: tomorrowString,
      notes: "Test notes",
      _hp: "",
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("expected string, received undefined");
    }
  });
});

