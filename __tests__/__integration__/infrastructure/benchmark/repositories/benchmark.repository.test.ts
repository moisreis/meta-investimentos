import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"
import { eq } from "drizzle-orm"

import { Benchmark } from "@/domain/benchmark/entities/benchmark.entity"
import { BenchmarkRepository } from "@/infrastructure/benchmark/repositories/benchmark.repository"
import { benchmark } from "@/database/schemas"
import { EntityId } from "@/value-objects"
import { NotFoundError } from "@/errors/not-found.error"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import { buildBenchmark } from "__tests__/__setup__/_factories.setup"

const MISSING_ID = EntityId.create(
  "00000000-0000-0000-0000-000000000000"
)

describe("infrastructure/benchmark/repositories/benchmark.repository", () => {
  let repo: BenchmarkRepository
  let db: ReturnType<typeof getTestDb>

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new BenchmarkRepository(db)
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("findById", () => {
    it("should return null when benchmark does not exist", async () => {
      const result = await repo.findById(MISSING_ID)

      expect(result).toBeNull()
    })

    it("should return benchmark when found by id", async () => {
      const saved = await repo.save(
        buildBenchmark({ acronym: "IBOV", name: "Ibovespa" })
      )

      const result = await repo.findById(saved.id!)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(saved.id)
      expect(result!.acronym).toBe("IBOV")
      expect(result!.name).toBe("Ibovespa")
    })
  })

  describe("findByAcronym", () => {
    it("should return null when benchmark does not exist", async () => {
      const result = await repo.findByAcronym("NOPE")

      expect(result).toBeNull()
    })

    it("should return benchmark when found by acronym", async () => {
      await repo.save(
        buildBenchmark({ acronym: "CDI", name: "DI CDI" })
      )

      const result = await repo.findByAcronym("CDI")

      expect(result).not.toBeNull()
      expect(result!.acronym).toBe("CDI")
      expect(result!.name).toBe("DI CDI")
    })

    it("should return the most recently created match when duplicates exist", async () => {
      await repo.save(
        buildBenchmark({
          acronym: "DUP",
          name: "Antigo",
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
        })
      )
      await repo.save(
        buildBenchmark({
          acronym: "DUP",
          name: "Recente",
          createdAt: new Date("2026-06-01T00:00:00.000Z"),
        })
      )

      const result = await repo.findByAcronym("DUP")

      expect(result!.name).toBe("Recente")
    })
  })

  describe("findAll", () => {
    it("should return empty array when no benchmarks exist", async () => {
      const result = await repo.findAll()

      expect(result).toEqual([])
    })

    it("should return all benchmarks ordered by name", async () => {
      await repo.save(buildBenchmark({ name: "Zeta" }))
      await repo.save(buildBenchmark({ name: "Alpha" }))
      await repo.save(buildBenchmark({ name: "Mid" }))

      const result = await repo.findAll()

      expect(result.map((b) => b.name)).toEqual([
        "Alpha",
        "Mid",
        "Zeta",
      ])
    })

    it("should support pagination with limit and offset", async () => {
      await repo.save(buildBenchmark({ name: "A" }))
      await repo.save(buildBenchmark({ name: "B" }))
      await repo.save(buildBenchmark({ name: "C" }))

      const page1 = await repo.findAll({ limit: 2, offset: 0 })
      expect(page1.map((b) => b.name)).toEqual(["A", "B"])

      const page2 = await repo.findAll({ limit: 2, offset: 2 })
      expect(page2.map((b) => b.name)).toEqual(["C"])
    })
  })

  describe("findAllByIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByIds([])

      expect(result).toEqual([])
    })

    it("should return matching benchmarks by ids", async () => {
      const first = await repo.save(
        buildBenchmark({ name: "A" })
      )
      const second = await repo.save(
        buildBenchmark({ name: "B" })
      )
      await repo.save(buildBenchmark({ name: "C" }))

      const result = await repo.findAllByIds([
        first.id!,
        second.id!,
      ])

      expect(result.map((b) => b.name).sort()).toEqual([
        "A",
        "B",
      ])
    })

    it("should only return existing ids", async () => {
      const first = await repo.save(
        buildBenchmark({ name: "A" })
      )

      const result = await repo.findAllByIds([
        first.id!,
        MISSING_ID,
      ])

      expect(result.length).toBe(1)
    })
  })

  describe("save", () => {
    it("should insert new benchmark and assign id", async () => {
      const saved = await repo.save(
        buildBenchmark({ acronym: "SMAL", name: "Small Cap" })
      )

      expect(saved.id).toBeDefined()

      const rows = await db
        .select()
        .from(benchmark)
        .where(eq(benchmark.acronym, "SMAL"))
        .execute()

      expect(rows.length).toBe(1)
    })

    it("should update existing benchmark", async () => {
      const saved = await repo.save(
        buildBenchmark({ acronym: "OLD", name: "Nome Antigo" })
      )

      const updated = await repo.save(
        saved.rename("Nome Novo").changeAcronym("NEW")
      )

      expect(updated.id).toBe(saved.id)
      expect(updated.name).toBe("Nome Novo")
      expect(updated.acronym).toBe("NEW")

      const rows = await db
        .select()
        .from(benchmark)
        .where(eq(benchmark.acronym, "NEW"))
        .execute()

      expect(rows.length).toBe(1)
    })

    it("should throw NotFoundError when updating non-existent benchmark", async () => {
      const ghost = Benchmark.create(
        { acronym: "GHO", name: "Fantasma" },
        MISSING_ID
      )

      await expect(repo.save(ghost)).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe("delete", () => {
    it("should delete benchmark by id", async () => {
      const saved = await repo.save(
        buildBenchmark({ name: "Deletar" })
      )

      await repo.delete(saved.id!)

      expect(await repo.findById(saved.id!)).toBeNull()
    })

    it("should do nothing when deleting non-existent id", async () => {
      await expect(
        repo.delete(MISSING_ID)
      ).resolves.toBeUndefined()
    })
  })
})
