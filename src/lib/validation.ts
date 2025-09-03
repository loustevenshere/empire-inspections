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
  jobAddress: z.string().min(3, "Job address required"),
  municipality: z.string().min(2, "Municipality required"),
  inspectionType: z.string().min(1, "Please select an inspection type").refine((val) => inspectionTypeEnum.options.includes(val as z.infer<typeof inspectionTypeEnum>), "Please select a valid inspection type"),
  preferred: z.string().min(2, "Please share a preferred time"),
  notes: z.string().max(2000).optional().nullable(),
  _hp: z.string().optional().nullable(),
});

export type ContactForm = z.infer<typeof contactSchema>;

