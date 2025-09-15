// src/config/contact.ts
export const BUSINESS_PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "215-839-8997";

export function toTelHref(num: string) { 
  return `tel:${num.replace(/[^0-9+]/g, "")}`; 
}

export function formatPhone(num: string) {
  const digits = num.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return `(${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  return num;
}
