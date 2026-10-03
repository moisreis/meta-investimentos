import { describe, it, expect } from "vitest"
import { CPF } from "@/value-objects/cpf.vo"
import { ValidationError } from "@/errors"

const VALID_CPF = "52998224725"
const VALID_CPF_FORMATTED = "529.982.247-25"

describe("value-objects/cpf.vo", () => {
  describe("create", () => {
    it("should create valid CPF from raw digits", () => {
      const cpf = CPF.create(VALID_CPF)

      expect(cpf).toBeInstanceOf(CPF)
      expect(cpf.value).toBe(VALID_CPF)
    })

    it("should create valid CPF from formatted string", () => {
      const cpf = CPF.create(VALID_CPF_FORMATTED)

      expect(cpf.value).toBe(VALID_CPF)
    })

    it("should throw ValidationError when value is undefined", () => {
      expect(() =>
        CPF.create(undefined as unknown as string)
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when value is null", () => {
      expect(() =>
        CPF.create(null as unknown as string)
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when value is blank", () => {
      expect(() => CPF.create("")).toThrow(ValidationError)
      expect(() => CPF.create("   ")).toThrow(ValidationError)
    })

    it("should throw ValidationError when length is not 11 digits", () => {
      expect(() => CPF.create("1234567890")).toThrow(
        ValidationError
      )
      expect(() => CPF.create("123456789012")).toThrow(
        ValidationError
      )
    })

    it("should throw ValidationError when all digits are identical", () => {
      expect(() => CPF.create("11111111111")).toThrow(
        ValidationError
      )
      expect(() => CPF.create("00000000000")).toThrow(
        ValidationError
      )
    })

    it("should throw ValidationError when check digits are invalid", () => {
      expect(() => CPF.create("52998224726")).toThrow(
        ValidationError
      )
      expect(() => CPF.create("99999999999")).toThrow(
        ValidationError
      )
    })
  })

  describe("equals", () => {
    it("should return true for equal CPFs", () => {
      const a = CPF.create(VALID_CPF)
      const b = CPF.create(VALID_CPF_FORMATTED)

      expect(CPF.equals(a, b)).toBe(true)
    })

    it("should return false for different CPFs", () => {
      const a = CPF.create(VALID_CPF)
      // Another valid CPF
      const b = CPF.create("11144477735")

      expect(CPF.equals(a, b)).toBe(false)
    })
  })

  describe("value getter", () => {
    it("should return sanitized 11-digit string", () => {
      const cpf = CPF.create(VALID_CPF_FORMATTED)

      expect(cpf.value).toBe(VALID_CPF)
      expect(cpf.value.length).toBe(11)
    })
  })
})
