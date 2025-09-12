// src/lib/phone.ts
export function toTelHref(e164: string) {
  // Normalize just in case; ensure starts with +
  const clean = e164.replace(/[^+\d]/g, "");
  return `tel:${clean.startsWith("+") ? clean : `+${clean}`}`;
}

// Basic human formatter for US numbers; falls back to raw if not 10 digits
export function formatPhoneHuman(raw: string) {
  const digits = raw.replace(/\D/g, "");
  // Try to strip +1 if present
  const d10 = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (d10.length !== 10) return raw;
  return `${d10.slice(0,3)}-${d10.slice(3,6)}-${d10.slice(6)}`;
}
