import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"

import { PositionPerformance } from "@/domain/position-performance/entities/position-performance.entity"
import { PositionPerformanceRepository } from "@/infrastructure/position-performance/repositories/position-performance.repository"
import { EntityId } from "@/value-objects"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"
import { NotFoundError } from "@/errors/not-found.error"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import { buildPositionPerformance } from "__tests__/__setup__/_factories.setup"
import { seedPosition } from "__tests__/__setup__/_seeds.setup"

const MISSING_ID = EntityId.create(
  "00000000-0000-0000-0000-000000000000"
)
const JAN = new Date("2026-01-31T00:00:00.000Z")
const FEB = new Date("2026-02-28T00:00:00.000Z")
const MAR = new Date("2026-03-31T00:00:00.000Z")

describe("infrastructure/position-performance/repositories/position-performance.repository", () => {
  let repo: PositionPerformanceRepository
  let db: ReturnType<typeof getTestDb>

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new PositionPerformanceRepository(db)
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()
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
      const position = await seedPosition(db)
      const saved = await repo.save(
        buildPositionPerformance({
          positionId: position.id,
        })
      )

      const result = await repo.findById(saved.id!)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(saved.id)
      expect(result!.positionId).toBe(position.id)
      expect(result!.allocation.value.toFixed(2)).toBe("50.00")
    })
  })

  describe("findAllByPositionId", () => {
    it("should return empty array when the position has none", async () => {
      const position = await seedPosition(db)

      const result = await repo.findAllByPositionId(position.id)

      expect(result).toEqual([])
    })

    it("should return every record of the position", async () => {
      const position = await seedPosition(db)
      await repo.save(
        buildPositionPerformance({
          positionId: position.id,
          date: JAN,
        })
      )
      await repo.save(
        buildPositionPerformance({
          positionId: position.id,
          date: FEB,
        })
      )

      const result = await repo.findAllByPositionId(position.id)

      expect(result.length).toBe(2)
    })
  })

  describe("findAllByPositionIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByPositionIds([])

      expect(result).toEqual([])
    })

    it("should return records across multiple positions", async () => {
      const first = await seedPosition(db)
      const second = await seedPosition(db)
      await repo.save(
        buildPositionPerformance({ positionId: first.id })
      )
      await repo.save(
        buildPositionPerformance({ positionId: second.id })
      )

      const result = await repo.findAllByPositionIds([
        first.id,
        second.id,
      ])

      expect(result.length).toBe(2)
    })
  })

  describe("findByPositionIdAndDate", () => {
    it("should return null when no record matches", async () => {
      const position = await seedPosition(db)

      const result = await repo.findByPositionIdAndDate(
        position.id,
        JAN
      )

      expect(result).toBeNull()
    })

    it("should return record when position and date match", async () => {
      const position = await seedPosition(db)
      await repo.save(
        buildPositionPerformance({
          positionId: position.id,
          date: JAN,
        })
      )

      const result = await repo.findByPositionIdAndDate(
        position.id,
        JAN
      )

      expect(result!.date).toEqual(JAN)
    })
  })

  describe("findLatestByPositionId", () => {
    it("should return null when the position has no records", async () => {
      const position = await seedPosition(db)

      const result = await repo.findLatestByPositionId(
        position.id,
        MAR
      )

      expect(result).toBeNull()
    })

    it("should return the most recent record before the given date", async () => {
      const position = await seedPosition(db)
      await repo.save(
        buildPositionPerformance({
          positionId: position.id,
          date: JAN,
        })
      )
      await repo.save(
        buildPositionPerformance({
          positionId: position.id,
          date: MAR,
        })
      )

      const result = await repo.findLatestByPositionId(
        position.id,
        MAR
      )

      expect(result!.date).toEqual(JAN)
    })
  })

  describe("save", () => {
    it("should insert new record and assign id", async () => {
      const position = await seedPosition(db)

      const saved = await repo.save(
        buildPositionPerformance({
          positionId: position.id,
        })
      )

      expect(saved.id).toBeDefined()

      const rows = await repo.findAllByPositionId(position.id)
      expect(rows.length).toBe(1)
    })

    it("should update existing record", async () => {
      const position = await seedPosition(db)
      const saved = await repo.save(
        buildPositionPerformance({
          positionId: position.id,
        })
      )

      const updated = await repo.save(
        PositionPerformance.create(
          {
            positionId: saved.positionId,
            date: saved.date,
            quotasHeld: saved.quotasHeld,
            patrimony: saved.patrimony,
            applicationTotal: saved.applicationTotal,
            redemptionTotal: saved.redemptionTotal,
            cashFlowNet: saved.cashFlowNet,
            earnings: saved.earnings,
            returnDaily: saved.returnDaily,
            returnMonthly: saved.returnMonthly,
            returnYearly: saved.returnYearly,
            returnLast12m: saved.returnLast12m,
            allocation: SignedPercentage.create("60"),
            createdAt: saved.createdAt,
          },
          saved.id
        )
      )

      expect(updated.id).toBe(saved.id)
      expect(updated.allocation.value.toFixed(2)).toBe("60.00")

      const rows = await repo.findAllByPositionId(position.id)
      expect(rows[0].allocation.value.toFixed(2)).toBe("60.00")
    })

    it("should throw NotFoundError when updating non-existent record", async () => {
      const position = await seedPosition(db)
      const ghost = buildPositionPerformance({
        positionId: position.id,
        id: MISSING_ID,
      })

      await expect(repo.save(ghost)).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe("delete", () => {
    it("should delete record by id", async () => {
      const position = await seedPosition(db)
      const saved = await repo.save(
        buildPositionPerformance({
          positionId: position.id,
        })
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
