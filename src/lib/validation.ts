import { z } from "zod";

export const inspectionTypeEnum = z.enum([
  "Rough",
  "Final",
  "Above Ceiling",
  "Service",
  "Re Intro",
  "Pool",
  "PA Pool",
]);

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().optional().nullable(),
  phone: z.string().min(7, "Phone is required"),
  email: z.string().email("Valid email required"),
  street1: z.string().min(3, "Street address is required"),
  street2: z.string().optional().nullable(),
  city: z.string().min(2, "City is required"),
  state: z.string().regex(/^[A-Z]{2}$/, "State must be a 2-letter code"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "ZIP code must be 5 or 9 digits"),
  inspectionType: z.string().min(1, "Please select an inspection type").refine((val) => inspectionTypeEnum.options.includes(val as z.infer<typeof inspectionTypeEnum>), "Please select a valid inspection type"),
  requestedDate: z.string().min(1, "Please select a requested service date"),
  notes: z.string().max(2000).optional().nullable(),
  _hp: z.string().optional().nullable(),
});

export type ContactForm = z.infer<typeof contactSchema>;

// Utility function to get today's date in YYYY-MM-DD format
export const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

