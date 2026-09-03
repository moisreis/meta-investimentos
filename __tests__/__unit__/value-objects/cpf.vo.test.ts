import { describe, expect, it } from "vitest";

import { CPF } from "@/business/value-objects/cpf.vo";

const VALID_CPF = "52998224725";
const VALID_CPF_FORMATTED = "529.982.247-25";
const DIFFERENT_CPF = "12345678909";

describe("CPF", () => {
  describe("create", () => {
    it("creates a CPF from unformatted digits", () => {
      const RESULT = CPF.create(VALID_CPF);

      expect(RESULT.value).toBe(VALID_CPF);
    });

    it("creates a CPF from formatted input", () => {
      const RESULT = CPF.create(VALID_CPF_FORMATTED);

      expect(RESULT.value).toBe(VALID_CPF);
    });

    it("strips spaces from the input", () => {
      const RESULT = CPF.create("529 982 247 25");

      expect(RESULT.value).toBe(VALID_CPF);
    });

    it("throws when the value is undefined", () => {
      // @ts-expect-error — testing runtime validation
      expect(() => CPF.create(undefined)).toThrow("`CPF` must be defined.");
    });

    it("throws when the value is null", () => {
      // @ts-expect-error — testing runtime validation
      expect(() => CPF.create(null)).toThrow("`CPF` must be defined.");
    });

    it("throws when the value is blank", () => {
      expect(() => CPF.create("   ")).toThrow("`CPF` must not be blank.");
    });

    it("throws when the value has fewer than 11 digits", () => {
      expect(() => CPF.create("1234567890")).toThrow(
        "`CPF` must contain exactly 11 digits.",
      );
    });

    it("throws when the value has more than 11 digits", () => {
      expect(() => CPF.create("123456789012")).toThrow(
        "`CPF` must contain exactly 11 digits.",
      );
    });

    it("throws when the check digits are invalid", () => {
      expect(() => CPF.create("12345678901")).toThrow(
        "`CPF` must pass the check-digit algorithm.",
      );
    });

    it("throws when all digits are the same", () => {
      expect(() => CPF.create("11111111111")).toThrow(
        "`CPF` must not be a sequence of identical digits.",
      );
    });

    it("throws for another sequence of identical digits", () => {
      expect(() => CPF.create("00000000000")).toThrow(
        "`CPF` must not be a sequence of identical digits.",
      );
    });
  });

  describe("equals", () => {
    it("returns true for identical CPFs", () => {
      const A = CPF.create(VALID_CPF);
      const B = CPF.create(VALID_CPF);

      expect(CPF.equals(A, B)).toBe(true);
    });

    it("returns true for formatted and unformatted inputs", () => {
      const A = CPF.create(VALID_CPF);
      const B = CPF.create(VALID_CPF_FORMATTED);

      expect(CPF.equals(A, B)).toBe(true);
    });

    it("returns false for different CPFs", () => {
      const A = CPF.create(VALID_CPF);
      const B = CPF.create(DIFFERENT_CPF);

      expect(CPF.equals(A, B)).toBe(false);
    });
  });
});
