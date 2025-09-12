// src/config/contact.ts
export const phones = {
  primary: {
    label: "Primary",
    e164: "+12158398997",
    human: "215-839-8997",
  },
  secondary: {
    label: "Alternate",
    e164: "+18884199559",
    human: "888-419-9559",
  },
} as const;

export type PhoneKey = keyof typeof phones;

export function getPrimaryPhone() {
  return phones.primary;
}

export function getSecondaryPhones() {
  return [phones.secondary];
}
