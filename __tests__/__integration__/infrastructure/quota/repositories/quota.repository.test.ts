import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"

import { Quota } from "@/domain/quota/entities/quota.entity"
import { QuotaRepository } from "@/infrastructure/quota/repositories/quota.repository"
import { EntityId } from "@/value-objects"
import { QuotaPrice } from "@/value-objects/quota-price.vo"
import { NotFoundError } from "@/errors/not-found.error"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import { buildQuota } from "__tests__/__setup__/_factories.setup"
import { seedFund } from "__tests__/__setup__/_seeds.setup"

const MISSING_ID = EntityId.create(
  "00000000-0000-0000-0000-000000000000"
)
const JAN = new Date("2026-01-15T00:00:00.000Z")
const FEB = new Date("2026-02-15T00:00:00.000Z")
const MAR = new Date("2026-03-15T00:00:00.000Z")

describe("infrastructure/quota/repositories/quota.repository", () => {
  let repo: QuotaRepository
  let db: ReturnType<typeof getTestDb>

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new QuotaRepository(db)
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("findById", () => {
    it("should return null when quota does not exist", async () => {
      const result = await repo.findById(MISSING_ID)

      expect(result).toBeNull()
    })

    it("should return quota when found by id", async () => {
      const fund = await seedFund(db)
      const saved = await repo.save(
        buildQuota({ fundId: fund.id })
      )

      const result = await repo.findById(saved.id!)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(saved.id)
      expect(result!.fundId).toBe(fund.id)
      expect(result!.price.value.toFixed(2)).toBe("10.50")
    })
  })

  describe("findAllByFundId", () => {
    it("should return empty array when the fund has no quotas", async () => {
      const fund = await seedFund(db)

      const result = await repo.findAllByFundId(fund.id)

      expect(result).toEqual([])
    })

    it("should return every quota of the fund", async () => {
      const fund = await seedFund(db)
      await repo.save(buildQuota({ fundId: fund.id, date: JAN }))
      await repo.save(buildQuota({ fundId: fund.id, date: FEB }))

      const result = await repo.findAllByFundId(fund.id)

      expect(result.length).toBe(2)
    })
  })

  describe("findAllByFundIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByFundIds([])

      expect(result).toEqual([])
    })

    it("should return quotas across multiple funds", async () => {
      const first = await seedFund(db)
      const second = await seedFund(db)
      await repo.save(buildQuota({ fundId: first.id }))
      await repo.save(buildQuota({ fundId: second.id }))

      const result = await repo.findAllByFundIds([
        first.id,
        second.id,
      ])

      expect(result.length).toBe(2)
    })
  })

  describe("findByFundIdAndDate", () => {
    it("should return null when no quota matches", async () => {
      const fund = await seedFund(db)

      const result = await repo.findByFundIdAndDate(fund.id, JAN)

      expect(result).toBeNull()
    })

    it("should return quota when fund and date match", async () => {
      const fund = await seedFund(db)
      await repo.save(
        buildQuota({
          fundId: fund.id,
          date: JAN,
          price: QuotaPrice.create("11.25"),
        })
      )

      const result = await repo.findByFundIdAndDate(fund.id, JAN)

      expect(result!.price.value.toFixed(2)).toBe("11.25")
    })
  })

  describe("findAllByFundIdsInPeriod", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByFundIdsInPeriod(
        [],
        JAN,
        MAR
      )

      expect(result).toEqual([])
    })

    it("should only return quotas inside the inclusive period", async () => {
      const fund = await seedFund(db)
      await repo.save(buildQuota({ fundId: fund.id, date: JAN }))
      await repo.save(buildQuota({ fundId: fund.id, date: FEB }))
      await repo.save(buildQuota({ fundId: fund.id, date: MAR }))

      const result = await repo.findAllByFundIdsInPeriod(
        [fund.id],
        JAN,
        FEB
      )

      expect(result.map((q) => q.date)).toEqual([JAN, FEB])
    })
  })

  describe("findLatestByFundId", () => {
    it("should return null when the fund has no quotas", async () => {
      const fund = await seedFund(db)

      const result = await repo.findLatestByFundId(fund.id)

      expect(result).toBeNull()
    })

    it("should return the most recent quota", async () => {
      const fund = await seedFund(db)
      await repo.save(buildQuota({ fundId: fund.id, date: JAN }))
      await repo.save(buildQuota({ fundId: fund.id, date: MAR }))
      await repo.save(buildQuota({ fundId: fund.id, date: FEB }))

      const result = await repo.findLatestByFundId(fund.id)

      expect(result!.date).toEqual(MAR)
    })
  })

  describe("findLatestByFundIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findLatestByFundIds([])

      expect(result).toEqual([])
    })

    it("should return the most recent quota per fund", async () => {
      const first = await seedFund(db)
      const second = await seedFund(db)
      await repo.save(
        buildQuota({ fundId: first.id, date: JAN })
      )
      await repo.save(
        buildQuota({ fundId: first.id, date: FEB })
      )
      await repo.save(
        buildQuota({ fundId: second.id, date: JAN })
      )
      await repo.save(
        buildQuota({ fundId: second.id, date: MAR })
      )

      const result = await repo.findLatestByFundIds([
        first.id,
        second.id,
      ])

      const FUND_IDS = result.map((q) => q.fundId).sort()
      const EXPECTED_IDS = [first.id, second.id].sort()

      expect(FUND_IDS).toEqual(EXPECTED_IDS)
      expect(
        result.find((q) => q.fundId === first.id)?.date
      ).toEqual(FEB)
      expect(
        result.find((q) => q.fundId === second.id)?.date
      ).toEqual(MAR)
    })
  })

  describe("findAllDatesByFundId", () => {
    it("should return empty array when the fund has no quotas", async () => {
      const fund = await seedFund(db)

      const result = await repo.findAllDatesByFundId(fund.id)

      expect(result).toEqual([])
    })

    it("should return ISO dates ascending", async () => {
      const fund = await seedFund(db)
      await repo.save(buildQuota({ fundId: fund.id, date: FEB }))
      await repo.save(buildQuota({ fundId: fund.id, date: JAN }))

      const result = await repo.findAllDatesByFundId(fund.id)

      expect(result).toEqual(["2026-01-15", "2026-02-15"])
    })
  })

  describe("upsertMany", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.upsertMany([])

      expect(result).toEqual([])
    })

    it("should report INSERT for new records", async () => {
      const fund = await seedFund(db)

      const result = await repo.upsertMany([
        { fundId: fund.id, date: JAN, price: "10.00" },
        { fundId: fund.id, date: FEB, price: "11.00" },
      ])

      expect(result).toEqual([
        {
          fundId: fund.id,
          date: JAN,
          price: "10.00",
          action: "INSERT",
        },
        {
          fundId: fund.id,
          date: FEB,
          price: "11.00",
          action: "INSERT",
        },
      ])
    })

    it("should report UPDATE and overwrite the price for existing records", async () => {
      const fund = await seedFund(db)
      await repo.save(
        buildQuota({
          fundId: fund.id,
          date: JAN,
          price: QuotaPrice.create("10.00"),
        })
      )

      const result = await repo.upsertMany([
        { fundId: fund.id, date: JAN, price: "99.00" },
      ])

      expect(result[0].action).toBe("UPDATE")

      const stored = await repo.findByFundIdAndDate(fund.id, JAN)
      expect(stored!.price.value.toFixed(2)).toBe("99.00")
    })
  })

  describe("save", () => {
    it("should insert new quota and assign id", async () => {
      const fund = await seedFund(db)

      const saved = await repo.save(
        buildQuota({ fundId: fund.id })
      )

      expect(saved.id).toBeDefined()

      const rows = await repo.findAllByFundId(fund.id)
      expect(rows.length).toBe(1)
    })

    it("should update existing quota", async () => {
      const fund = await seedFund(db)
      const saved = await repo.save(
        buildQuota({
          fundId: fund.id,
          price: QuotaPrice.create("10.00"),
        })
      )

      const updated = await repo.save(
        saved.updatePrice(QuotaPrice.create("12.34"))
      )

      expect(updated.id).toBe(saved.id)
      expect(updated.price.value.toFixed(2)).toBe("12.34")
    })

    it("should throw NotFoundError when updating non-existent quota", async () => {
      const fund = await seedFund(db)
      const ghost = Quota.create(
        {
          fundId: fund.id,
          date: JAN,
          price: QuotaPrice.create("10.00"),
        },
        MISSING_ID
      )

      await expect(repo.save(ghost)).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe("delete", () => {
    it("should delete quota by id", async () => {
      const fund = await seedFund(db)
      const saved = await repo.save(
        buildQuota({ fundId: fund.id })
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
