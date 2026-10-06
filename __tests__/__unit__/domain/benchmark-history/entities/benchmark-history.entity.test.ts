import { describe, it, expect } from "vitest"
import { BenchmarkHistory } from "@/domain/benchmark-history/entities/benchmark-history.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"
import { buildBenchmarkHistory } from "__tests__/__setup__/_factories.setup"

describe("BenchmarkHistory", () => {
  describe("create", () => {
    it("should create a valid BenchmarkHistory with required props", () => {
      const history = BenchmarkHistory.create({
        benchmarkId: EntityId.create("benchmark-1"),
        date: new Date("2026-01-15"),
        rate: SignedPercentage.create("10.75"),
      })

      expect(history.benchmarkId).toBe(
        EntityId.create("benchmark-1")
      )
      expect(history.date).toEqual(new Date("2026-01-15"))
      expect(history.rate.value.toFixed(2)).toBe("10.75")
      expect(history.id).toBeUndefined()
      expect(history.createdAt).toBeInstanceOf(Date)
    })

    it("should create a BenchmarkHistory with provided id", () => {
      const id = EntityId.create("history-123")
      const history = BenchmarkHistory.create(
        {
          benchmarkId: EntityId.create("benchmark-1"),
          date: new Date("2026-01-15"),
          rate: SignedPercentage.create("10.75"),
        },
        id
      )

      expect(history.id).toBe(id)
    })

    it("should create a BenchmarkHistory with custom timestamp", () => {
      const createdAt = new Date("2026-01-01T00:00:00.000Z")
      const history = BenchmarkHistory.create({
        benchmarkId: EntityId.create("benchmark-1"),
        date: new Date("2026-01-15"),
        rate: SignedPercentage.create("10.75"),
        createdAt,
      })

      expect(history.createdAt).toEqual(createdAt)
    })

    it("should throw ValidationError when benchmarkId is empty", () => {
      expect(() =>
        BenchmarkHistory.create({
          benchmarkId: EntityId.create(""),
          date: new Date("2026-01-15"),
          rate: SignedPercentage.create("10.75"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when date is missing", () => {
      expect(() =>
        BenchmarkHistory.create({
          benchmarkId: EntityId.create("benchmark-1"),
          rate: SignedPercentage.create("10.75"),
        } as Parameters<typeof BenchmarkHistory.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when rate is missing", () => {
      expect(() =>
        BenchmarkHistory.create({
          benchmarkId: EntityId.create("benchmark-1"),
          date: new Date("2026-01-15"),
        } as Parameters<typeof BenchmarkHistory.create>[0])
      ).toThrow(ValidationError)
    })
  })

  describe("update", () => {
    it("should return new BenchmarkHistory with updated rate", () => {
      const history = buildBenchmarkHistory({
        rate: SignedPercentage.create("10.75"),
      })
      const updated = history.update({
        benchmarkId: history.benchmarkId,
        date: history.date,
        rate: SignedPercentage.create("11.25"),
      })

      expect(updated.rate.value.toFixed(2)).toBe("11.25")
      expect(updated.id).toBe(history.id)
      // Original unchanged
      expect(history.rate.value.toFixed(2)).toBe("10.75")
    })

    it("should return new BenchmarkHistory with updated index", () => {
      const history = buildBenchmarkHistory()
      const updated = history.update({
        benchmarkId: EntityId.create("benchmark-2"),
        date: history.date,
        rate: history.rate,
      })

      expect(updated.benchmarkId).toBe("benchmark-2")
      expect(updated.id).toBe(history.id)
      expect(history.benchmarkId).not.toBe("benchmark-2")
    })

    it("should return new BenchmarkHistory with updated date", () => {
      const history = buildBenchmarkHistory()
      const updated = history.update({
        benchmarkId: history.benchmarkId,
        date: new Date("2026-02-01T00:00:00.000Z"),
        rate: history.rate,
      })

      expect(updated.date).toEqual(
        new Date("2026-02-01T00:00:00.000Z")
      )
      expect(updated.id).toBe(history.id)
    })

    it("should keep the creation instant of the entry", () => {
      const history = buildBenchmarkHistory({
        createdAt: new Date("2026-01-02T03:04:05.000Z"),
      })
      const updated = history.update({
        benchmarkId: history.benchmarkId,
        date: history.date,
        rate: SignedPercentage.create("1"),
      })

      expect(updated.createdAt).toEqual(
        new Date("2026-01-02T03:04:05.000Z")
      )
    })

    it("should throw ValidationError when new rate is missing", () => {
      const history = buildBenchmarkHistory()

      expect(() =>
        history.update({
          benchmarkId: history.benchmarkId,
          date: history.date,
          rate: null as unknown as Parameters<
            typeof history.update
          >[0]["rate"],
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when the index is missing", () => {
      const history = buildBenchmarkHistory()

      expect(() =>
        history.update({
          benchmarkId: null as unknown as Parameters<
            typeof history.update
          >[0]["benchmarkId"],
          date: history.date,
          rate: history.rate,
        })
      ).toThrow(ValidationError)
    })
  })

  describe("equals", () => {
    it("should return true for same instance", () => {
      const history = buildBenchmarkHistory()
      expect(history.equals(history)).toBe(true)
    })

    it("should return true for different instances with same id", () => {
      const id = EntityId.create("history-123")
      const history1 = BenchmarkHistory.create(
        {
          benchmarkId: EntityId.create("benchmark-1"),
          date: new Date("2026-01-15"),
          rate: SignedPercentage.create("10.75"),
        },
        id
      )
      const history2 = BenchmarkHistory.create(
        {
          benchmarkId: EntityId.create("benchmark-1"),
          date: new Date("2026-01-15"),
          rate: SignedPercentage.create("10.75"),
        },
        id
      )

      expect(history1.equals(history2)).toBe(true)
    })

    it("should return false for different ids", () => {
      const history1 = BenchmarkHistory.create(
        {
          benchmarkId: EntityId.create("benchmark-1"),
          date: new Date("2026-01-15"),
          rate: SignedPercentage.create("10.75"),
        },
        EntityId.create("history-1")
      )
      const history2 = BenchmarkHistory.create(
        {
          benchmarkId: EntityId.create("benchmark-1"),
          date: new Date("2026-01-15"),
          rate: SignedPercentage.create("10.75"),
        },
        EntityId.create("history-2")
      )

      expect(history1.equals(history2)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const history1 = BenchmarkHistory.create({
        benchmarkId: EntityId.create("benchmark-1"),
        date: new Date("2026-01-15"),
        rate: SignedPercentage.create("10.75"),
      })
      const history2 = BenchmarkHistory.create(
        {
          benchmarkId: EntityId.create("benchmark-1"),
          date: new Date("2026-01-15"),
          rate: SignedPercentage.create("10.75"),
        },
        EntityId.create("history-1")
      )

      expect(history1.equals(history2)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const history1 = BenchmarkHistory.create(
        {
          benchmarkId: EntityId.create("benchmark-1"),
          date: new Date("2026-01-15"),
          rate: SignedPercentage.create("10.75"),
        },
        EntityId.create("history-1")
      )
      const history2 = BenchmarkHistory.create({
        benchmarkId: EntityId.create("benchmark-1"),
        date: new Date("2026-01-15"),
        rate: SignedPercentage.create("10.75"),
      })

      expect(history1.equals(history2)).toBe(false)
    })

    it("should return false when comparing to null", () => {
      const history = buildBenchmarkHistory()
      expect(history.equals(null)).toBe(false)
    })

    it("should return false when comparing to undefined", () => {
      const history = buildBenchmarkHistory()
      expect(history.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const history = buildBenchmarkHistory()

      expect(() => {
        // @ts-expect-error - testing immutability by attempting to mutate readonly property
        history.rate = SignedPercentage.create("99.99")
      }).toThrow()
    })

    it("should return new instances on mutations", () => {
      const history = buildBenchmarkHistory()
      const updated = history.update({
        benchmarkId: history.benchmarkId,
        date: history.date,
        rate: SignedPercentage.create("99.99"),
      })

      expect(updated).not.toBe(history)
    })
  })
})
