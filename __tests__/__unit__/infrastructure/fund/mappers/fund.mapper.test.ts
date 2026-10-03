import { describe, it, expect } from "vitest"

import { Fund } from "@/domain/fund/entities/fund.entity"
import { CNPJ } from "@/value-objects/cnpj.vo"
import { EntityId } from "@/value-objects"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "@/infrastructure/fund/mappers/fund.mapper"
import { buildFund } from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000023"
const BANK_ID = "00000000-0000-0000-0000-000000000001"
const BENCHMARK_ID = "00000000-0000-0000-0000-000000000010"
const CATEGORY_ID = "00000000-0000-0000-0000-000000000021"

describe("infrastructure/fund/mappers/fund.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to Fund entity", () => {
      const row = {
        id: ID,
        cnpj: "11222333000181",
        name: "Fundo Teste",
        administrationFee: "1.000000",
        performanceFee: "2.000000",
        bankId: BANK_ID,
        benchmarkId: BENCHMARK_ID,
        categoryId: CATEGORY_ID,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-15T12:00:00.000Z"),
      }

      const fund = ToDomain(row)

      expect(fund.id).toBe(EntityId.create(ID))
      expect(fund.cnpj.value).toBe("11222333000181")
      expect(fund.name).toBe("Fundo Teste")
      expect(fund.administrationFee!.value.toFixed(2)).toBe(
        "1.00"
      )
      expect(fund.performanceFee!.value.toFixed(2)).toBe("2.00")
      expect(fund.bankId).toBe(EntityId.create(BANK_ID))
      expect(fund.benchmarkId).toBe(
        EntityId.create(BENCHMARK_ID)
      )
      expect(fund.categoryId).toBe(EntityId.create(CATEGORY_ID))
      expect(fund.createdAt).toEqual(row.createdAt)
      expect(fund.updatedAt).toEqual(row.updatedAt)
    })

    it("should map null optional columns to null", () => {
      const row = {
        id: ID,
        cnpj: "11222333000181",
        name: "Fundo Teste",
        administrationFee: null,
        performanceFee: null,
        bankId: BANK_ID,
        benchmarkId: null,
        categoryId: null,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      }

      const fund = ToDomain(row)

      expect(fund.administrationFee).toBeNull()
      expect(fund.performanceFee).toBeNull()
      expect(fund.benchmarkId).toBeNull()
      expect(fund.categoryId).toBeNull()
    })
  })

  describe("ToInsert", () => {
    it("should map Fund entity to insert object without id", () => {
      const fund = buildFund()

      const insert = ToInsert(fund)

      expect(insert).not.toHaveProperty("id")
      expect(insert.cnpj).toBe("11222333000181")
      expect(insert.name).toBe(fund.name)
      expect(insert.administrationFee).toBe(
        fund.administrationFee!.value.toString()
      )
      expect(insert.performanceFee).toBe(
        fund.performanceFee!.value.toString()
      )
      expect(insert.bankId).toBe("bank-1")
      expect(insert.benchmarkId).toBe("benchmark-1")
      expect(insert.categoryId).toBe("category-1")
      expect(insert.createdAt).toEqual(fund.createdAt)
      expect(insert.updatedAt).toEqual(fund.updatedAt)
    })

    it("should map absent optional values to null", () => {
      const fund = buildFund({
        administrationFee: null,
        performanceFee: null,
        benchmarkId: null,
        categoryId: null,
      })

      const insert = ToInsert(fund)

      expect(insert.administrationFee).toBeNull()
      expect(insert.performanceFee).toBeNull()
      expect(insert.benchmarkId).toBeNull()
      expect(insert.categoryId).toBeNull()
    })
  })

  describe("ToUpdate", () => {
    it("should map Fund entity to update object without timestamps", () => {
      const fund = buildFund()

      const update = ToUpdate(fund)

      expect(update).not.toHaveProperty("id")
      expect(update).not.toHaveProperty("createdAt")
      expect(update).not.toHaveProperty("updatedAt")
      expect(update.name).toBe(fund.name)
      expect(update.cnpj).toBe("11222333000181")
    })
  })

  describe("round-trip", () => {
    it("should preserve the entity through ToInsert then ToDomain", () => {
      const original = Fund.create(
        {
          cnpj: CNPJ.create("11222333000181"),
          name: "Fundo Teste",
          administrationFee: SignedPercentage.create("1.00"),
          performanceFee: SignedPercentage.create("2.00"),
          bankId: EntityId.create(BANK_ID),
          benchmarkId: EntityId.create(BENCHMARK_ID),
          categoryId: EntityId.create(CATEGORY_ID),
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        ID
      )

      const row = {
        ...ToInsert(original),
        id: original.id!,
      } as Parameters<typeof ToDomain>[0]
      const restored = ToDomain(row)

      expect(restored.equals(original)).toBe(true)
      expect(restored.cnpj.value).toBe("11222333000181")
    })

    it("should preserve the entity through ToUpdate then ToDomain", () => {
      const original = Fund.create(
        {
          cnpj: CNPJ.create("11222333000181"),
          name: "Fundo Teste",
          bankId: EntityId.create(BANK_ID),
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        ID
      )

      const row = {
        ...ToUpdate(original),
        id: original.id!,
        createdAt: original.createdAt,
        updatedAt: original.updatedAt,
      } as Parameters<typeof ToDomain>[0]

      expect(ToDomain(row).equals(original)).toBe(true)
    })
  })
})
