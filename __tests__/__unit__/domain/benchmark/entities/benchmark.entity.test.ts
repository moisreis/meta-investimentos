import { describe, it, expect } from "vitest"
import { Benchmark } from "@/domain/benchmark/entities/benchmark.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { buildBenchmark } from "__tests__/__setup__/_factories.setup"

describe("Benchmark", () => {
  describe("create", () => {
    it("should create a valid Benchmark with required props", () => {
      const benchmark = Benchmark.create({
        acronym: "IBOV",
        name: "Ibovespa",
      })

      expect(benchmark.acronym).toBe("IBOV")
      expect(benchmark.name).toBe("Ibovespa")
      expect(benchmark.id).toBeUndefined()
      expect(benchmark.createdAt).toBeInstanceOf(Date)
    })

    it("should create a Benchmark with provided id", () => {
      const id = EntityId.create("benchmark-123")
      const benchmark = Benchmark.create(
        { acronym: "IBOV", name: "Ibovespa" },
        id
      )

      expect(benchmark.id).toBe(id)
    })

    it("should create a Benchmark with custom timestamp", () => {
      const createdAt = new Date("2026-01-01T00:00:00.000Z")
      const benchmark = Benchmark.create({
        acronym: "IBOV",
        name: "Ibovespa",
        createdAt,
      })

      expect(benchmark.createdAt).toEqual(createdAt)
    })

    it("should throw ValidationError when acronym is empty", () => {
      expect(() =>
        Benchmark.create({ acronym: "", name: "Ibovespa" })
      ).toThrow(ValidationError)
      expect(() =>
        Benchmark.create({ acronym: "   ", name: "Ibovespa" })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when name is empty", () => {
      expect(() =>
        Benchmark.create({ acronym: "IBOV", name: "" })
      ).toThrow(ValidationError)
      expect(() =>
        Benchmark.create({ acronym: "IBOV", name: "   " })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when acronym is missing", () => {
      expect(() =>
        Benchmark.create({ name: "Ibovespa" } as Parameters<
          typeof Benchmark.create
        >[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when name is missing", () => {
      expect(() =>
        Benchmark.create({ acronym: "IBOV" } as Parameters<
          typeof Benchmark.create
        >[0])
      ).toThrow(ValidationError)
    })
  })

  describe("rename", () => {
    it("should return new Benchmark with updated name", () => {
      const benchmark = buildBenchmark({
        acronym: "IBOV",
        name: "Ibovespa",
      })
      const renamed = benchmark.rename("Ibovespa Total Return")

      expect(renamed.acronym).toBe("IBOV")
      expect(renamed.name).toBe("Ibovespa Total Return")
      expect(renamed.id).toBe(benchmark.id)
      // Original unchanged
      expect(benchmark.name).toBe("Ibovespa")
    })

    it("should throw ValidationError when new name is empty", () => {
      const benchmark = buildBenchmark()
      expect(() => benchmark.rename("")).toThrow(ValidationError)
      expect(() => benchmark.rename("   ")).toThrow(
        ValidationError
      )
    })
  })

  describe("changeAcronym", () => {
    it("should return new Benchmark with updated acronym", () => {
      const benchmark = buildBenchmark({
        acronym: "IBOV",
        name: "Ibovespa",
      })
      const recoded = benchmark.changeAcronym("IBX")

      expect(recoded.acronym).toBe("IBX")
      expect(recoded.name).toBe("Ibovespa")
      expect(recoded.id).toBe(benchmark.id)
      // Original unchanged
      expect(benchmark.acronym).toBe("IBOV")
    })

    it("should throw ValidationError when new acronym is empty", () => {
      const benchmark = buildBenchmark()
      expect(() => benchmark.changeAcronym("")).toThrow(
        ValidationError
      )
      expect(() => benchmark.changeAcronym("   ")).toThrow(
        ValidationError
      )
    })
  })

  describe("equals", () => {
    it("should return true for same instance", () => {
      const benchmark = buildBenchmark()
      expect(benchmark.equals(benchmark)).toBe(true)
    })

    it("should return true for different instances with same id", () => {
      const id = EntityId.create("benchmark-123")
      const benchmark1 = Benchmark.create(
        { acronym: "IBOV", name: "Ibovespa" },
        id
      )
      const benchmark2 = Benchmark.create(
        { acronym: "IBOV", name: "Ibovespa" },
        id
      )

      expect(benchmark1.equals(benchmark2)).toBe(true)
    })

    it("should return false for different ids", () => {
      const benchmark1 = Benchmark.create(
        { acronym: "IBOV", name: "Ibovespa" },
        EntityId.create("benchmark-1")
      )
      const benchmark2 = Benchmark.create(
        { acronym: "IBOV", name: "Ibovespa" },
        EntityId.create("benchmark-2")
      )

      expect(benchmark1.equals(benchmark2)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const benchmark1 = Benchmark.create({
        acronym: "IBOV",
        name: "Ibovespa",
      })
      const benchmark2 = Benchmark.create(
        { acronym: "IBOV", name: "Ibovespa" },
        EntityId.create("benchmark-1")
      )

      expect(benchmark1.equals(benchmark2)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const benchmark1 = Benchmark.create(
        { acronym: "IBOV", name: "Ibovespa" },
        EntityId.create("benchmark-1")
      )
      const benchmark2 = Benchmark.create({
        acronym: "IBOV",
        name: "Ibovespa",
      })

      expect(benchmark1.equals(benchmark2)).toBe(false)
    })

    it("should return false when comparing to null", () => {
      const benchmark = buildBenchmark()
      expect(benchmark.equals(null)).toBe(false)
    })

    it("should return false when comparing to undefined", () => {
      const benchmark = buildBenchmark()
      expect(benchmark.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const benchmark = buildBenchmark()

      expect(() => {
        // @ts-expect-error - testing immutability by attempting to mutate readonly property
        benchmark.acronym = "NEW"
      }).toThrow()
    })

    it("should return new instances on mutations", () => {
      const benchmark = buildBenchmark()
      const renamed = benchmark.rename("Novo Nome")
      const recoded = benchmark.changeAcronym("NEW")

      expect(renamed).not.toBe(benchmark)
      expect(recoded).not.toBe(benchmark)
      expect(renamed).not.toBe(recoded)
    })
  })
})
