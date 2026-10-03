import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"

import { Withdrawal } from "@/domain/withdrawal/entities/withdrawal.entity"
import { WithdrawalRepository } from "@/infrastructure/withdrawal/repositories/withdrawal.repository"
import { EntityId } from "@/value-objects"
import { PositiveMoney } from "@/value-objects/positive-money.vo"
import { QuotaQuantity } from "@/value-objects/quota-quantity.vo"
import { ConcurrencyError } from "@/errors/concurrency.error"
import { NotFoundError } from "@/errors/not-found.error"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import { buildWithdrawal } from "__tests__/__setup__/_factories.setup"
import {
  seedPosition,
  seedUser,
  seedWithdrawal,
} from "__tests__/__setup__/_seeds.setup"

const MISSING_ID = EntityId.create(
  "00000000-0000-0000-0000-000000000000"
)
const JAN = new Date("2026-01-15")
const FEB = new Date("2026-02-15")
const MAR = new Date("2026-03-15")

describe("infrastructure/withdrawal/repositories/withdrawal.repository", () => {
  let repo: WithdrawalRepository
  let db: ReturnType<typeof getTestDb>

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new WithdrawalRepository(db)
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("findById", () => {
    it("should return null when withdrawal does not exist", async () => {
      const result = await repo.findById(MISSING_ID)

      expect(result).toBeNull()
    })

    it("should return withdrawal when found by id", async () => {
      const seeded = await seedWithdrawal(db)

      const result = await repo.findById(seeded.id)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(seeded.id)
      expect(result!.amount.value.toFixed(2)).toBe("500.00")
      expect(result!.reversedAt).toBeNull()
    })
  })

  describe("findAllByPositionId", () => {
    it("should return empty array when the position has none", async () => {
      const position = await seedPosition(db)

      const result = await repo.findAllByPositionId(position.id)

      expect(result).toEqual([])
    })

    it("should return every withdrawal of the position", async () => {
      const position = await seedPosition(db)
      await repo.save(
        buildWithdrawal({ positionId: position.id })
      )
      await repo.save(
        buildWithdrawal({ positionId: position.id })
      )

      const result = await repo.findAllByPositionId(position.id)

      expect(result.length).toBe(2)
    })
  })

  describe("findAllByPositionIdInPeriod", () => {
    it("should only return non-reversed withdrawals inside the period", async () => {
      const position = await seedPosition(db)
      const user = await seedUser(db)
      await repo.save(
        buildWithdrawal({
          positionId: position.id,
          date: JAN,
        })
      )
      await repo.save(
        buildWithdrawal({
          positionId: position.id,
          date: MAR,
        })
      )
      const reversed = await repo.save(
        buildWithdrawal({
          positionId: position.id,
          date: FEB,
        })
      )
      await repo.save(reversed.reverse(user.id))

      const result = await repo.findAllByPositionIdInPeriod(
        position.id,
        JAN,
        MAR
      )

      expect(result.map((w) => w.date)).toEqual([JAN, MAR])
    })
  })

  describe("findAllByPositionIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByPositionIds([])

      expect(result).toEqual([])
    })

    it("should return withdrawals across multiple positions", async () => {
      const first = await seedPosition(db)
      const second = await seedPosition(db)
      await repo.save(buildWithdrawal({ positionId: first.id }))
      await repo.save(buildWithdrawal({ positionId: second.id }))

      const result = await repo.findAllByPositionIds([
        first.id,
        second.id,
      ])

      expect(result.length).toBe(2)
    })
  })

  describe("findAllByPositionIdsInPeriod", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByPositionIdsInPeriod(
        [],
        JAN,
        MAR
      )

      expect(result).toEqual([])
    })

    it("should return withdrawals across positions inside the period", async () => {
      const first = await seedPosition(db)
      const second = await seedPosition(db)
      await repo.save(
        buildWithdrawal({
          positionId: first.id,
          date: JAN,
        })
      )
      await repo.save(
        buildWithdrawal({
          positionId: second.id,
          date: FEB,
        })
      )
      await repo.save(
        buildWithdrawal({
          positionId: second.id,
          date: MAR,
        })
      )

      const result = await repo.findAllByPositionIdsInPeriod(
        [first.id, second.id],
        JAN,
        FEB
      )

      expect(result.length).toBe(2)
    })
  })

  describe("sumByPositionIdInPeriod", () => {
    it("should return null totals when nothing matches", async () => {
      const position = await seedPosition(db)

      const result = await repo.sumByPositionIdInPeriod(
        position.id,
        JAN,
        MAR
      )

      expect(result.amount).toBeNull()
      expect(result.quotas).toBeNull()
    })

    it("should sum amounts and quotas ignoring reversed rows", async () => {
      const position = await seedPosition(db)
      const user = await seedUser(db)
      await repo.save(
        buildWithdrawal({
          positionId: position.id,
          date: JAN,
          amount: PositiveMoney.create("100.00"),
          quotas: QuotaQuantity.create("10.00"),
        })
      )
      const reversed = await repo.save(
        buildWithdrawal({
          positionId: position.id,
          date: FEB,
          amount: PositiveMoney.create("999.00"),
          quotas: QuotaQuantity.create("99.00"),
        })
      )
      await repo.save(reversed.reverse(user.id))

      const result = await repo.sumByPositionIdInPeriod(
        position.id,
        JAN,
        MAR
      )

      expect(result.amount!.value.toFixed(2)).toBe("100.00")
      expect(result.quotas!.value.toFixed(2)).toBe("10.00")
    })
  })

  describe("save", () => {
    it("should insert new withdrawal and assign id", async () => {
      const position = await seedPosition(db)

      const saved = await repo.save(
        buildWithdrawal({ positionId: position.id })
      )

      expect(saved.id).toBeDefined()
      expect(saved.version).toBe(0)

      const rows = await repo.findAllByPositionId(position.id)
      expect(rows.length).toBe(1)
    })

    it("should update existing withdrawal and bump the version", async () => {
      const seeded = await seedWithdrawal(db)
      const user = await seedUser(db)

      const updated = await repo.save(
        seeded.reverse(
          user.id,
          new Date("2026-04-01T00:00:00.000Z")
        )
      )

      expect(updated.id).toBe(seeded.id)
      expect(updated.reversedAt).toEqual(
        new Date("2026-04-01T00:00:00.000Z")
      )
      expect(updated.version).toBe(1)
    })

    it("should throw ConcurrencyError when the version is stale", async () => {
      const seeded = await seedWithdrawal(db)
      const user = await seedUser(db)

      await repo.save(
        seeded.reverse(
          user.id,
          new Date("2026-04-01T00:00:00.000Z")
        )
      )

      await expect(
        repo.save(
          seeded.reverse(
            user.id,
            new Date("2026-04-02T00:00:00.000Z")
          )
        )
      ).rejects.toThrow(ConcurrencyError)
    })

    it("should throw NotFoundError when updating non-existent withdrawal", async () => {
      const position = await seedPosition(db)
      const ghost = Withdrawal.create(
        {
          positionId: position.id,
          date: JAN,
          amount: PositiveMoney.create("10.00"),
          quotas: QuotaQuantity.create("1.00"),
        },
        MISSING_ID
      )

      await expect(repo.save(ghost)).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe("delete", () => {
    it("should delete withdrawal by id", async () => {
      const seeded = await seedWithdrawal(db)

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
