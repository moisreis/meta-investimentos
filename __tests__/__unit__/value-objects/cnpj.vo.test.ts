import { describe, expect, it } from "vitest";

import CNPJ from "@/business/value-objects/cnpj.vo";

const VALID_CNPJ = "12345678000195";
const VALID_CNPJ_FORMATTED = "12.345.678/0001-95";
const DIFFERENT_CNPJ = "11222333000181";
// Note: 12345678000195 and 11222333000181 are both valid CNPJs.

describe("CNPJ", () => {
  describe("create", () => {
    it("creates a CNPJ from unformatted digits", () => {
      const RESULT = CNPJ.create(VALID_CNPJ);

      expect(RESULT.value).toBe(VALID_CNPJ);
    });

    it("creates a CNPJ from formatted input", () => {
      const RESULT = CNPJ.create(VALID_CNPJ_FORMATTED);

      expect(RESULT.value).toBe(VALID_CNPJ);
    });

    it("strips spaces from the input", () => {
      const RESULT = CNPJ.create("12 345 678/0001-95");

      expect(RESULT.value).toBe(VALID_CNPJ);
    });

    it("throws when the value is undefined", () => {
      // @ts-expect-error — testing runtime validation
      expect(() => CNPJ.create(undefined)).toThrow("`CNPJ` must be defined.");
    });

    it("throws when the value is null", () => {
      // @ts-expect-error — testing runtime validation
      expect(() => CNPJ.create(null)).toThrow("`CNPJ` must be defined.");
    });

    it("throws when the value is blank", () => {
      expect(() => CNPJ.create("   ")).toThrow("`CNPJ` must not be blank.");
    });

    it("throws when the value has fewer than 14 digits", () => {
      expect(() => CNPJ.create("1234567890123")).toThrow(
        "`CNPJ` must contain exactly 14 digits.",
      );
    });

    it("throws when the value has more than 14 digits", () => {
      expect(() => CNPJ.create("123456789012345")).toThrow(
        "`CNPJ` must contain exactly 14 digits.",
      );
    });

    it("throws when the check digits are invalid", () => {
      expect(() => CNPJ.create("12345678000100")).toThrow(
        "`CNPJ` must pass the check-digit algorithm.",
      );
    });

    it("throws when all digits are the same", () => {
      expect(() => CNPJ.create("11111111111111")).toThrow(
        "`CNPJ` must not be a sequence of identical digits.",
      );
    });

    it("throws for another sequence of identical digits", () => {
      expect(() => CNPJ.create("00000000000000")).toThrow(
        "`CNPJ` must not be a sequence of identical digits.",
      );
    });
  });

  describe("equals", () => {
    it("returns true for identical CNPJs", () => {
      const A = CNPJ.create(VALID_CNPJ);
      const B = CNPJ.create(VALID_CNPJ);

      expect(CNPJ.equals(A, B)).toBe(true);
    });

    it("returns true for formatted and unformatted inputs", () => {
      const A = CNPJ.create(VALID_CNPJ);
      const B = CNPJ.create(VALID_CNPJ_FORMATTED);

      expect(CNPJ.equals(A, B)).toBe(true);
    });

    it("returns false for different CNPJs", () => {
      const A = CNPJ.create(VALID_CNPJ);
      const B = CNPJ.create(DIFFERENT_CNPJ);

      expect(CNPJ.equals(A, B)).toBe(false);
    });
  });
});
