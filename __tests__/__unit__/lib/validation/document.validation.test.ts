import { describe, it, expect } from "vitest"
import {
  StripDocumentDigits,
  IsValidCpf,
  IsValidCnpj,
} from "@/lib/validation/document.validation"

const VALID_CPF = "52998224725"
const VALID_CPF_FORMATTED = "529.982.247-25"
const VALID_CNPJ = "11222333000181"
const VALID_CNPJ_FORMATTED = "11.222.333/0001-81"

describe("lib/validation/document.validation", () => {
  describe("StripDocumentDigits", () => {
    it("should strip dots and dash from CPF", () => {
      const result = StripDocumentDigits(VALID_CPF_FORMATTED)

      expect(result).toBe(VALID_CPF)
    })

    it("should strip dots, slash and dash from CNPJ", () => {
      const result = StripDocumentDigits(VALID_CNPJ_FORMATTED)

      expect(result).toBe(VALID_CNPJ)
    })

    it("should return digits only for already clean input", () => {
      const result = StripDocumentDigits(VALID_CPF)

      expect(result).toBe(VALID_CPF)
    })

    it("should handle empty string", () => {
      const result = StripDocumentDigits("")

      expect(result).toBe("")
    })

    it("should strip all non-digit characters", () => {
      const result = StripDocumentDigits("abc123def456")

      expect(result).toBe("123456")
    })
  })

  describe("IsValidCpf", () => {
    it("should return true for valid CPF", () => {
      expect(IsValidCpf(VALID_CPF)).toBe(true)
      expect(IsValidCpf(VALID_CPF_FORMATTED)).toBe(true)
    })

    it("should return false for wrong check digits", () => {
      expect(IsValidCpf("52998224726")).toBe(false)
      expect(IsValidCpf("529.982.247-26")).toBe(false)
    })

    it("should return false for all same digits", () => {
      expect(IsValidCpf("11111111111")).toBe(false)
      expect(IsValidCpf("00000000000")).toBe(false)
    })

    it("should return false for wrong length", () => {
      expect(IsValidCpf("1234567890")).toBe(false)
      expect(IsValidCpf("123456789012")).toBe(false)
    })

    it("should return false for non-digits", () => {
      expect(IsValidCpf("abc")).toBe(false)
      expect(IsValidCpf("")).toBe(false)
    })

    it("should handle edge cases with valid check digits", () => {
      // These are known valid CPFs
      expect(IsValidCpf("11144477735")).toBe(true)
      expect(IsValidCpf("26840867021")).toBe(true)
      expect(IsValidCpf("39053344705")).toBe(true)
      expect(IsValidCpf("98765432100")).toBe(true)
      expect(IsValidCpf("12345678909")).toBe(true)
    })
  })

  describe("IsValidCnpj", () => {
    it("should return true for valid CNPJ", () => {
      expect(IsValidCnpj(VALID_CNPJ)).toBe(true)
      expect(IsValidCnpj(VALID_CNPJ_FORMATTED)).toBe(true)
    })

    it("should return false for wrong check digits", () => {
      expect(IsValidCnpj("11222333000182")).toBe(false)
      expect(IsValidCnpj("11.222.333/0001-82")).toBe(false)
    })

    it("should return false for all same digits", () => {
      expect(IsValidCnpj("11111111111111")).toBe(false)
      expect(IsValidCnpj("00000000000000")).toBe(false)
    })

    it("should return false for wrong length", () => {
      expect(IsValidCnpj("1234567890123")).toBe(false)
      expect(IsValidCnpj("123456789012345")).toBe(false)
    })

    it("should return false for non-digits", () => {
      expect(IsValidCnpj("abc")).toBe(false)
      expect(IsValidCnpj("")).toBe(false)
    })
  })
})
