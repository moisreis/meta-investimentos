import { describe, it, expect } from "vitest"
import { Fund } from "@/domain/fund/entities/fund.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { CNPJ } from "@/value-objects/cnpj.vo"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"
import { buildFund } from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  advanceTime,
} from "__tests__/__setup__/_clock.setup"

describe("Fund", () => {
  describe("create", () => {
    it("should create a valid Fund with required props", () => {
      const fund = Fund.create({
        cnpj: CNPJ.create("11222333000181"),
        name: "Fundo Teste",
        bankId: EntityId.create("bank-1"),
      })

      expect(fund.cnpj).toBeInstanceOf(Object)
      expect(fund.name).toBe("Fundo Teste")
      expect(fund.bankId).toBe(EntityId.create("bank-1"))
      expect(fund.administrationFee).toBeNull()
      expect(fund.performanceFee).toBeNull()
      expect(fund.benchmarkId).toBeNull()
      expect(fund.categoryId).toBeNull()
      expect(fund.id).toBeUndefined()
      expect(fund.createdAt).toBeInstanceOf(Date)
      expect(fund.updatedAt).toBeInstanceOf(Date)
    })

    it("should create a Fund with provided id", () => {
      const id = EntityId.create("fund-123")
      const fund = Fund.create(
        {
          cnpj: CNPJ.create("11222333000181"),
          name: "Fundo Teste",
          bankId: EntityId.create("bank-1"),
        },
        id
      )

      expect(fund.id).toBe(id)
    })

    it("should create a Fund with custom timestamps", () => {
      const createdAt = new Date("2026-01-01T00:00:00.000Z")
      const updatedAt = new Date("2026-01-15T12:00:00.000Z")
      const fund = Fund.create({
        cnpj: CNPJ.create("11222333000181"),
        name: "Fundo Teste",
        bankId: EntityId.create("bank-1"),
        createdAt,
        updatedAt,
      })

      expect(fund.createdAt).toEqual(createdAt)
      expect(fund.updatedAt).toEqual(updatedAt)
    })

    it("should create a Fund with optional fees and references", () => {
      const fund = Fund.create({
        cnpj: CNPJ.create("11222333000181"),
        name: "Fundo Completo",
        bankId: EntityId.create("bank-1"),
        administrationFee: SignedPercentage.create("1.5"),
        performanceFee: SignedPercentage.create("20.0"),
        benchmarkId: EntityId.create("benchmark-1"),
        categoryId: EntityId.create("category-1"),
      })

      expect(fund.administrationFee).not.toBeNull()
      expect(fund.administrationFee!.value.toFixed(2)).toBe(
        "1.50"
      )
      expect(fund.performanceFee).not.toBeNull()
      expect(fund.performanceFee!.value.toFixed(2)).toBe("20.00")
      expect(fund.benchmarkId).not.toBeNull()
      expect(fund.categoryId).not.toBeNull()
    })

    it("should throw ValidationError when cnpj is missing", () => {
      expect(() =>
        Fund.create({
          name: "Fundo Teste",
          bankId: EntityId.create("bank-1"),
        } as Parameters<typeof Fund.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when name is empty", () => {
      expect(() =>
        Fund.create({
          cnpj: CNPJ.create("11222333000181"),
          name: "",
          bankId: EntityId.create("bank-1"),
        })
      ).toThrow(ValidationError)
      expect(() =>
        Fund.create({
          cnpj: CNPJ.create("11222333000181"),
          name: "   ",
          bankId: EntityId.create("bank-1"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when bankId is empty", () => {
      expect(() =>
        Fund.create({
          cnpj: CNPJ.create("11222333000181"),
          name: "Fundo Teste",
          bankId: EntityId.create(""),
        } as Parameters<typeof Fund.create>[0])
      ).toThrow(ValidationError)
    })
  })

  describe("update", () => {
    it("should return new Fund with updated name", () => {
      useFixedClock()
      const fund = buildFund({ name: "Fundo Original" })
      advanceTime(1000)
      const updated = fund.update({ name: "Fundo Atualizado" })

      expect(updated.name).toBe("Fundo Atualizado")
      expect(updated.id).toBe(fund.id)
      expect(updated.updatedAt).not.toEqual(fund.updatedAt)
      // Original unchanged
      expect(fund.name).toBe("Fundo Original")
    })

    it("should return new Fund with updated administrationFee", () => {
      const fund = buildFund()
      const updated = fund.update({
        administrationFee: SignedPercentage.create("2.0"),
      })

      expect(updated.administrationFee).not.toBeNull()
      expect(updated.administrationFee!.value.toFixed(2)).toBe(
        "2.00"
      )
      expect(updated.id).toBe(fund.id)
    })

    it("should return new Fund with cleared administrationFee (null)", () => {
      const fund = buildFund({
        administrationFee: SignedPercentage.create("1.5"),
      })
      const updated = fund.update({ administrationFee: null })

      expect(updated.administrationFee).toBeNull()
      expect(updated.id).toBe(fund.id)
    })

    it("should return new Fund with updated performanceFee", () => {
      const fund = buildFund()
      const updated = fund.update({
        performanceFee: SignedPercentage.create("15.0"),
      })

      expect(updated.performanceFee).not.toBeNull()
      expect(updated.performanceFee!.value.toFixed(2)).toBe(
        "15.00"
      )
    })

    it("should return new Fund with updated benchmarkId", () => {
      const fund = buildFund()
      const updated = fund.update({
        benchmarkId: EntityId.create("benchmark-new"),
      })

      expect(updated.benchmarkId).toBe(
        EntityId.create("benchmark-new")
      )
    })

    it("should return new Fund with cleared benchmarkId (null)", () => {
      const fund = buildFund({
        benchmarkId: EntityId.create("benchmark-1"),
      })
      const updated = fund.update({ benchmarkId: null })

      expect(updated.benchmarkId).toBeNull()
    })

    it("should return new Fund with updated categoryId", () => {
      const fund = buildFund()
      const updated = fund.update({
        categoryId: EntityId.create("category-new"),
      })

      expect(updated.categoryId).toBe(
        EntityId.create("category-new")
      )
    })

    it("should return new Fund with multiple fields updated", () => {
      const fund = buildFund()
      const updated = fund.update({
        name: "Fundo Atualizado",
        administrationFee: SignedPercentage.create("2.5"),
        benchmarkId: null,
      })

      expect(updated.name).toBe("Fundo Atualizado")
      expect(updated.administrationFee).not.toBeNull()
      expect(updated.administrationFee!.value.toFixed(2)).toBe(
        "2.50"
      )
      expect(updated.benchmarkId).toBeNull()
      expect(updated.id).toBe(fund.id)
    })

    it("should throw ValidationError when new name is empty", () => {
      const fund = buildFund()
      expect(() => fund.update({ name: "" })).toThrow(
        ValidationError
      )
      expect(() => fund.update({ name: "   " })).toThrow(
        ValidationError
      )
    })

    it("should accept optional now parameter for updatedAt", () => {
      const fund = buildFund()
      const now = new Date("2026-06-15T10:00:00.000Z")
      const updated = fund.update({ name: "Novo Nome" }, now)

      expect(updated.updatedAt).toEqual(now)
    })
  })

  describe("equals", () => {
    it("should return true for same instance", () => {
      const fund = buildFund()
      expect(fund.equals(fund)).toBe(true)
    })

    it("should return true for different instances with same id", () => {
      const id = EntityId.create("fund-123")
      const fund1 = Fund.create(
        {
          cnpj: CNPJ.create("11222333000181"),
          name: "Fundo Teste",
          bankId: EntityId.create("bank-1"),
        },
        id
      )
      const fund2 = Fund.create(
        {
          cnpj: CNPJ.create("11222333000181"),
          name: "Fundo Teste",
          bankId: EntityId.create("bank-1"),
        },
        id
      )

      expect(fund1.equals(fund2)).toBe(true)
    })

    it("should return false for different ids", () => {
      const fund1 = Fund.create(
        {
          cnpj: CNPJ.create("11222333000181"),
          name: "Fundo Teste",
          bankId: EntityId.create("bank-1"),
        },
        EntityId.create("fund-1")
      )
      const fund2 = Fund.create(
        {
          cnpj: CNPJ.create("11222333000181"),
          name: "Fundo Teste",
          bankId: EntityId.create("bank-1"),
        },
        EntityId.create("fund-2")
      )

      expect(fund1.equals(fund2)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const fund1 = Fund.create({
        cnpj: CNPJ.create("11222333000181"),
        name: "Fundo Teste",
        bankId: EntityId.create("bank-1"),
      })
      const fund2 = Fund.create(
        {
          cnpj: CNPJ.create("11222333000181"),
          name: "Fundo Teste",
          bankId: EntityId.create("bank-1"),
        },
        EntityId.create("fund-1")
      )

      expect(fund1.equals(fund2)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const fund1 = Fund.create(
        {
          cnpj: CNPJ.create("11222333000181"),
          name: "Fundo Teste",
          bankId: EntityId.create("bank-1"),
        },
        EntityId.create("fund-1")
      )
      const fund2 = Fund.create({
        cnpj: CNPJ.create("11222333000181"),
        name: "Fundo Teste",
        bankId: EntityId.create("bank-1"),
      })

      expect(fund1.equals(fund2)).toBe(false)
    })

    it("should return false when comparing to null", () => {
      const fund = buildFund()
      expect(fund.equals(null)).toBe(false)
    })

    it("should return false when comparing to undefined", () => {
      const fund = buildFund()
      expect(fund.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const fund = buildFund()

      expect(() => {
        // @ts-expect-error - testing immutability by attempting to mutate readonly property
        fund.name = "Novo Nome"
      }).toThrow()
    })

    it("should return new instances on mutations", () => {
      const fund = buildFund()
      const updated = fund.update({ name: "Novo Nome" })

      expect(updated).not.toBe(fund)
    })
  })
})
