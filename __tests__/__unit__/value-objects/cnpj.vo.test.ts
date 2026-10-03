import { describe, it, expect } from "vitest"
import { CNPJ } from "@/value-objects/cnpj.vo"
import { ValidationError } from "@/errors"

const VALID_CNPJ = "11222333000181"
const VALID_CNPJ_FORMATTED = "11.222.333/0001-81"

describe("value-objects/cnpj.vo", () => {
  describe("create", () => {
    it("should create valid CNPJ from raw digits", () => {
      const cnpj = CNPJ.create(VALID_CNPJ)

      expect(cnpj).toBeInstanceOf(CNPJ)
      expect(cnpj.value).toBe(VALID_CNPJ)
    })

    it("should create valid CNPJ from formatted string", () => {
      const cnpj = CNPJ.create(VALID_CNPJ_FORMATTED)

      expect(cnpj.value).toBe(VALID_CNPJ)
    })

    it("should throw ValidationError when value is undefined", () => {
      expect(() =>
        CNPJ.create(undefined as unknown as string)
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when value is null", () => {
      expect(() =>
        CNPJ.create(null as unknown as string)
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when value is blank", () => {
      expect(() => CNPJ.create("")).toThrow(ValidationError)
      expect(() => CNPJ.create("   ")).toThrow(ValidationError)
    })

    it("should throw ValidationError when length is not 14 digits", () => {
      expect(() => CNPJ.create("1234567890123")).toThrow(
        ValidationError
      )
      expect(() => CNPJ.create("123456789012345")).toThrow(
        ValidationError
      )
    })

    it("should throw ValidationError when all digits are identical", () => {
      expect(() => CNPJ.create("11111111111111")).toThrow(
        ValidationError
      )
      expect(() => CNPJ.create("00000000000000")).toThrow(
        ValidationError
      )
    })

    it("should throw ValidationError when check digits are invalid", () => {
      expect(() => CNPJ.create("11222333000182")).toThrow(
        ValidationError
      )
      expect(() => CNPJ.create("99999999999999")).toThrow(
        ValidationError
      )
    })
  })

  describe("equals", () => {
    it("should return true for equal CNPJs", () => {
      const a = CNPJ.create(VALID_CNPJ)
      const b = CNPJ.create(VALID_CNPJ_FORMATTED)

      expect(CNPJ.equals(a, b)).toBe(true)
    })

    it("should return false for different CNPJs", () => {
      const a = CNPJ.create(VALID_CNPJ)
      // Another valid CNPJ (different company) - 12.345.678/0001-95
      const b = CNPJ.create("12345678000195")

      expect(CNPJ.equals(a, b)).toBe(false)
    })
  })

  describe("value getter", () => {
    it("should return sanitized 14-digit string", () => {
      const cnpj = CNPJ.create(VALID_CNPJ_FORMATTED)

      expect(cnpj.value).toBe(VALID_CNPJ)
      expect(cnpj.value.length).toBe(14)
    })
  })
})
