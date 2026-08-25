import { describe, expect, it } from "vitest";

import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

describe("SignedPercentage", () => {
  describe("create", () => {
    it("creates a valid instance from a positive string value", () => {
      const PERCENTAGE = SignedPercentage.create("10.50");

      expect(PERCENTAGE.value.toString()).toBe("10.5");
    });

    it("creates a valid instance from a negative string value", () => {
      const PERCENTAGE = SignedPercentage.create("-10.50");

      expect(PERCENTAGE.value.toString()).toBe("-10.5");
    });

    it("creates a valid instance from zero", () => {
      const PERCENTAGE = SignedPercentage.create("0");

      expect(PERCENTAGE.value.toString()).toBe("0");
    });

    it("creates a valid instance from a number value", () => {
      const PERCENTAGE = SignedPercentage.create(10.5);

      expect(PERCENTAGE.value.toString()).toBe("10.5");
    });

    it("rounds the value to 2 decimal places", () => {
      const PERCENTAGE = SignedPercentage.create("10.126");

      expect(PERCENTAGE.value.toString()).toBe("10.13");
    });

    it("rounds a negative value to 2 decimal places", () => {
      const PERCENTAGE = SignedPercentage.create("-10.126");

      expect(PERCENTAGE.value.toString()).toBe("-10.13");
    });

    it("preserves precision when the value has fewer than 2 decimal places", () => {
      const PERCENTAGE = SignedPercentage.create("10");

      expect(PERCENTAGE.value.toString()).toBe("10");
    });

    it("throws when value is undefined", () => {
      expect(() =>
        // @ts-expect-error: testing runtime validation for undefined
        SignedPercentage.create(undefined),
      ).toThrow("`SignedPercentage` must be defined.");
    });

    it("throws when value is null", () => {
      expect(() =>
        // @ts-expect-error: testing runtime validation for null
        SignedPercentage.create(null),
      ).toThrow("`SignedPercentage` must be defined.");
    });
  });

  describe("isNegative", () => {
    it("returns true for a negative value", () => {
      const PERCENTAGE = SignedPercentage.create("-10");

      expect(PERCENTAGE.isNegative).toBe(true);
    });

    it("returns false for a positive value", () => {
      const PERCENTAGE = SignedPercentage.create("10");

      expect(PERCENTAGE.isNegative).toBe(false);
    });

    it("returns false for zero", () => {
      const PERCENTAGE = SignedPercentage.create("0");

      expect(PERCENTAGE.isNegative).toBe(false);
    });
  });

  describe("isPositive", () => {
    it("returns true for a positive value", () => {
      const PERCENTAGE = SignedPercentage.create("10");

      expect(PERCENTAGE.isPositive).toBe(true);
    });

    it("returns false for a negative value", () => {
      const PERCENTAGE = SignedPercentage.create("-10");

      expect(PERCENTAGE.isPositive).toBe(false);
    });

    it("returns false for zero", () => {
      const PERCENTAGE = SignedPercentage.create("0");

      expect(PERCENTAGE.isPositive).toBe(false);
    });
  });

  describe("isZero", () => {
    it("returns true for zero", () => {
      const PERCENTAGE = SignedPercentage.create("0");

      expect(PERCENTAGE.isZero).toBe(true);
    });

    it("returns false for a positive value", () => {
      const PERCENTAGE = SignedPercentage.create("10");

      expect(PERCENTAGE.isZero).toBe(false);
    });

    it("returns false for a negative value", () => {
      const PERCENTAGE = SignedPercentage.create("-10");

      expect(PERCENTAGE.isZero).toBe(false);
    });
  });

  describe("equals", () => {
    it("returns true for two instances with the same value", () => {
      const A = SignedPercentage.create("10");
      const B = SignedPercentage.create("10.00");

      expect(SignedPercentage.equals(A, B)).toBe(true);
    });

    it("returns false for two instances with different values", () => {
      const A = SignedPercentage.create("10");
      const B = SignedPercentage.create("20");

      expect(SignedPercentage.equals(A, B)).toBe(false);
    });
  });
});
