import { describe, expect, it } from "vitest";

import SignedMoney from "@/business/value-objects/signed-money.vo";

describe("SignedMoney", () => {
  describe("create", () => {
    it("creates a valid instance from a positive string value", () => {
      const MONEY = SignedMoney.create("100.50");

      expect(MONEY.value.toString()).toBe("100.5");
    });

    it("creates a valid instance from a negative string value", () => {
      const MONEY = SignedMoney.create("-100.50");

      expect(MONEY.value.toString()).toBe("-100.5");
    });

    it("creates a valid instance from zero", () => {
      const MONEY = SignedMoney.create("0");

      expect(MONEY.value.toString()).toBe("0");
    });

    it("creates a valid instance from a number value", () => {
      const MONEY = SignedMoney.create(100.5);

      expect(MONEY.value.toString()).toBe("100.5");
    });

    it("rounds the value to 2 decimal places", () => {
      const MONEY = SignedMoney.create("10.123");

      expect(MONEY.value.toString()).toBe("10.12");
    });

    it("rounds a negative value to 2 decimal places", () => {
      const MONEY = SignedMoney.create("-10.126");

      expect(MONEY.value.toString()).toBe("-10.13");
    });

    it("preserves precision when the value has fewer than 2 decimal places", () => {
      const MONEY = SignedMoney.create("10");

      expect(MONEY.value.toString()).toBe("10");
    });

    it("throws when value is undefined", () => {
      expect(() =>
        // @ts-expect-error: testing runtime validation for undefined
        SignedMoney.create(undefined),
      ).toThrow("`SignedMoney` must be defined.");
    });

    it("throws when value is null", () => {
      expect(() =>
        // @ts-expect-error: testing runtime validation for null
        SignedMoney.create(null),
      ).toThrow("`SignedMoney` must be defined.");
    });
  });

  describe("isNegative", () => {
    it("returns true for a negative value", () => {
      const MONEY = SignedMoney.create("-100");

      expect(MONEY.isNegative).toBe(true);
    });

    it("returns false for a positive value", () => {
      const MONEY = SignedMoney.create("100");

      expect(MONEY.isNegative).toBe(false);
    });

    it("returns false for zero", () => {
      const MONEY = SignedMoney.create("0");

      expect(MONEY.isNegative).toBe(false);
    });
  });

  describe("isPositive", () => {
    it("returns true for a positive value", () => {
      const MONEY = SignedMoney.create("100");

      expect(MONEY.isPositive).toBe(true);
    });

    it("returns false for a negative value", () => {
      const MONEY = SignedMoney.create("-100");

      expect(MONEY.isPositive).toBe(false);
    });

    it("returns false for zero", () => {
      const MONEY = SignedMoney.create("0");

      expect(MONEY.isPositive).toBe(false);
    });
  });

  describe("isZero", () => {
    it("returns true for zero", () => {
      const MONEY = SignedMoney.create("0");

      expect(MONEY.isZero).toBe(true);
    });

    it("returns false for a positive value", () => {
      const MONEY = SignedMoney.create("100");

      expect(MONEY.isZero).toBe(false);
    });

    it("returns false for a negative value", () => {
      const MONEY = SignedMoney.create("-100");

      expect(MONEY.isZero).toBe(false);
    });
  });

  describe("equals", () => {
    it("returns true for two instances with the same value", () => {
      const A = SignedMoney.create("-100");
      const B = SignedMoney.create("-100.00");

      expect(SignedMoney.equals(A, B)).toBe(true);
    });

    it("returns false for two instances with different values", () => {
      const A = SignedMoney.create("100");
      const B = SignedMoney.create("-100");

      expect(SignedMoney.equals(A, B)).toBe(false);
    });
  });
});
