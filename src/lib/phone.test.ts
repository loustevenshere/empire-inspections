import { describe, it, expect } from "vitest";
import { toTelHref, formatPhoneHuman } from "./phone";

describe("phone utilities", () => {
  it("toTelHref", () => {
    expect(toTelHref("+12158398997")).toBe("tel:+12158398997");
    expect(toTelHref("215-839-8997")).toBe("tel:+2158398997");
    expect(toTelHref("2158398997")).toBe("tel:+2158398997");
    expect(toTelHref("+18884199559")).toBe("tel:+18884199559");
    expect(toTelHref("888-419-9559")).toBe("tel:+8884199559");
  });

  it("formatPhoneHuman", () => {
    expect(formatPhoneHuman("+12158398997")).toBe("215-839-8997");
    expect(formatPhoneHuman("8884199559")).toBe("888-419-9559");
    expect(formatPhoneHuman("2158398997")).toBe("215-839-8997");
    expect(formatPhoneHuman("+18884199559")).toBe("888-419-9559");
    expect(formatPhoneHuman("1234567890")).toBe("123-456-7890");
    // Test fallback for invalid numbers
    expect(formatPhoneHuman("123")).toBe("123");
    expect(formatPhoneHuman("12345678901")).toBe("234-567-8901"); // 11 digits, strips leading 1
    expect(formatPhoneHuman("abc")).toBe("abc");
  });
});
