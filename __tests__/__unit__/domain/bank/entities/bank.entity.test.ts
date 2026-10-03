import { describe, it, expect } from "vitest"
import { Bank } from "@/domain/bank/entities/bank.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { buildBank } from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  advanceTime,
} from "__tests__/__setup__/_clock.setup"

describe("Bank", () => {
  describe("create", () => {
    it("should create a valid Bank with required props", () => {
      const bank = Bank.create({
        code: "001",
        name: "Banco do Brasil",
      })

      expect(bank.code).toBe("001")
      expect(bank.name).toBe("Banco do Brasil")
      expect(bank.id).toBeUndefined()
      expect(bank.createdAt).toBeInstanceOf(Date)
      expect(bank.updatedAt).toBeInstanceOf(Date)
    })

    it("should create a Bank with provided id", () => {
      const id = EntityId.create("bank-123")
      const bank = Bank.create(
        { code: "001", name: "Banco do Brasil" },
        id
      )

      expect(bank.id).toBe(id)
    })

    it("should create a Bank with custom timestamps", () => {
      const createdAt = new Date("2026-01-01T00:00:00.000Z")
      const updatedAt = new Date("2026-01-15T12:00:00.000Z")
      const bank = Bank.create({
        code: "001",
        name: "Banco do Brasil",
        createdAt,
        updatedAt,
      })

      expect(bank.createdAt).toEqual(createdAt)
      expect(bank.updatedAt).toEqual(updatedAt)
    })

    it("should throw ValidationError when code is empty", () => {
      expect(() =>
        Bank.create({ code: "", name: "Banco do Brasil" })
      ).toThrow(ValidationError)
      expect(() =>
        Bank.create({ code: "   ", name: "Banco do Brasil" })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when name is empty", () => {
      expect(() =>
        Bank.create({ code: "001", name: "" })
      ).toThrow(ValidationError)
      expect(() =>
        Bank.create({ code: "001", name: "   " })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when code is missing", () => {
      expect(() =>
        Bank.create({
          name: "Banco do Brasil",
        } as Parameters<typeof Bank.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when name is missing", () => {
      expect(() =>
        Bank.create({ code: "001" } as Parameters<
          typeof Bank.create
        >[0])
      ).toThrow(ValidationError)
    })
  })

  describe("rename", () => {
    it("should return new Bank with updated name", () => {
      useFixedClock()
      const bank = buildBank({
        code: "001",
        name: "Banco do Brasil",
      })
      advanceTime(1000)
      const renamed = bank.rename("Banco do Brasil S.A.")

      expect(renamed.code).toBe("001")
      expect(renamed.name).toBe("Banco do Brasil S.A.")
      expect(renamed.id).toBe(bank.id)
      expect(renamed.updatedAt).not.toEqual(bank.updatedAt)
      // Original unchanged
      expect(bank.name).toBe("Banco do Brasil")
    })

    it("should throw ValidationError when new name is empty", () => {
      const bank = buildBank()
      expect(() => bank.rename("")).toThrow(ValidationError)
      expect(() => bank.rename("   ")).toThrow(ValidationError)
    })

    it("should accept optional now parameter for updatedAt", () => {
      const bank = buildBank()
      const now = new Date("2026-06-15T10:00:00.000Z")
      const renamed = bank.rename("Novo Nome", now)

      expect(renamed.updatedAt).toEqual(now)
    })
  })

  describe("changeCode", () => {
    it("should return new Bank with updated code", () => {
      useFixedClock()
      const bank = buildBank({
        code: "001",
        name: "Banco do Brasil",
      })
      advanceTime(1000)
      const recoded = bank.changeCode("002")

      expect(recoded.code).toBe("002")
      expect(recoded.name).toBe("Banco do Brasil")
      expect(recoded.id).toBe(bank.id)
      expect(recoded.updatedAt).not.toEqual(bank.updatedAt)
      // Original unchanged
      expect(bank.code).toBe("001")
    })

    it("should throw ValidationError when new code is empty", () => {
      const bank = buildBank()
      expect(() => bank.changeCode("")).toThrow(ValidationError)
      expect(() => bank.changeCode("   ")).toThrow(
        ValidationError
      )
    })

    it("should accept optional now parameter for updatedAt", () => {
      const bank = buildBank()
      const now = new Date("2026-06-15T10:00:00.000Z")
      const recoded = bank.changeCode("002", now)

      expect(recoded.updatedAt).toEqual(now)
    })
  })

  describe("equals", () => {
    it("should return true for same instance", () => {
      const bank = buildBank()
      expect(bank.equals(bank)).toBe(true)
    })

    it("should return true for different instances with same id", () => {
      const id = EntityId.create("bank-123")
      const bank1 = Bank.create(
        { code: "001", name: "Banco do Brasil" },
        id
      )
      const bank2 = Bank.create(
        { code: "001", name: "Banco do Brasil" },
        id
      )

      expect(bank1.equals(bank2)).toBe(true)
    })

    it("should return false for different ids", () => {
      const bank1 = Bank.create(
        { code: "001", name: "Banco do Brasil" },
        EntityId.create("bank-1")
      )
      const bank2 = Bank.create(
        { code: "001", name: "Banco do Brasil" },
        EntityId.create("bank-2")
      )

      expect(bank1.equals(bank2)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const bank1 = Bank.create({
        code: "001",
        name: "Banco do Brasil",
      })
      const bank2 = Bank.create(
        { code: "001", name: "Banco do Brasil" },
        EntityId.create("bank-1")
      )

      expect(bank1.equals(bank2)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const bank1 = Bank.create(
        { code: "001", name: "Banco do Brasil" },
        EntityId.create("bank-1")
      )
      const bank2 = Bank.create({
        code: "001",
        name: "Banco do Brasil",
      })

      expect(bank1.equals(bank2)).toBe(false)
    })

    it("should return false when comparing to null", () => {
      const bank = buildBank()
      expect(bank.equals(null)).toBe(false)
    })

    it("should return false when comparing to undefined", () => {
      const bank = buildBank()
      expect(bank.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const bank = buildBank()

      expect(() => {
        // @ts-expect-error - testing immutability by attempting to mutate readonly property
        bank.code = "999"
      }).toThrow()
    })

    it("should return new instances on mutations", () => {
      const bank = buildBank()
      const renamed = bank.rename("Novo Nome")
      const recoded = bank.changeCode("999")

      expect(renamed).not.toBe(bank)
      expect(recoded).not.toBe(bank)
      expect(renamed).not.toBe(recoded)
    })
  })
})
