import { describe, it, expect } from "vitest"
import { Portfolio } from "@/domain/portfolio/entities/portfolio.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"
import { buildPortfolio } from "__tests__/__setup__/_factories.setup"

describe("Portfolio", () => {
  describe("create", () => {
    it("should create a valid Portfolio with required props", () => {
      const portfolio = Portfolio.create({
        acronym: "FIA",
        name: "Fundo de Investimento em Ações",
        userId: EntityId.create("user-1"),
        annualInterestRate: SignedPercentage.create("10.5"),
        minAllocation: SignedPercentage.create("5"),
        maxAllocation: SignedPercentage.create("20"),
        targetAllocation: SignedPercentage.create("12"),
      })

      expect(portfolio.acronym).toBe("FIA")
      expect(portfolio.name).toBe(
        "Fundo de Investimento em Ações"
      )
      expect(portfolio.userId).toBe(EntityId.create("user-1"))
      expect(portfolio.annualInterestRate.value.toFixed(2)).toBe(
        "10.50"
      )
      expect(portfolio.minAllocation.value.toFixed(2)).toBe(
        "5.00"
      )
      expect(portfolio.maxAllocation.value.toFixed(2)).toBe(
        "20.00"
      )
      expect(portfolio.targetAllocation.value.toFixed(2)).toBe(
        "12.00"
      )
      expect(portfolio.version).toBe(0)
      expect(portfolio.id).toBeUndefined()
      expect(portfolio.createdAt).toBeInstanceOf(Date)
      expect(portfolio.updatedAt).toBeInstanceOf(Date)
    })

    it("should create a Portfolio with provided id", () => {
      const id = EntityId.create("portfolio-123")
      const portfolio = Portfolio.create(
        {
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          userId: EntityId.create("user-1"),
          annualInterestRate: SignedPercentage.create("10.5"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        id
      )

      expect(portfolio.id).toBe(id)
    })

    it("should create a Portfolio with custom timestamps", () => {
      const createdAt = new Date("2026-01-01T00:00:00.000Z")
      const updatedAt = new Date("2026-01-15T12:00:00.000Z")
      const portfolio = Portfolio.create({
        acronym: "FIA",
        name: "Fundo de Investimento em Ações",
        userId: EntityId.create("user-1"),
        annualInterestRate: SignedPercentage.create("10.5"),
        minAllocation: SignedPercentage.create("5"),
        maxAllocation: SignedPercentage.create("20"),
        targetAllocation: SignedPercentage.create("12"),
        createdAt,
        updatedAt,
      })

      expect(portfolio.createdAt).toEqual(createdAt)
      expect(portfolio.updatedAt).toEqual(updatedAt)
    })

    it("should throw ValidationError when acronym is empty", () => {
      expect(() =>
        Portfolio.create({
          acronym: "",
          name: "Teste",
          userId: EntityId.create("user-1"),
          annualInterestRate: SignedPercentage.create("10.5"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when name is empty", () => {
      expect(() =>
        Portfolio.create({
          acronym: "FIA",
          name: "",
          userId: EntityId.create("user-1"),
          annualInterestRate: SignedPercentage.create("10.5"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when userId is empty", () => {
      expect(() =>
        Portfolio.create({
          acronym: "FIA",
          name: "Teste",
          userId: EntityId.create(""),
          annualInterestRate: SignedPercentage.create("10.5"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when annualInterestRate is missing", () => {
      expect(() =>
        Portfolio.create({
          acronym: "FIA",
          name: "Teste",
          userId: EntityId.create("user-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        } as Parameters<typeof Portfolio.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when minAllocation is missing", () => {
      expect(() =>
        Portfolio.create({
          acronym: "FIA",
          name: "Teste",
          userId: EntityId.create("user-1"),
          annualInterestRate: SignedPercentage.create("10.5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        } as Parameters<typeof Portfolio.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when maxAllocation is missing", () => {
      expect(() =>
        Portfolio.create({
          acronym: "FIA",
          name: "Teste",
          userId: EntityId.create("user-1"),
          annualInterestRate: SignedPercentage.create("10.5"),
          minAllocation: SignedPercentage.create("5"),
          targetAllocation: SignedPercentage.create("12"),
        } as Parameters<typeof Portfolio.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when targetAllocation is missing", () => {
      expect(() =>
        Portfolio.create({
          acronym: "FIA",
          name: "Teste",
          userId: EntityId.create("user-1"),
          annualInterestRate: SignedPercentage.create("10.5"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
        } as Parameters<typeof Portfolio.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when annualInterestRate is negative", () => {
      expect(() =>
        Portfolio.create({
          acronym: "FIA",
          name: "Teste",
          userId: EntityId.create("user-1"),
          annualInterestRate: SignedPercentage.create("-5"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when min > target", () => {
      expect(() =>
        Portfolio.create({
          acronym: "FIA",
          name: "Teste",
          userId: EntityId.create("user-1"),
          annualInterestRate: SignedPercentage.create("10.5"),
          minAllocation: SignedPercentage.create("15"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("10"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when target > max", () => {
      expect(() =>
        Portfolio.create({
          acronym: "FIA",
          name: "Teste",
          userId: EntityId.create("user-1"),
          annualInterestRate: SignedPercentage.create("10.5"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("10"),
          targetAllocation: SignedPercentage.create("15"),
        })
      ).toThrow(ValidationError)
    })
  })

  describe("updateAllocation", () => {
    it("should return new Portfolio with updated allocation", () => {
      const portfolio = buildPortfolio()
      const now = new Date("2026-06-15T10:00:00.000Z")

      const updated = portfolio.updateAllocation(
        SignedPercentage.create("3"),
        SignedPercentage.create("10"),
        SignedPercentage.create("25"),
        now
      )

      expect(updated.minAllocation.value.toFixed(2)).toBe("3.00")
      expect(updated.targetAllocation.value.toFixed(2)).toBe(
        "10.00"
      )
      expect(updated.maxAllocation.value.toFixed(2)).toBe(
        "25.00"
      )
      expect(updated.id).toBe(portfolio.id)
      expect(updated.updatedAt).toEqual(now)
      // Original unchanged
      expect(portfolio.minAllocation.value.toFixed(2)).toBe(
        "5.00"
      )
    })

    it("should throw ValidationError when min > target", () => {
      const portfolio = buildPortfolio()
      expect(() =>
        portfolio.updateAllocation(
          SignedPercentage.create("15"),
          SignedPercentage.create("10"),
          SignedPercentage.create("20")
        )
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when target > max", () => {
      const portfolio = buildPortfolio()
      expect(() =>
        portfolio.updateAllocation(
          SignedPercentage.create("5"),
          SignedPercentage.create("15"),
          SignedPercentage.create("10")
        )
      ).toThrow(ValidationError)
    })
  })

  describe("updateAnnualInterestRate", () => {
    it("should return new Portfolio with updated rate", () => {
      const portfolio = buildPortfolio()
      const now = new Date("2026-06-15T10:00:00.000Z")

      const updated = portfolio.updateAnnualInterestRate(
        SignedPercentage.create("12.0"),
        now
      )

      expect(updated.annualInterestRate.value.toFixed(2)).toBe(
        "12.00"
      )
      expect(updated.id).toBe(portfolio.id)
      expect(updated.updatedAt).toEqual(now)
    })

    it("should throw ValidationError when rate is negative", () => {
      const portfolio = buildPortfolio()
      expect(() =>
        portfolio.updateAnnualInterestRate(
          SignedPercentage.create("-5")
        )
      ).toThrow(ValidationError)
    })
  })

  describe("updateAcronym", () => {
    it("should return new Portfolio with updated acronym", () => {
      const portfolio = buildPortfolio({ acronym: "FIA" })
      const updated = portfolio.updateAcronym("IPCA+")

      expect(updated.acronym).toBe("IPCA+")
      expect(updated.id).toBe(portfolio.id)
    })

    it("should throw ValidationError when new acronym is empty", () => {
      const portfolio = buildPortfolio()
      expect(() => portfolio.updateAcronym("")).toThrow(
        ValidationError
      )
    })
  })

  describe("updateName", () => {
    it("should return new Portfolio with updated name", () => {
      const portfolio = buildPortfolio({
        name: "Portfólio Original",
      })
      const updated = portfolio.updateName("Novo Nome")

      expect(updated.name).toBe("Novo Nome")
      expect(updated.id).toBe(portfolio.id)
    })

    it("should throw ValidationError when new name is empty", () => {
      const portfolio = buildPortfolio()
      expect(() => portfolio.updateName("")).toThrow(
        ValidationError
      )
    })
  })

  describe("equals", () => {
    it("should return true for same instance", () => {
      const portfolio = buildPortfolio()
      expect(portfolio.equals(portfolio)).toBe(true)
    })

    it("should return true for different instances with same id", () => {
      const id = EntityId.create("portfolio-123")
      const p1 = Portfolio.create(
        {
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          userId: EntityId.create("user-1"),
          annualInterestRate: SignedPercentage.create("10.5"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        id
      )
      const p2 = Portfolio.create(
        {
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          userId: EntityId.create("user-1"),
          annualInterestRate: SignedPercentage.create("10.5"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        id
      )

      expect(p1.equals(p2)).toBe(true)
    })

    it("should return false for different ids", () => {
      const p1 = Portfolio.create(
        {
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          userId: EntityId.create("user-1"),
          annualInterestRate: SignedPercentage.create("10.5"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        EntityId.create("portfolio-1")
      )
      const p2 = Portfolio.create(
        {
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          userId: EntityId.create("user-1"),
          annualInterestRate: SignedPercentage.create("10.5"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        EntityId.create("portfolio-2")
      )

      expect(p1.equals(p2)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const p1 = Portfolio.create({
        acronym: "FIA",
        name: "Fundo de Investimento em Ações",
        userId: EntityId.create("user-1"),
        annualInterestRate: SignedPercentage.create("10.5"),
        minAllocation: SignedPercentage.create("5"),
        maxAllocation: SignedPercentage.create("20"),
        targetAllocation: SignedPercentage.create("12"),
      })
      const p2 = Portfolio.create(
        {
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          userId: EntityId.create("user-1"),
          annualInterestRate: SignedPercentage.create("10.5"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        EntityId.create("portfolio-1")
      )

      expect(p1.equals(p2)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const p1 = Portfolio.create(
        {
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          userId: EntityId.create("user-1"),
          annualInterestRate: SignedPercentage.create("10.5"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        EntityId.create("portfolio-1")
      )
      const p2 = Portfolio.create({
        acronym: "FIA",
        name: "Fundo de Investimento em Ações",
        userId: EntityId.create("user-1"),
        annualInterestRate: SignedPercentage.create("10.5"),
        minAllocation: SignedPercentage.create("5"),
        maxAllocation: SignedPercentage.create("20"),
        targetAllocation: SignedPercentage.create("12"),
      })

      expect(p1.equals(p2)).toBe(false)
    })

    it("should return false when comparing to null", () => {
      const portfolio = buildPortfolio()
      expect(portfolio.equals(null)).toBe(false)
    })

    it("should return false when comparing to undefined", () => {
      const portfolio = buildPortfolio()
      expect(portfolio.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const portfolio = buildPortfolio()

      expect(() => {
        // @ts-expect-error - testing immutability by attempting to mutate readonly property
        portfolio.acronym = "NEW"
      }).toThrow()
    })

    it("should return new instances on mutations", () => {
      const portfolio = buildPortfolio()
      const updated1 = portfolio.updateAllocation(
        SignedPercentage.create("3"),
        SignedPercentage.create("10"),
        SignedPercentage.create("25")
      )
      const updated2 = portfolio.updateAnnualInterestRate(
        SignedPercentage.create("12.0")
      )

      expect(updated1).not.toBe(portfolio)
      expect(updated2).not.toBe(portfolio)
      expect(updated1).not.toBe(updated2)
    })
  })
})
