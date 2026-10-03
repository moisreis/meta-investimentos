import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"

import { PositionRepository } from "@infrastructure/position/repositories/position.repository"
import { EntityId } from "@/value-objects"
import { PositiveMoney } from "@/value-objects/positive-money.vo"
import { ConcurrencyError } from "@/errors/concurrency.error"
import { NotFoundError } from "@/errors/not-found.error"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import {
  buildPosition,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"
import {
  seedFund,
  seedPortfolio,
  seedPosition,
} from "__tests__/__setup__/_seeds.setup"

const MISSING_ID = EntityId.create(
  "00000000-0000-0000-0000-000000000000"
)

describe("infrastructure/position/repositories/position.repository", () => {
  let repo: PositionRepository
  let db: ReturnType<typeof getTestDb>

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new PositionRepository(db)
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("findById", () => {
    it("should return null when position does not exist", async () => {
      const result = await repo.findById(MISSING_ID)

      expect(result).toBeNull()
    })

    it("should return position when found by id", async () => {
      const seeded = await seedPosition(db)

      const result = await repo.findById(seeded.id)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(seeded.id)
      expect(result!.portfolioId).toBe(seeded.portfolioId)
      expect(result!.fundId).toBe(seeded.fundId)
      expect(result!.allocation.value.toFixed(2)).toBe("100.00")
    })
  })

  describe("findAllByPortfolioId", () => {
    it("should return empty array when the portfolio has none", async () => {
      const portfolio = await seedPortfolio(db)

      const result = await repo.findAllByPortfolioId(
        portfolio.id
      )

      expect(result).toEqual([])
    })

    it("should return only the positions of the portfolio", async () => {
      const portfolio = await seedPortfolio(db)
      const other = await seedPortfolio(db)
      const firstFund = await seedFund(db)
      const secondFund = await seedFund(db)
      await repo.save(
        buildPosition({
          portfolioId: portfolio.id,
          fundId: firstFund.id,
        })
      )
      await repo.save(
        buildPosition({
          portfolioId: portfolio.id,
          fundId: secondFund.id,
        })
      )
      await repo.save(
        buildPosition({
          portfolioId: other.id,
          fundId: firstFund.id,
        })
      )

      const result = await repo.findAllByPortfolioId(
        portfolio.id
      )

      expect(result.length).toBe(2)
    })
  })

  describe("findAllByPortfolioIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByPortfolioIds([])

      expect(result).toEqual([])
    })

    it("should return positions across multiple portfolios", async () => {
      const first = await seedPortfolio(db)
      const second = await seedPortfolio(db)
      const firstFund = await seedFund(db)
      const secondFund = await seedFund(db)
      await repo.save(
        buildPosition({
          portfolioId: first.id,
          fundId: firstFund.id,
        })
      )
      await repo.save(
        buildPosition({
          portfolioId: second.id,
          fundId: secondFund.id,
        })
      )

      const result = await repo.findAllByPortfolioIds([
        first.id,
        second.id,
      ])

      expect(result.length).toBe(2)
    })
  })

  describe("countByPortfolioIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.countByPortfolioIds([])

      expect(result).toEqual([])
    })

    it("should return the number of positions per portfolio", async () => {
      const first = await seedPortfolio(db)
      const second = await seedPortfolio(db)
      const firstFund = await seedFund(db)
      const secondFund = await seedFund(db)
      await repo.save(
        buildPosition({
          portfolioId: first.id,
          fundId: firstFund.id,
        })
      )
      await repo.save(
        buildPosition({
          portfolioId: first.id,
          fundId: secondFund.id,
        })
      )
      await repo.save(
        buildPosition({
          portfolioId: second.id,
          fundId: firstFund.id,
        })
      )

      const result = await repo.countByPortfolioIds([
        first.id,
        second.id,
      ])

      const COUNTS = new Map(
        result.map((entry) => [entry.portfolioId, entry.count])
      )

      expect(COUNTS.get(first.id)).toBe(2)
      expect(COUNTS.get(second.id)).toBe(1)
    })
  })

  describe("countByFundIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.countByFundIds([])

      expect(result).toEqual([])
    })

    it("should return the number of positions per fund", async () => {
      const fund = await seedFund(db)
      const firstPortfolio = await seedPortfolio(db)
      const secondPortfolio = await seedPortfolio(db)
      await repo.save(
        buildPosition({
          portfolioId: firstPortfolio.id,
          fundId: fund.id,
        })
      )
      await repo.save(
        buildPosition({
          portfolioId: secondPortfolio.id,
          fundId: fund.id,
        })
      )

      const result = await repo.countByFundIds([fund.id])

      expect(result).toEqual([{ fundId: fund.id, count: 2 }])
    })
  })

  describe("findAllByFundIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByFundIds([])

      expect(result).toEqual([])
    })

    it("should return positions across multiple funds", async () => {
      const portfolio = await seedPortfolio(db)
      const firstFund = await seedFund(db)
      const secondFund = await seedFund(db)
      await repo.save(
        buildPosition({
          portfolioId: portfolio.id,
          fundId: firstFund.id,
        })
      )
      await repo.save(
        buildPosition({
          portfolioId: portfolio.id,
          fundId: secondFund.id,
        })
      )

      const result = await repo.findAllByFundIds([
        firstFund.id,
        secondFund.id,
      ])

      expect(result.length).toBe(2)
    })
  })

  describe("findByPortfolioIdAndFundId", () => {
    it("should return null when no match exists", async () => {
      const portfolio = await seedPortfolio(db)
      const fund = await seedFund(db)

      const result = await repo.findByPortfolioIdAndFundId(
        portfolio.id,
        fund.id
      )

      expect(result).toBeNull()
    })

    it("should return position when both fields match", async () => {
      const seeded = await seedPosition(db)

      const result = await repo.findByPortfolioIdAndFundId(
        seeded.portfolioId,
        seeded.fundId
      )

      expect(result!.id).toBe(seeded.id)
    })
  })

  describe("save", () => {
    it("should insert new position and assign id", async () => {
      const portfolio = await seedPortfolio(db)
      const fund = await seedFund(db)

      const saved = await repo.save(
        buildPosition({
          portfolioId: portfolio.id,
          fundId: fund.id,
        })
      )

      expect(saved.id).toBeDefined()
      expect(saved.version).toBe(0)

      const rows = await repo.findAllByPortfolioId(portfolio.id)
      expect(rows.length).toBe(1)
    })

    it("should update existing position and bump the version", async () => {
      const seeded = await seedPosition(db)
      const now = new Date("2026-05-10T12:00:00.000Z")

      const updated = await repo.save(
        seeded.setInitialBalance(
          PositiveMoney.create("2500.00"),
          new Date("2026-05-01T00:00:00.000Z"),
          now
        )
      )

      expect(updated.id).toBe(seeded.id)
      expect(updated.initialBalance!.value.toFixed(2)).toBe(
        "2500.00"
      )
      expect(updated.version).toBe(1)
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(
        seeded.updatedAt.getTime()
      )
    })

    it("should persist a new allocation without changing the version", async () => {
      const seeded = await seedPosition(db)

      const updated = await repo.save(
        seeded.changeAllocation(
          buildSignedPercentage("70"),
          new Date("2026-05-10T12:00:00.000Z")
        )
      )

      expect(updated.allocation.value.toFixed(2)).toBe("70.00")
      expect(updated.version).toBe(1)
    })

    it("should throw ConcurrencyError when the version is stale", async () => {
      const seeded = await seedPosition(db)

      await repo.save(
        seeded.changeAllocation(buildSignedPercentage("60"))
      )

      await expect(
        repo.save(
          seeded.changeAllocation(buildSignedPercentage("61"))
        )
      ).rejects.toThrow(ConcurrencyError)
    })

    it("should throw NotFoundError when updating non-existent position", async () => {
      const portfolio = await seedPortfolio(db)
      const fund = await seedFund(db)
      const ghost = buildPosition({
        portfolioId: portfolio.id,
        fundId: fund.id,
        id: MISSING_ID,
      })

      await expect(repo.save(ghost)).rejects.toThrow(
        NotFoundError
      )
    })

    it("should reject a duplicate portfolio and fund pair", async () => {
      const portfolio = await seedPortfolio(db)
      const fund = await seedFund(db)
      await repo.save(
        buildPosition({
          portfolioId: portfolio.id,
          fundId: fund.id,
        })
      )

      await expect(
        repo.save(
          buildPosition({
            portfolioId: portfolio.id,
            fundId: fund.id,
          })
        )
      ).rejects.toThrow()
    })
  })

  describe("delete", () => {
    it("should delete position by id", async () => {
      const seeded = await seedPosition(db)

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
