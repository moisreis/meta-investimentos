import { describe, it, expect } from "vitest"

import { CheckingAccount } from "@/domain/checking-account/entities/checking-account.entity"
import { EntityId } from "@/value-objects"
import { SignedMoney } from "@/value-objects/signed-money.vo"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "@/infrastructure/checking-account/mappers/checking-account.mapper"
import { buildCheckingAccount } from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000012"
const BANK_ACCOUNT_ID = "00000000-0000-0000-0000-000000000013"

describe("infrastructure/checking-account/mappers/checking-account.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to CheckingAccount entity", () => {
      const row = {
        id: ID,
        bankAccountId: BANK_ACCOUNT_ID,
        date: new Date("2026-01-15T00:00:00.000Z"),
        value: "1000.000000",
      }

      const transaction = ToDomain(row)

      expect(transaction.id).toBe(EntityId.create(ID))
      expect(transaction.bankAccountId).toBe(
        EntityId.create(BANK_ACCOUNT_ID)
      )
      expect(transaction.date).toEqual(row.date)
      expect(transaction.value.value.toFixed(2)).toBe("1000.00")
    })

    it("should map a negative value", () => {
      const row = {
        id: ID,
        bankAccountId: BANK_ACCOUNT_ID,
        date: new Date("2026-01-15T00:00:00.000Z"),
        value: "-250.000000",
      }

      const transaction = ToDomain(row)

      expect(transaction.value.value.toFixed(2)).toBe("-250.00")
    })
  })

  describe("ToInsert", () => {
    it("should map CheckingAccount entity to insert object without id", () => {
      const transaction = buildCheckingAccount({
        bankAccountId: EntityId.create(BANK_ACCOUNT_ID),
      })

      const insert = ToInsert(transaction)

      expect(insert).not.toHaveProperty("id")
      expect(insert.bankAccountId).toBe(BANK_ACCOUNT_ID)
      expect(insert.date).toEqual(transaction.date)
      expect(insert.value).toBe(
        transaction.value.value.toString()
      )
    })
  })

  describe("ToUpdate", () => {
    it("should map CheckingAccount entity to the same columns as insert", () => {
      const transaction = buildCheckingAccount()

      const update = ToUpdate(transaction)

      expect(update).not.toHaveProperty("id")
      expect(update.value).toBe(
        transaction.value.value.toString()
      )
      expect(update.date).toEqual(transaction.date)
    })
  })

  describe("round-trip", () => {
    it("should preserve the entity through ToInsert then ToDomain", () => {
      const original = CheckingAccount.create(
        {
          bankAccountId: EntityId.create(BANK_ACCOUNT_ID),
          date: new Date("2026-01-15T00:00:00.000Z"),
          value: SignedMoney.create("1000.00"),
        },
        ID
      )

      const row = {
        ...ToInsert(original),
        id: original.id!,
      } as Parameters<typeof ToDomain>[0]
      const restored = ToDomain(row)

      expect(restored.equals(original)).toBe(true)
      expect(restored.value.value.toFixed(2)).toBe("1000.00")
    })

    it("should preserve the entity through ToUpdate then ToDomain", () => {
      const original = CheckingAccount.create(
        {
          bankAccountId: EntityId.create(BANK_ACCOUNT_ID),
          date: new Date("2026-01-15T00:00:00.000Z"),
          value: SignedMoney.create("-250.00"),
        },
        ID
      )

      const row = {
        ...ToUpdate(original),
        id: original.id!,
      } as Parameters<typeof ToDomain>[0]

      expect(ToDomain(row).equals(original)).toBe(true)
    })
  })
})
