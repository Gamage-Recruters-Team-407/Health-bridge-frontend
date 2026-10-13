import { describe, expect, it } from "vitest";
import { validatePhoneNumber, validateProfilePhoto } from "./index";

describe("doctor profile phone validation", () => {
  it.each(["0771234567", "+94771234567", "+94 77 123 4567", "0112345678"])("accepts %s", (phone) => {
    expect(validatePhoneNumber(phone)).toBe("");
  });
  it.each(["", "+94 77 000 000", "077123456", "07712345678", "abcdefghij", "0001234567"])("rejects %s", (phone) => {
    expect(validatePhoneNumber(phone)).not.toBe("");
  });
});

describe("doctor profile photo validation", () => {
  it.each(["image/jpeg", "image/png", "image/webp"])("accepts %s", (type) => {
    expect(validateProfilePhoto({ type, size: 1024 })).toBe("");
  });
  it("rejects unsupported, empty, and oversized files", () => {
    expect(validateProfilePhoto({ type: "image/svg+xml", size: 1024 })).not.toBe("");
    expect(validateProfilePhoto({ type: "image/png", size: 0 })).not.toBe("");
    expect(validateProfilePhoto({ type: "image/png", size: 2 * 1024 * 1024 + 1 })).not.toBe("");
  });
});
