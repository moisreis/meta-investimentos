import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"
import { eq } from "drizzle-orm"

import { BenchmarkHistory } from "@/domain/benchmark-history/entities/benchmark-history.entity"
import { BenchmarkHistoryRepository } from "@/infrastructure/benchmark-history/repositories/benchmark-history.repository"
import { BenchmarkRepository } from "@/infrastructure/benchmark/repositories/benchmark.repository"
import { benchmarkHistory } from "@/database/schemas"
import { EntityId } from "@/value-objects"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"
import { NotFoundError } from "@/errors/not-found.error"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import {
  buildBenchmark,
  buildBenchmarkHistory,
} from "__tests__/__setup__/_factories.setup"

const MISSING_ID = EntityId.create(
  "00000000-0000-0000-0000-000000000000"
)

describe("infrastructure/benchmark-history/repositories/benchmark-history.repository", () => {
  let repo: BenchmarkHistoryRepository
  let benchmarkRepo: BenchmarkRepository
  let db: ReturnType<typeof getTestDb>
  let benchmarkId: EntityId

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new BenchmarkHistoryRepository(db)
    benchmarkRepo = new BenchmarkRepository(db)
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()

    const saved = await benchmarkRepo.save(
      buildBenchmark({ acronym: "IBOV", name: "Ibovespa" })
    )
    benchmarkId = saved.id!
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("findById", () => {
    it("should return null when record does not exist", async () => {
      const result = await repo.findById(MISSING_ID)

      expect(result).toBeNull()
    })

    it("should return record when found by id", async () => {
      const saved = await repo.save(
        buildBenchmarkHistory({ benchmarkId })
      )

      const result = await repo.findById(saved.id!)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(saved.id)
      expect(result!.benchmarkId).toBe(benchmarkId)
      expect(result!.rate.value.toFixed(2)).toBe("10.75")
    })
  })

  describe("findAllByBenchmarkId", () => {
    it("should return empty array when no records exist", async () => {
      const result = await repo.findAllByBenchmarkId(benchmarkId)

      expect(result).toEqual([])
    })

    it("should return records for the given benchmark", async () => {
      await repo.save(
        buildBenchmarkHistory({
          benchmarkId,
          date: new Date("2026-01-15T00:00:00.000Z"),
        })
      )

      const result = await repo.findAllByBenchmarkId(benchmarkId)

      expect(result.length).toBe(1)
    })
  })

  describe("findAllByBenchmarkIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByBenchmarkIds([])

      expect(result).toEqual([])
    })

    it("should return records across multiple benchmarks", async () => {
      const other = await benchmarkRepo.save(
        buildBenchmark({ acronym: "CDI", name: "DI CDI" })
      )

      await repo.save(buildBenchmarkHistory({ benchmarkId }))
      await repo.save(
        buildBenchmarkHistory({ benchmarkId: other.id! })
      )

      const result = await repo.findAllByBenchmarkIds([
        benchmarkId,
        other.id!,
      ])

      expect(result.length).toBe(2)
    })
  })

  describe("findAllByBenchmarkIdsInPeriod", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByBenchmarkIdsInPeriod(
        [],
        new Date("2026-01-01T00:00:00.000Z"),
        new Date("2026-01-31T00:00:00.000Z")
      )

      expect(result).toEqual([])
    })

    it("should only return records inside the inclusive period", async () => {
      await repo.save(
        buildBenchmarkHistory({
          benchmarkId,
          date: new Date("2025-12-31T00:00:00.000Z"),
        })
      )
      await repo.save(
        buildBenchmarkHistory({
          benchmarkId,
          date: new Date("2026-01-15T00:00:00.000Z"),
        })
      )
      await repo.save(
        buildBenchmarkHistory({
          benchmarkId,
          date: new Date("2026-02-15T00:00:00.000Z"),
        })
      )

      const result = await repo.findAllByBenchmarkIdsInPeriod(
        [benchmarkId],
        new Date("2026-01-01T00:00:00.000Z"),
        new Date("2026-01-31T00:00:00.000Z")
      )

      expect(result.length).toBe(1)
      expect(result[0].date).toEqual(
        new Date("2026-01-15T00:00:00.000Z")
      )
    })

    it("should order results by date ascending", async () => {
      await repo.save(
        buildBenchmarkHistory({
          benchmarkId,
          date: new Date("2026-01-20T00:00:00.000Z"),
        })
      )
      await repo.save(
        buildBenchmarkHistory({
          benchmarkId,
          date: new Date("2026-01-05T00:00:00.000Z"),
        })
      )

      const result = await repo.findAllByBenchmarkIdsInPeriod(
        [benchmarkId],
        new Date("2026-01-01T00:00:00.000Z"),
        new Date("2026-01-31T00:00:00.000Z")
      )

      expect(result.map((r) => r.date)).toEqual([
        new Date("2026-01-05T00:00:00.000Z"),
        new Date("2026-01-20T00:00:00.000Z"),
      ])
    })
  })

  describe("findByBenchmarkIdAndDate", () => {
    it("should return null when no record matches", async () => {
      const result = await repo.findByBenchmarkIdAndDate(
        benchmarkId,
        new Date("2026-01-15T00:00:00.000Z")
      )

      expect(result).toBeNull()
    })

    it("should return record when benchmark and date match", async () => {
      const date = new Date("2026-01-15T00:00:00.000Z")
      await repo.save(
        buildBenchmarkHistory({
          benchmarkId,
          date,
          rate: SignedPercentage.create("12.50"),
        })
      )

      const result = await repo.findByBenchmarkIdAndDate(
        benchmarkId,
        date
      )

      expect(result).not.toBeNull()
      expect(result!.rate.value.toFixed(2)).toBe("12.50")
    })
  })

  describe("save", () => {
    it("should insert new record and assign id", async () => {
      const saved = await repo.save(
        buildBenchmarkHistory({ benchmarkId })
      )

      expect(saved.id).toBeDefined()

      const rows = await db
        .select()
        .from(benchmarkHistory)
        .where(eq(benchmarkHistory.benchmarkId, benchmarkId))
        .execute()

      expect(rows.length).toBe(1)
    })

    it("should update existing record", async () => {
      const saved = await repo.save(
        buildBenchmarkHistory({
          benchmarkId,
          rate: SignedPercentage.create("1.00"),
        })
      )

      const updated = await repo.save(
        BenchmarkHistory.create(
          {
            benchmarkId,
            date: saved.date,
            rate: SignedPercentage.create("9.99"),
            createdAt: saved.createdAt,
          },
          saved.id!
        )
      )

      expect(updated.id).toBe(saved.id)
      expect(updated.rate.value.toFixed(2)).toBe("9.99")
    })

    it("should throw NotFoundError when updating non-existent record", async () => {
      const ghost = BenchmarkHistory.create(
        {
          benchmarkId,
          date: new Date("2026-01-15T00:00:00.000Z"),
          rate: SignedPercentage.create("1.00"),
        },
        MISSING_ID
      )

      await expect(repo.save(ghost)).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe("delete", () => {
    it("should delete record by id", async () => {
      const saved = await repo.save(
        buildBenchmarkHistory({ benchmarkId })
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
