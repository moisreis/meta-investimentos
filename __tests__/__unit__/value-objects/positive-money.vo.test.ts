import { describe, expect, it } from "vitest";

import { PositiveMoney } from "@/business/value-objects/positive-money.vo";

describe("PositiveMoney", () => {
  describe("create", () => {
    it("creates a valid instance from a string value", () => {
      const MONEY = PositiveMoney.create("100.50");

      expect(MONEY.value.toString()).toBe("100.5");
    });

    it("creates a valid instance from a number value", () => {
      const MONEY = PositiveMoney.create(100.5);

      expect(MONEY.value.toString()).toBe("100.5");
    });

    it("creates a valid instance from zero", () => {
      const MONEY = PositiveMoney.create("0");

      expect(MONEY.value.toString()).toBe("0");
    });

    it("rounds the value to 2 decimal places", () => {
      const MONEY = PositiveMoney.create("10.123");

      expect(MONEY.value.toString()).toBe("10.12");
    });

    it("rounds up when the third decimal is 5 or greater", () => {
      const MONEY = PositiveMoney.create("10.125");

      expect(MONEY.value.toString()).toBe("10.13");
    });

    it("preserves precision when the value has fewer than 2 decimal places", () => {
      const MONEY = PositiveMoney.create("10");

      expect(MONEY.value.toString()).toBe("10");
    });

    it("throws when value is undefined", () => {
      expect(() =>
        // @ts-expect-error: testing runtime validation for undefined
        PositiveMoney.create(undefined),
      ).toThrow("`PositiveMoney` must be defined.");
    });

    it("throws when value is null", () => {
      expect(() =>
        // @ts-expect-error: testing runtime validation for null
        PositiveMoney.create(null),
      ).toThrow("`PositiveMoney` must be defined.");
    });

    it("throws when value is negative", () => {
      expect(() => PositiveMoney.create("-1")).toThrow(
        "`PositiveMoney` must be equal or greater than 0.",
      );
    });
  });

  describe("equals", () => {
    it("returns true for two instances with the same value", () => {
      const A = PositiveMoney.create("100");
      const B = PositiveMoney.create("100.00");

      expect(PositiveMoney.equals(A, B)).toBe(true);
    });

    it("returns false for two instances with different values", () => {
      const A = PositiveMoney.create("100");
      const B = PositiveMoney.create("200");

      expect(PositiveMoney.equals(A, B)).toBe(false);
    });
  });
});
