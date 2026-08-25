import { describe, expect, it } from "vitest";

import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";

describe("QuotaQuantity", () => {
  describe("create", () => {
    it("creates a valid instance from a string value", () => {
      const QUANTITY = QuotaQuantity.create("38619.656246");

      expect(QUANTITY.value.toString()).toBe("38619.656246");
    });

    it("creates a valid instance from zero", () => {
      const QUANTITY = QuotaQuantity.create("0");

      expect(QUANTITY.value.toString()).toBe("0");
    });

    it("creates a valid instance from a number value", () => {
      const QUANTITY = QuotaQuantity.create(100.5);

      expect(QUANTITY.value.toString()).toBe("100.5");
    });

    it("rounds the value to 6 decimal places", () => {
      const QUANTITY = QuotaQuantity.create("10.123456789");

      expect(QUANTITY.value.toString()).toBe("10.123457");
    });

    it("preserves precision when the value has fewer than 6 decimal places", () => {
      const QUANTITY = QuotaQuantity.create("100");

      expect(QUANTITY.value.toString()).toBe("100");
    });

    it("throws when value is undefined", () => {
      expect(() =>
        // @ts-expect-error: testing runtime validation for undefined
        QuotaQuantity.create(undefined),
      ).toThrow("`QuotaQuantity` must be defined.");
    });

    it("throws when value is null", () => {
      expect(() =>
        // @ts-expect-error: testing runtime validation for null
        QuotaQuantity.create(null),
      ).toThrow("`QuotaQuantity` must be defined.");
    });

    it("throws when value is negative", () => {
      expect(() => QuotaQuantity.create("-1")).toThrow(
        "`QuotaQuantity` must be equal or greater than 0.",
      );
    });
  });

  describe("equals", () => {
    it("returns true for two instances with the same value", () => {
      const A = QuotaQuantity.create("10");
      const B = QuotaQuantity.create("10.000000");

      expect(QuotaQuantity.equals(A, B)).toBe(true);
    });

    it("returns false for two instances with different values", () => {
      const A = QuotaQuantity.create("98279.556789");
      const B = QuotaQuantity.create("136899.213035");

      expect(QuotaQuantity.equals(A, B)).toBe(false);
    });
  });
});
