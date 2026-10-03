import { describe, it, expect } from "vitest"
import { CheckingAccount } from "@/domain/checking-account/entities/checking-account.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { SignedMoney } from "@/value-objects/signed-money.vo"
import { buildCheckingAccount } from "__tests__/__setup__/_factories.setup"

describe("CheckingAccount", () => {
  describe("create", () => {
    it("should create a valid CheckingAccount with required props", () => {
      const tx = CheckingAccount.create({
        bankAccountId: EntityId.create("bank-account-1"),
        date: new Date("2026-01-15"),
        value: SignedMoney.create("1000.00"),
      })

      expect(tx.bankAccountId).toBe(
        EntityId.create("bank-account-1")
      )
      expect(tx.date).toEqual(new Date("2026-01-15"))
      expect(tx.value.value.toFixed(2)).toBe("1000.00")
      expect(tx.id).toBeUndefined()
    })

    it("should create a CheckingAccount with provided id", () => {
      const id = EntityId.create("tx-123")
      const tx = CheckingAccount.create(
        {
          bankAccountId: EntityId.create("bank-account-1"),
          date: new Date("2026-01-15"),
          value: SignedMoney.create("1000.00"),
        },
        id
      )

      expect(tx.id).toBe(id)
    })

    it("should throw ValidationError when bankAccountId is empty", () => {
      expect(() =>
        CheckingAccount.create({
          bankAccountId: EntityId.create(""),
          date: new Date("2026-01-15"),
          value: SignedMoney.create("1000.00"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when date is missing", () => {
      expect(() =>
        CheckingAccount.create({
          bankAccountId: EntityId.create("bank-account-1"),
          value: SignedMoney.create("1000.00"),
        } as Parameters<typeof CheckingAccount.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when value is missing", () => {
      expect(() =>
        CheckingAccount.create({
          bankAccountId: EntityId.create("bank-account-1"),
          date: new Date("2026-01-15"),
        } as Parameters<typeof CheckingAccount.create>[0])
      ).toThrow(ValidationError)
    })
  })

  describe("updateValue", () => {
    it("should return new CheckingAccount with updated value", () => {
      const tx = buildCheckingAccount({
        value: SignedMoney.create("1000.00"),
      })
      const updated = tx.updateValue(
        SignedMoney.create("2000.00")
      )

      expect(updated.value.value.toFixed(2)).toBe("2000.00")
      expect(updated.id).toBe(tx.id)
      // Original unchanged
      expect(tx.value.value.toFixed(2)).toBe("1000.00")
    })

    it("should throw ValidationError when new value is missing", () => {
      const tx = buildCheckingAccount()
      expect(() =>
        tx.updateValue(
          null as unknown as Parameters<typeof tx.updateValue>[0]
        )
      ).toThrow(ValidationError)
    })
  })

  describe("equals", () => {
    it("should return true for same instance", () => {
      const tx = buildCheckingAccount()
      expect(tx.equals(tx)).toBe(true)
    })

    it("should return true for different instances with same id", () => {
      const id = EntityId.create("tx-123")
      const tx1 = CheckingAccount.create(
        {
          bankAccountId: EntityId.create("bank-account-1"),
          date: new Date("2026-01-15"),
          value: SignedMoney.create("1000.00"),
        },
        id
      )
      const tx2 = CheckingAccount.create(
        {
          bankAccountId: EntityId.create("bank-account-1"),
          date: new Date("2026-01-15"),
          value: SignedMoney.create("1000.00"),
        },
        id
      )

      expect(tx1.equals(tx2)).toBe(true)
    })

    it("should return false for different ids", () => {
      const tx1 = CheckingAccount.create(
        {
          bankAccountId: EntityId.create("bank-account-1"),
          date: new Date("2026-01-15"),
          value: SignedMoney.create("1000.00"),
        },
        EntityId.create("tx-1")
      )
      const tx2 = CheckingAccount.create(
        {
          bankAccountId: EntityId.create("bank-account-1"),
          date: new Date("2026-01-15"),
          value: SignedMoney.create("1000.00"),
        },
        EntityId.create("tx-2")
      )

      expect(tx1.equals(tx2)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const tx1 = CheckingAccount.create({
        bankAccountId: EntityId.create("bank-account-1"),
        date: new Date("2026-01-15"),
        value: SignedMoney.create("1000.00"),
      })
      const tx2 = CheckingAccount.create(
        {
          bankAccountId: EntityId.create("bank-account-1"),
          date: new Date("2026-01-15"),
          value: SignedMoney.create("1000.00"),
        },
        EntityId.create("tx-1")
      )

      expect(tx1.equals(tx2)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const tx1 = CheckingAccount.create(
        {
          bankAccountId: EntityId.create("bank-account-1"),
          date: new Date("2026-01-15"),
          value: SignedMoney.create("1000.00"),
        },
        EntityId.create("tx-1")
      )
      const tx2 = CheckingAccount.create({
        bankAccountId: EntityId.create("bank-account-1"),
        date: new Date("2026-01-15"),
        value: SignedMoney.create("1000.00"),
      })

      expect(tx1.equals(tx2)).toBe(false)
    })

    it("should return false when comparing to null", () => {
      const tx = buildCheckingAccount()
      expect(tx.equals(null)).toBe(false)
    })

    it("should return false when comparing to undefined", () => {
      const tx = buildCheckingAccount()
      expect(tx.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const tx = buildCheckingAccount()

      expect(() => {
        // @ts-expect-error - testing immutability by attempting to mutate readonly property
        tx.value = SignedMoney.create("9999.99")
      }).toThrow()
    })

    it("should return new instances on mutations", () => {
      const tx = buildCheckingAccount()
      const updated = tx.updateValue(
        SignedMoney.create("9999.99")
      )

      expect(updated).not.toBe(tx)
    })
  })
})
