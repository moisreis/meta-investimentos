import { describe, it, expect } from "vitest"

import { BankAccount } from "@/domain/bank-account/entities/bank-account.entity"
import { EntityId } from "@/value-objects"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "@/infrastructure/bank-account/mappers/bank-account.mapper"
import { buildBankAccount } from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000014"
const PORTFOLIO_ID = "00000000-0000-0000-0000-000000000015"
const BANK_ID = "00000000-0000-0000-0000-000000000001"

describe("infrastructure/bank-account/mappers/bank-account.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to BankAccount entity", () => {
      const row = {
        id: ID,
        portfolioId: PORTFOLIO_ID,
        bankId: BANK_ID,
        agency: "0001",
        accountNumber: "12345-6",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-15T12:00:00.000Z"),
      }

      const bankAccount = ToDomain(row)

      expect(bankAccount.id).toBe(EntityId.create(ID))
      expect(bankAccount.portfolioId).toBe(
        EntityId.create(PORTFOLIO_ID)
      )
      expect(bankAccount.bankId).toBe(EntityId.create(BANK_ID))
      expect(bankAccount.agency).toBe("0001")
      expect(bankAccount.accountNumber).toBe("12345-6")
      expect(bankAccount.createdAt).toEqual(row.createdAt)
      expect(bankAccount.updatedAt).toEqual(row.updatedAt)
    })
  })

  describe("ToInsert", () => {
    it("should map BankAccount entity to insert object without id", () => {
      const bankAccount = buildBankAccount({
        portfolioId: EntityId.create(PORTFOLIO_ID),
        bankId: EntityId.create(BANK_ID),
      })

      const insert = ToInsert(bankAccount)

      expect(insert).not.toHaveProperty("id")
      expect(insert.portfolioId).toBe(PORTFOLIO_ID)
      expect(insert.bankId).toBe(BANK_ID)
      expect(insert.agency).toBe(bankAccount.agency)
      expect(insert.accountNumber).toBe(
        bankAccount.accountNumber
      )
      expect(insert.createdAt).toEqual(bankAccount.createdAt)
      expect(insert.updatedAt).toEqual(bankAccount.updatedAt)
    })
  })

  describe("ToUpdate", () => {
    it("should map BankAccount entity to update object without timestamps", () => {
      const bankAccount = buildBankAccount()

      const update = ToUpdate(bankAccount)

      expect(update).not.toHaveProperty("id")
      expect(update).not.toHaveProperty("createdAt")
      expect(update).not.toHaveProperty("updatedAt")
      expect(update.agency).toBe(bankAccount.agency)
      expect(update.accountNumber).toBe(
        bankAccount.accountNumber
      )
    })
  })

  describe("round-trip", () => {
    it("should preserve the entity through ToInsert then ToDomain", () => {
      const original = BankAccount.create(
        {
          portfolioId: EntityId.create(PORTFOLIO_ID),
          bankId: EntityId.create(BANK_ID),
          agency: "0001",
          accountNumber: "12345-6",
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
      expect(restored.agency).toBe("0001")
      expect(restored.accountNumber).toBe("12345-6")
    })

    it("should preserve the entity through ToUpdate then ToDomain", () => {
      const original = BankAccount.create(
        {
          portfolioId: EntityId.create(PORTFOLIO_ID),
          bankId: EntityId.create(BANK_ID),
          agency: "0001",
          accountNumber: "12345-6",
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
