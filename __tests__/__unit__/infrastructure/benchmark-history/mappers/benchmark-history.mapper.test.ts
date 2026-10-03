import { describe, it, expect } from "vitest"

import { BenchmarkHistory } from "@/domain/benchmark-history/entities/benchmark-history.entity"
import { EntityId } from "@/value-objects"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "@/infrastructure/benchmark-history/mappers/benchmark-history.mapper"
import { buildBenchmarkHistory } from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000011"
const BENCHMARK_ID = "00000000-0000-0000-0000-000000000010"

describe("infrastructure/benchmark-history/mappers/benchmark-history.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to BenchmarkHistory entity", () => {
      const row = {
        id: ID,
        benchmarkId: BENCHMARK_ID,
        date: new Date("2026-01-15T00:00:00.000Z"),
        rate: "10.750000",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      }

      const history = ToDomain(row)

      expect(history.id).toBe(EntityId.create(ID))
      expect(history.benchmarkId).toBe(
        EntityId.create(BENCHMARK_ID)
      )
      expect(history.date).toEqual(row.date)
      expect(history.rate.value.toFixed(2)).toBe("10.75")
      expect(history.createdAt).toEqual(row.createdAt)
    })
  })

  describe("ToInsert", () => {
    it("should map BenchmarkHistory entity to insert object without id", () => {
      const history = buildBenchmarkHistory({
        benchmarkId: EntityId.create(BENCHMARK_ID),
      })

      const insert = ToInsert(history)

      expect(insert).not.toHaveProperty("id")
      expect(insert.benchmarkId).toBe(BENCHMARK_ID)
      expect(insert.date).toEqual(history.date)
      expect(insert.rate).toBe(history.rate.value.toString())
      expect(insert.createdAt).toEqual(history.createdAt)
    })

    it("should serialize a negative rate", () => {
      const history = buildBenchmarkHistory({
        rate: SignedPercentage.create("-1.25"),
      })

      expect(ToInsert(history).rate).toBe(
        history.rate.value.toString()
      )
    })
  })

  describe("ToUpdate", () => {
    it("should map BenchmarkHistory entity to update object without createdAt", () => {
      const history = buildBenchmarkHistory()

      const update = ToUpdate(history)

      expect(update).not.toHaveProperty("id")
      expect(update).not.toHaveProperty("createdAt")
      expect(update.rate).toBe(history.rate.value.toString())
    })
  })

  describe("round-trip", () => {
    it("should preserve the entity through ToInsert then ToDomain", () => {
      const original = BenchmarkHistory.create(
        {
          benchmarkId: EntityId.create(BENCHMARK_ID),
          date: new Date("2026-01-15T00:00:00.000Z"),
          rate: SignedPercentage.create("10.75"),
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        ID
      )

      const row = {
        ...ToInsert(original),
        id: original.id!,
      } as Parameters<typeof ToDomain>[0]
      const restored = ToDomain(row)

      expect(restored.equals(original)).toBe(true)
      expect(restored.rate.value.toFixed(2)).toBe("10.75")
    })

    it("should preserve the entity through ToUpdate then ToDomain", () => {
      const original = BenchmarkHistory.create(
        {
          benchmarkId: EntityId.create(BENCHMARK_ID),
          date: new Date("2026-01-15T00:00:00.000Z"),
          rate: SignedPercentage.create("10.75"),
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        ID
      )

      const row = {
        ...ToUpdate(original),
        id: original.id!,
        createdAt: original.createdAt,
      } as Parameters<typeof ToDomain>[0]

      expect(ToDomain(row).equals(original)).toBe(true)
    })
  })
})
