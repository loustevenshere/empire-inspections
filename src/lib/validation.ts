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

// Constants for validation
const LEAD_TIME_MINUTES = 60;
const BUSINESS_HOURS_START = 7; // 7:00 AM
const BUSINESS_HOURS_END = 18; // 6:00 PM

// Utility function to validate business hours
const isWithinBusinessHours = (time: string): boolean => {
  const [hours] = time.split(':').map(Number);
  return hours >= BUSINESS_HOURS_START && hours < BUSINESS_HOURS_END;
};

// Utility function to validate minimum lead time
const isMinimumLeadTime = (date: string, time: string): boolean => {
  const now = new Date();
  const selectedDateTime = new Date(`${date}T${time}`);
  const minDateTime = new Date(now.getTime() + LEAD_TIME_MINUTES * 60 * 1000);
  return selectedDateTime >= minDateTime;
};

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().optional().nullable(),
  phone: z.string().min(7, "Phone is required"),
  email: z.string().email("Valid email required"),
  jobAddress: z.string().min(3, "Job address required"),
  municipality: z.string().min(2, "Municipality required"),
  inspectionType: z.string().min(1, "Please select an inspection type").refine((val) => inspectionTypeEnum.options.includes(val as z.infer<typeof inspectionTypeEnum>), "Please select a valid inspection type"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
  preferredDateTime: z.string().optional(), // Will be generated from date + time
  notes: z.string().max(2000).optional().nullable(),
  _hp: z.string().optional().nullable(),
}).refine((data) => {
  if (!data.preferredDate || !data.preferredTime) return true;
  
  // Check if time is within business hours
  if (!isWithinBusinessHours(data.preferredTime)) {
    return false;
  }
  
  // Check if datetime is at least LEAD_TIME_MINUTES in the future
  if (!isMinimumLeadTime(data.preferredDate, data.preferredTime)) {
    return false;
  }
  
  return true;
}, {
  message: "Please choose a time between 7:00 AM and 6:00 PM, and ensure it's at least 1 hour from now",
  path: ["preferredTime"]
});

export type ContactForm = z.infer<typeof contactSchema>;

// Utility function to combine date and time into ISO string
export const combineDateTime = (date: string, time: string): string => {
  const localDateTime = new Date(`${date}T${time}`);
  return localDateTime.toISOString();
};

// Utility function to get today's date in YYYY-MM-DD format
export const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

