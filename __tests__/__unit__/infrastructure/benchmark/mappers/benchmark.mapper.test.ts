import { describe, it, expect } from "vitest"

import { Benchmark } from "@/domain/benchmark/entities/benchmark.entity"
import { EntityId } from "@/value-objects"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "@/infrastructure/benchmark/mappers/benchmark.mapper"
import { buildBenchmark } from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  getFixedDate,
} from "__tests__/__setup__/_clock.setup"

const ID = "00000000-0000-0000-0000-000000000010"

describe("infrastructure/benchmark/mappers/benchmark.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to Benchmark entity", () => {
      useFixedClock()

      const createdAt = getFixedDate()
      const row = {
        id: ID,
        acronym: "IBOV",
        name: "Ibovespa",
        createdAt,
      }

      const benchmark = ToDomain(row)

      expect(benchmark.id).toBe(EntityId.create(ID))
      expect(benchmark.acronym).toBe("IBOV")
      expect(benchmark.name).toBe("Ibovespa")
      expect(benchmark.createdAt).toEqual(createdAt)
    })
  })

  describe("ToInsert", () => {
    it("should map Benchmark entity to insert object without id", () => {
      const benchmark = buildBenchmark({ acronym: "IBOV" })

      const insert = ToInsert(benchmark)

      expect(insert).not.toHaveProperty("id")
      expect(insert.acronym).toBe("IBOV")
      expect(insert.name).toBe(benchmark.name)
      expect(insert.createdAt).toEqual(benchmark.createdAt)
    })
  })

  describe("ToUpdate", () => {
    it("should map Benchmark entity to update object without timestamps", () => {
      const benchmark = buildBenchmark({ acronym: "IBOV" })

      const update = ToUpdate(benchmark)

      expect(update).not.toHaveProperty("id")
      expect(update).not.toHaveProperty("createdAt")
      expect(update.acronym).toBe("IBOV")
      expect(update.name).toBe(benchmark.name)
    })
  })

  describe("round-trip", () => {
    it("should preserve the entity through ToInsert then ToDomain", () => {
      const original = Benchmark.create(
        {
          acronym: "IBOV",
          name: "Ibovespa",
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
      expect(restored.acronym).toBe("IBOV")
      expect(restored.name).toBe("Ibovespa")
    })

    it("should preserve the entity through ToUpdate then ToDomain", () => {
      const original = Benchmark.create(
        {
          acronym: "IBOV",
          name: "Ibovespa",
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
