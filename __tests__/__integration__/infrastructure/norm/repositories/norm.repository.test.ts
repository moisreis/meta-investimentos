import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"

import { NormRepository } from "@infrastructure/norm/repositories/norm.repository"
import { EntityId } from "@/value-objects"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"
import { ConcurrencyError } from "@/errors/concurrency.error"
import { NotFoundError } from "@/errors/not-found.error"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import { buildNorm } from "__tests__/__setup__/_factories.setup"
import {
  seedCategory,
  seedNorm,
} from "__tests__/__setup__/_seeds.setup"

const MISSING_ID = EntityId.create(
  "00000000-0000-0000-0000-000000000000"
)

describe("infrastructure/norm/repositories/norm.repository", () => {
  let repo: NormRepository
  let db: ReturnType<typeof getTestDb>

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new NormRepository(db)
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("findById", () => {
    it("should return null when norm does not exist", async () => {
      const result = await repo.findById(MISSING_ID)

      expect(result).toBeNull()
    })

    it("should return norm when found by id", async () => {
      const category = await seedCategory(db)
      const seeded = await seedNorm(db, {
        categoryId: category.id,
      })

      const result = await repo.findById(seeded.id)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(seeded.id)
      expect(result!.categoryId).toBe(category.id)
      expect(result!.articleNumber).toBe(seeded.articleNumber)
      expect(result!.minAllocation.value.toFixed(2)).toBe("5.00")
      expect(result!.maxAllocation.value.toFixed(2)).toBe(
        "20.00"
      )
    })
  })

  describe("findAllByCategoryId", () => {
    it("should return empty array when the category has none", async () => {
      const category = await seedCategory(db)

      const result = await repo.findAllByCategoryId(category.id)

      expect(result).toEqual([])
    })

    it("should return only the norms of the category", async () => {
      const category = await seedCategory(db)
      const other = await seedCategory(db)
      await repo.save(
        buildNorm({
          categoryId: category.id,
          articleNumber: "Art. 1",
        })
      )
      await repo.save(
        buildNorm({
          categoryId: category.id,
          articleNumber: "Art. 2",
        })
      )
      await repo.save(
        buildNorm({
          categoryId: other.id,
          articleNumber: "Art. 3",
        })
      )

      const result = await repo.findAllByCategoryId(category.id)

      expect(result.length).toBe(2)
    })
  })

  describe("findAllByCategoryIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByCategoryIds([])

      expect(result).toEqual([])
    })

    it("should return norms across multiple categories", async () => {
      const first = await seedCategory(db)
      const second = await seedCategory(db)
      await repo.save(buildNorm({ categoryId: first.id }))
      await repo.save(buildNorm({ categoryId: second.id }))

      const result = await repo.findAllByCategoryIds([
        first.id,
        second.id,
      ])

      expect(result.length).toBe(2)
    })
  })

  describe("save", () => {
    it("should insert new norm and assign id", async () => {
      const category = await seedCategory(db)

      const saved = await repo.save(
        buildNorm({ categoryId: category.id })
      )

      expect(saved.id).toBeDefined()
      expect(saved.version).toBe(0)

      const rows = await repo.findAllByCategoryId(category.id)
      expect(rows.length).toBe(1)
    })

    it("should update existing norm and bump the version", async () => {
      const seeded = await seedNorm(db)
      const now = new Date("2026-05-10T12:00:00.000Z")

      const updated = await repo.save(
        seeded.update(
          {
            articleNumber: "Art. 99",
            targetAllocation: SignedPercentage.create("15"),
          },
          now
        )
      )

      expect(updated.id).toBe(seeded.id)
      expect(updated.articleNumber).toBe("Art. 99")
      expect(updated.targetAllocation.value.toFixed(2)).toBe(
        "15.00"
      )
      expect(updated.version).toBe(1)
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(
        seeded.updatedAt.getTime()
      )
    })

    it("should throw ConcurrencyError when the version is stale", async () => {
      const seeded = await seedNorm(db)

      await repo.save(
        seeded.update({ articleNumber: "Art. 50" })
      )

      await expect(
        repo.save(seeded.update({ articleNumber: "Art. 51" }))
      ).rejects.toThrow(ConcurrencyError)
    })

    it("should throw NotFoundError when updating non-existent norm", async () => {
      const category = await seedCategory(db)
      const ghost = buildNorm({
        categoryId: category.id,
        id: MISSING_ID,
      })

      await expect(repo.save(ghost)).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe("delete", () => {
    it("should delete norm by id", async () => {
      const seeded = await seedNorm(db)

      await repo.delete(seeded.id)

      expect(await repo.findById(seeded.id)).toBeNull()
    })

    it("should do nothing when deleting non-existent id", async () => {
      await expect(
        repo.delete(MISSING_ID)
      ).resolves.toBeUndefined()
    })
  })
})
