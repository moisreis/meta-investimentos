import { describe, it, expect } from "vitest"
import { BankAccount } from "@/domain/bank-account/entities/bank-account.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { buildBankAccount } from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  advanceTime,
} from "__tests__/__setup__/_clock.setup"

describe("BankAccount", () => {
  describe("create", () => {
    it("should create a valid BankAccount with required props", () => {
      const bankAccount = BankAccount.create({
        portfolioId: EntityId.create("portfolio-1"),
        bankId: EntityId.create("bank-1"),
        agency: "0001",
        accountNumber: "12345-6",
      })

      expect(bankAccount.portfolioId).toBe(
        EntityId.create("portfolio-1")
      )
      expect(bankAccount.bankId).toBe(EntityId.create("bank-1"))
      expect(bankAccount.agency).toBe("0001")
      expect(bankAccount.accountNumber).toBe("12345-6")
      expect(bankAccount.id).toBeUndefined()
      expect(bankAccount.createdAt).toBeInstanceOf(Date)
      expect(bankAccount.updatedAt).toBeInstanceOf(Date)
    })

    it("should create a BankAccount with provided id", () => {
      const id = EntityId.create("bank-account-123")
      const bankAccount = BankAccount.create(
        {
          portfolioId: EntityId.create("portfolio-1"),
          bankId: EntityId.create("bank-1"),
          agency: "0001",
          accountNumber: "12345-6",
        },
        id
      )

      expect(bankAccount.id).toBe(id)
    })

    it("should create a BankAccount with custom timestamps", () => {
      const createdAt = new Date("2026-01-01T00:00:00.000Z")
      const updatedAt = new Date("2026-01-15T12:00:00.000Z")
      const bankAccount = BankAccount.create({
        portfolioId: EntityId.create("portfolio-1"),
        bankId: EntityId.create("bank-1"),
        agency: "0001",
        accountNumber: "12345-6",
        createdAt,
        updatedAt,
      })

      expect(bankAccount.createdAt).toEqual(createdAt)
      expect(bankAccount.updatedAt).toEqual(updatedAt)
    })

    it("should throw ValidationError when portfolioId is empty", () => {
      expect(() =>
        BankAccount.create({
          portfolioId: EntityId.create(""),
          bankId: EntityId.create("bank-1"),
          agency: "0001",
          accountNumber: "12345-6",
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when bankId is empty", () => {
      expect(() =>
        BankAccount.create({
          portfolioId: EntityId.create("portfolio-1"),
          bankId: EntityId.create(""),
          agency: "0001",
          accountNumber: "12345-6",
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when agency is empty", () => {
      expect(() =>
        BankAccount.create({
          portfolioId: EntityId.create("portfolio-1"),
          bankId: EntityId.create("bank-1"),
          agency: "",
          accountNumber: "12345-6",
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when accountNumber is empty", () => {
      expect(() =>
        BankAccount.create({
          portfolioId: EntityId.create("portfolio-1"),
          bankId: EntityId.create("bank-1"),
          agency: "0001",
          accountNumber: "",
        })
      ).toThrow(ValidationError)
    })
  })

  describe("update", () => {
    it("should return new BankAccount with updated agency", () => {
      useFixedClock()
      const bankAccount = buildBankAccount({
        agency: "0001",
        accountNumber: "12345-6",
      })
      advanceTime(1000)
      const updated = bankAccount.update({ agency: "0002" })

      expect(updated.agency).toBe("0002")
      expect(updated.accountNumber).toBe("12345-6")
      expect(updated.id).toBe(bankAccount.id)
      expect(updated.updatedAt).not.toEqual(
        bankAccount.updatedAt
      )
      // Original unchanged
      expect(bankAccount.agency).toBe("0001")
    })

    it("should return new BankAccount with updated accountNumber", () => {
      useFixedClock()
      const bankAccount = buildBankAccount({
        agency: "0001",
        accountNumber: "12345-6",
      })
      advanceTime(1000)
      const updated = bankAccount.update({
        accountNumber: "65432-1",
      })

      expect(updated.agency).toBe("0001")
      expect(updated.accountNumber).toBe("65432-1")
      expect(updated.id).toBe(bankAccount.id)
      expect(updated.updatedAt).not.toEqual(
        bankAccount.updatedAt
      )
      // Original unchanged
      expect(bankAccount.accountNumber).toBe("12345-6")
    })

    it("should return new BankAccount with updated both fields", () => {
      useFixedClock()
      const bankAccount = buildBankAccount({
        agency: "0001",
        accountNumber: "12345-6",
      })
      advanceTime(1000)
      const updated = bankAccount.update({
        agency: "0002",
        accountNumber: "65432-1",
      })

      expect(updated.agency).toBe("0002")
      expect(updated.accountNumber).toBe("65432-1")
      expect(updated.id).toBe(bankAccount.id)
      expect(updated.updatedAt).not.toEqual(
        bankAccount.updatedAt
      )
    })

    it("should throw ValidationError when new agency is empty", () => {
      const bankAccount = buildBankAccount()
      expect(() => bankAccount.update({ agency: "" })).toThrow(
        ValidationError
      )
      expect(() =>
        bankAccount.update({ agency: "   " })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when new accountNumber is empty", () => {
      const bankAccount = buildBankAccount()
      expect(() =>
        bankAccount.update({ accountNumber: "" })
      ).toThrow(ValidationError)
      expect(() =>
        bankAccount.update({ accountNumber: "   " })
      ).toThrow(ValidationError)
    })

    it("should accept optional now parameter for updatedAt", () => {
      const bankAccount = buildBankAccount()
      const now = new Date("2026-06-15T10:00:00.000Z")
      const updated = bankAccount.update({ agency: "0002" }, now)

      expect(updated.updatedAt).toEqual(now)
    })
  })

  describe("equals", () => {
    it("should return true for same instance", () => {
      const bankAccount = buildBankAccount()
      expect(bankAccount.equals(bankAccount)).toBe(true)
    })

    it("should return true for different instances with same id", () => {
      const id = EntityId.create("bank-account-123")
      const ba1 = BankAccount.create(
        {
          portfolioId: EntityId.create("portfolio-1"),
          bankId: EntityId.create("bank-1"),
          agency: "0001",
          accountNumber: "12345-6",
        },
        id
      )
      const ba2 = BankAccount.create(
        {
          portfolioId: EntityId.create("portfolio-1"),
          bankId: EntityId.create("bank-1"),
          agency: "0001",
          accountNumber: "12345-6",
        },
        id
      )

      expect(ba1.equals(ba2)).toBe(true)
    })

    it("should return false for different ids", () => {
      const ba1 = BankAccount.create(
        {
          portfolioId: EntityId.create("portfolio-1"),
          bankId: EntityId.create("bank-1"),
          agency: "0001",
          accountNumber: "12345-6",
        },
        EntityId.create("ba-1")
      )
      const ba2 = BankAccount.create(
        {
          portfolioId: EntityId.create("portfolio-1"),
          bankId: EntityId.create("bank-1"),
          agency: "0001",
          accountNumber: "12345-6",
        },
        EntityId.create("ba-2")
      )

      expect(ba1.equals(ba2)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const ba1 = BankAccount.create({
        portfolioId: EntityId.create("portfolio-1"),
        bankId: EntityId.create("bank-1"),
        agency: "0001",
        accountNumber: "12345-6",
      })
      const ba2 = BankAccount.create(
        {
          portfolioId: EntityId.create("portfolio-1"),
          bankId: EntityId.create("bank-1"),
          agency: "0001",
          accountNumber: "12345-6",
        },
        EntityId.create("ba-1")
      )

      expect(ba1.equals(ba2)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const ba1 = BankAccount.create(
        {
          portfolioId: EntityId.create("portfolio-1"),
          bankId: EntityId.create("bank-1"),
          agency: "0001",
          accountNumber: "12345-6",
        },
        EntityId.create("ba-1")
      )
      const ba2 = BankAccount.create({
        portfolioId: EntityId.create("portfolio-1"),
        bankId: EntityId.create("bank-1"),
        agency: "0001",
        accountNumber: "12345-6",
      })

      expect(ba1.equals(ba2)).toBe(false)
    })

    it("should return false when comparing to null", () => {
      const bankAccount = buildBankAccount()
      expect(bankAccount.equals(null)).toBe(false)
    })

    it("should return false when comparing to undefined", () => {
      const bankAccount = buildBankAccount()
      expect(bankAccount.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const bankAccount = buildBankAccount()

      expect(() => {
        // @ts-expect-error - testing immutability by attempting to mutate readonly property
        bankAccount.agency = "9999"
      }).toThrow()
    })

    it("should return new instances on mutations", () => {
      const bankAccount = buildBankAccount()
      const updated = bankAccount.update({ agency: "9999" })

      expect(updated).not.toBe(bankAccount)
    })
  })
})
