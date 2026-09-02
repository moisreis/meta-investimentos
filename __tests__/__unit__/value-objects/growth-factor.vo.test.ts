import { describe, expect, it } from "vitest";

import { GrowthFactor } from "@/business/value-objects/growth-factor.vo";

describe("GrowthFactor", () => {
  describe("create", () => {
    it("creates a valid instance from a string value", () => {
      const GROWTH = GrowthFactor.create("1.05");

      expect(GROWTH.value.toString()).toBe("1.05");
    });

    it("creates a valid instance from zero", () => {
      const GROWTH = GrowthFactor.create("0");

      expect(GROWTH.value.toString()).toBe("0");
    });

    it("creates a valid instance from a number value", () => {
      const GROWTH = GrowthFactor.create(1.05);

      expect(GROWTH.value.toString()).toBe("1.05");
    });

    it("rounds the value to 8 decimal places", () => {
      const GROWTH = GrowthFactor.create("1.123456789");

      expect(GROWTH.value.toString()).toBe("1.12345679");
    });

    it("preserves precision when the value has fewer than 8 decimal places", () => {
      const GROWTH = GrowthFactor.create("1.00024821");

      expect(GROWTH.value.toString()).toBe("1.00024821");
    });

    it("throws when value is undefined", () => {
      expect(() =>
        // @ts-expect-error: testing runtime validation for undefined
        GrowthFactor.create(undefined),
      ).toThrow("`GrowthFactor` must be defined.");
    });

    it("throws when value is null", () => {
      expect(() =>
        // @ts-expect-error: testing runtime validation for null
        GrowthFactor.create(null),
      ).toThrow("`GrowthFactor` must be defined.");
    });

    it("throws when value is negative", () => {
      expect(() => GrowthFactor.create("-1")).toThrow(
        "`GrowthFactor` must be equal or greater than 0.",
      );
    });
  });

  describe("isLoss", () => {
    it("returns true when the value is less than 1", () => {
      const GROWTH = GrowthFactor.create("0.95");

      expect(GROWTH.isLoss).toBe(true);
    });

    it("returns false when the value equals 1", () => {
      const GROWTH = GrowthFactor.create("1");

      expect(GROWTH.isLoss).toBe(false);
    });

    it("returns false when the value is greater than 1", () => {
      const GROWTH = GrowthFactor.create("1.05");

      expect(GROWTH.isLoss).toBe(false);
    });
  });

  describe("isGain", () => {
    it("returns true when the value is greater than 1", () => {
      const GROWTH = GrowthFactor.create("1.05");

      expect(GROWTH.isGain).toBe(true);
    });

    it("returns false when the value equals 1", () => {
      const GROWTH = GrowthFactor.create("1");

      expect(GROWTH.isGain).toBe(false);
    });

    it("returns false when the value is less than 1", () => {
      const GROWTH = GrowthFactor.create("0.95");

      expect(GROWTH.isGain).toBe(false);
    });
  });

  describe("isFlat", () => {
    it("returns true when the value equals 1", () => {
      const GROWTH = GrowthFactor.create("1");

      expect(GROWTH.isFlat).toBe(true);
    });

    it("returns false when the value is less than 1", () => {
      const GROWTH = GrowthFactor.create("0.95");

      expect(GROWTH.isFlat).toBe(false);
    });

    it("returns false when the value is greater than 1", () => {
      const GROWTH = GrowthFactor.create("1.05");

      expect(GROWTH.isFlat).toBe(false);
    });
  });

  describe("toPercentage", () => {
    it("converts a gain to a positive percentage", () => {
      const GROWTH = GrowthFactor.create("1.25");

      expect(GROWTH.toPercentage().toString()).toBe("25");
    });

    it("converts a loss to a negative percentage", () => {
      const GROWTH = GrowthFactor.create("0.8");

      expect(GROWTH.toPercentage().toString()).toBe("-20");
    });

    it("converts a flat factor to zero percentage", () => {
      const GROWTH = GrowthFactor.create("1");

      expect(GROWTH.toPercentage().toString()).toBe("0");
    });
  });

  describe("equals", () => {
    it("returns true for two instances with the same value", () => {
      const A = GrowthFactor.create("1.00000000");
      const B = GrowthFactor.create("1");

      expect(GrowthFactor.equals(A, B)).toBe(true);
    });

    it("returns false for two instances with different values", () => {
      const A = GrowthFactor.create("1.01");
      const B = GrowthFactor.create("1.02");

      expect(GrowthFactor.equals(A, B)).toBe(false);
    });
  });
});
