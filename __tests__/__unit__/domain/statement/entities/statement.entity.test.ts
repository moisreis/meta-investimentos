import { describe, it, expect } from "vitest"

import { Statement } from "@/domain/statement/entities/statement.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { buildStatement } from "__tests__/__setup__/_factories.setup"

const PERSISTED_ID = EntityId.create("statement-123")

describe("Statement", () => {
  describe("create", () => {
    it("should create a valid Statement with required props", () => {
      const periodStart = new Date("2026-01-01")
      const periodEnd = new Date("2026-01-31")

      const statement = Statement.create({
        periodStart,
        periodEnd,
        fileUrl: "https://cdn.test/statement.pdf",
      })

      expect(statement.portfolioId).toBeNull()
      expect(statement.periodStart).toEqual(periodStart)
      expect(statement.periodEnd).toEqual(periodEnd)
      expect(statement.fileUrl).toBe(
        "https://cdn.test/statement.pdf"
      )
      expect(statement.generatedByUserId).toBeNull()
      expect(statement.id).toBeUndefined()
    })

    it("should create a Statement with provided id", () => {
      const statement = Statement.create(
        {
          periodStart: new Date("2026-01-01"),
          periodEnd: new Date("2026-01-31"),
          fileUrl: "https://cdn.test/statement.pdf",
        },
        PERSISTED_ID
      )

      expect(statement.id).toBe(PERSISTED_ID)
    })

    it("should create a Statement with optional relations", () => {
      const statement = Statement.create({
        portfolioId: EntityId.create("portfolio-1"),
        periodStart: new Date("2026-01-01"),
        periodEnd: new Date("2026-01-31"),
        fileUrl: "https://cdn.test/statement.pdf",
        generatedByUserId: EntityId.create("user-1"),
      })

      expect(statement.portfolioId).toBe(
        EntityId.create("portfolio-1")
      )
      expect(statement.generatedByUserId).toBe(
        EntityId.create("user-1")
      )
    })

    it("should create a Statement with custom createdAt", () => {
      const createdAt = new Date("2026-01-01T00:00:00.000Z")

      const statement = Statement.create({
        periodStart: new Date("2026-01-01"),
        periodEnd: new Date("2026-01-31"),
        fileUrl: "https://cdn.test/statement.pdf",
        createdAt,
      })

      expect(statement.createdAt).toEqual(createdAt)
    })

    it("should throw ValidationError when periodStart is missing", () => {
      expect(() =>
        Statement.create({
          periodEnd: new Date("2026-01-31"),
          fileUrl: "https://cdn.test/statement.pdf",
        } as Parameters<typeof Statement.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when periodEnd is missing", () => {
      expect(() =>
        Statement.create({
          periodStart: new Date("2026-01-01"),
          fileUrl: "https://cdn.test/statement.pdf",
        } as Parameters<typeof Statement.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when fileUrl is blank", () => {
      expect(() =>
        Statement.create({
          periodStart: new Date("2026-01-01"),
          periodEnd: new Date("2026-01-31"),
          fileUrl: "   ",
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when periodStart is after periodEnd", () => {
      expect(() =>
        Statement.create({
          periodStart: new Date("2026-02-01"),
          periodEnd: new Date("2026-01-31"),
          fileUrl: "https://cdn.test/statement.pdf",
        })
      ).toThrow(ValidationError)
    })

    it("should accept periodStart equal to periodEnd", () => {
      const date = new Date("2026-01-01")

      const statement = Statement.create({
        periodStart: date,
        periodEnd: date,
        fileUrl: "https://cdn.test/statement.pdf",
      })

      expect(statement.periodStart).toEqual(date)
      expect(statement.periodEnd).toEqual(date)
    })
  })

  describe("equals", () => {
    it("should return true when comparing the same instance", () => {
      const statement = buildStatement()

      expect(statement.equals(statement)).toBe(true)
    })

    it("should return true when instances share the same id", () => {
      const first = buildStatement({ id: PERSISTED_ID })
      const second = buildStatement({ id: PERSISTED_ID })

      expect(first.equals(second)).toBe(true)
    })

    it("should return false when ids differ", () => {
      const first = buildStatement({
        id: EntityId.create("statement-1"),
      })
      const second = buildStatement({
        id: EntityId.create("statement-2"),
      })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const first = buildStatement()
      const second = buildStatement({ id: PERSISTED_ID })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const first = buildStatement({ id: PERSISTED_ID })
      const second = buildStatement()

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other is null", () => {
      const statement = buildStatement()

      expect(statement.equals(null)).toBe(false)
    })

    it("should return false when other is undefined", () => {
      const statement = buildStatement()

      expect(statement.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const statement = buildStatement()

      expect(() => {
        // @ts-expect-error - exercising runtime immutability
        statement.fileUrl = "https://cdn.test/other.pdf"
      }).toThrow(TypeError)
    })
  })
})
