import { describe, expect, it } from "vitest";

import QuotaPrice from "@/business/value-objects/quota-price.vo";

describe("QuotaPrice", () => {
  describe("create", () => {
    it("creates a valid instance from a string value", () => {
      const PRICE = QuotaPrice.create("1.035742");

      expect(PRICE.value.toString()).toBe("1.035742");
    });

    it("creates a valid instance from zero", () => {
      const PRICE = QuotaPrice.create("0");

      expect(PRICE.value.toString()).toBe("0");
    });

    it("creates a valid instance from a number value", () => {
      const PRICE = QuotaPrice.create(1.035742);

      expect(PRICE.value.toString()).toBe("1.035742");
    });

    it("rounds the value to 6 decimal places", () => {
      const PRICE = QuotaPrice.create("1.123456789");

      expect(PRICE.value.toString()).toBe("1.123457");
    });

    it("preserves precision when the value has fewer than 6 decimal places", () => {
      const PRICE = QuotaPrice.create("1.05");

      expect(PRICE.value.toString()).toBe("1.05");
    });

    it("throws when value is undefined", () => {
      expect(() =>
        // @ts-expect-error: testing runtime validation for undefined
        QuotaPrice.create(undefined),
      ).toThrow("`QuotaPrice` must be defined.");
    });

    it("throws when value is null", () => {
      expect(() =>
        // @ts-expect-error: testing runtime validation for null
        QuotaPrice.create(null),
      ).toThrow("`QuotaPrice` must be defined.");
    });

    it("throws when value is negative", () => {
      expect(() => QuotaPrice.create("-1")).toThrow(
        "`QuotaPrice` must be equal or greater than 0.",
      );
    });
  });

  describe("equals", () => {
    it("returns true for two instances with the same value", () => {
      const A = QuotaPrice.create("10");
      const B = QuotaPrice.create("10.000000");

      expect(QuotaPrice.equals(A, B)).toBe(true);
    });

    it("returns false for two instances with different values", () => {
      const A = QuotaPrice.create("1.035742");
      const B = QuotaPrice.create("1.036286");

      expect(QuotaPrice.equals(A, B)).toBe(false);
    });
  });
});
