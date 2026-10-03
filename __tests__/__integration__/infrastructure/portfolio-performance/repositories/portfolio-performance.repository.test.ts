import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"

import { PortfolioPerformance } from "@/domain/portfolio-performance/entities/portfolio-performance.entity"
import { PortfolioPerformanceRepository } from "@/infrastructure/portfolio-performance/repositories/portfolio-performance.repository"
import { EntityId } from "@/value-objects"
import { NotFoundError } from "@/errors/not-found.error"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import { buildPortfolioPerformance } from "__tests__/__setup__/_factories.setup"
import { seedPortfolio } from "__tests__/__setup__/_seeds.setup"

const MISSING_ID = EntityId.create(
  "00000000-0000-0000-0000-000000000000"
)
const JAN = new Date("2026-01-31T00:00:00.000Z")
const FEB = new Date("2026-02-28T00:00:00.000Z")
const MAR = new Date("2026-03-31T00:00:00.000Z")

describe("infrastructure/portfolio-performance/repositories/portfolio-performance.repository", () => {
  let repo: PortfolioPerformanceRepository
  let db: ReturnType<typeof getTestDb>

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new PortfolioPerformanceRepository(db)
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
      const portfolio = await seedPortfolio(db)
      const saved = await repo.save(
        buildPortfolioPerformance({
          portfolioId: portfolio.id,
        })
      )

      const result = await repo.findById(saved.id!)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(saved.id)
      expect(result!.portfolioId).toBe(portfolio.id)
      expect(result!.patrimony.value.toFixed(2)).toBe("50000.00")
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

    it("should return every record of the portfolio", async () => {
      const portfolio = await seedPortfolio(db)
      await repo.save(
        buildPortfolioPerformance({
          portfolioId: portfolio.id,
          date: JAN,
        })
      )
      await repo.save(
        buildPortfolioPerformance({
          portfolioId: portfolio.id,
          date: FEB,
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

    it("should return records across multiple portfolios", async () => {
      const first = await seedPortfolio(db)
      const second = await seedPortfolio(db)
      await repo.save(
        buildPortfolioPerformance({
          portfolioId: first.id,
        })
      )
      await repo.save(
        buildPortfolioPerformance({
          portfolioId: second.id,
        })
      )

      const result = await repo.findAllByPortfolioIds([
        first.id,
        second.id,
      ])

      expect(result.length).toBe(2)
    })
  })

  describe("findByPortfolioIdAndDate", () => {
    it("should return null when no record matches", async () => {
      const portfolio = await seedPortfolio(db)

      const result = await repo.findByPortfolioIdAndDate(
        portfolio.id,
        JAN
      )

      expect(result).toBeNull()
    })

    it("should return record when portfolio and date match", async () => {
      const portfolio = await seedPortfolio(db)
      await repo.save(
        buildPortfolioPerformance({
          portfolioId: portfolio.id,
          date: JAN,
        })
      )

      const result = await repo.findByPortfolioIdAndDate(
        portfolio.id,
        JAN
      )

      expect(result!.date).toEqual(JAN)
    })
  })

  describe("findLatestByPortfolioId", () => {
    it("should return null when the portfolio has no records", async () => {
      const portfolio = await seedPortfolio(db)

      const result = await repo.findLatestByPortfolioId(
        portfolio.id,
        MAR
      )

      expect(result).toBeNull()
    })

    it("should return the most recent record before the given date", async () => {
      const portfolio = await seedPortfolio(db)
      await repo.save(
        buildPortfolioPerformance({
          portfolioId: portfolio.id,
          date: JAN,
        })
      )
      await repo.save(
        buildPortfolioPerformance({
          portfolioId: portfolio.id,
          date: MAR,
        })
      )

      const result = await repo.findLatestByPortfolioId(
        portfolio.id,
        MAR
      )

      expect(result!.date).toEqual(JAN)
    })

    it("should return null when every record is after the given date", async () => {
      const portfolio = await seedPortfolio(db)
      await repo.save(
        buildPortfolioPerformance({
          portfolioId: portfolio.id,
          date: MAR,
        })
      )

      const result = await repo.findLatestByPortfolioId(
        portfolio.id,
        FEB
      )

      expect(result).toBeNull()
    })
  })

  describe("save", () => {
    it("should insert new record and assign id", async () => {
      const portfolio = await seedPortfolio(db)

      const saved = await repo.save(
        buildPortfolioPerformance({
          portfolioId: portfolio.id,
        })
      )

      expect(saved.id).toBeDefined()

      const rows = await repo.findAllByPortfolioId(portfolio.id)
      expect(rows.length).toBe(1)
    })

    it("should update existing record", async () => {
      const portfolio = await seedPortfolio(db)
      const saved = await repo.save(
        buildPortfolioPerformance({
          portfolioId: portfolio.id,
        })
      )

      const updated = await repo.save(
        PortfolioPerformance.create(
          {
            portfolioId: saved.portfolioId,
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
            target: saved.target,
            cumulativeTarget: saved.cumulativeTarget,
            inflationSpread: saved.inflationSpread,
            riskFreeSpread: saved.riskFreeSpread,
            marketSpread: saved.marketSpread,
            createdAt: saved.createdAt,
          },
          saved.id
        )
      )

      expect(updated.id).toBe(saved.id)
      expect((await repo.findById(saved.id!))!.id).toBe(saved.id)
    })

    it("should throw NotFoundError when updating non-existent record", async () => {
      const portfolio = await seedPortfolio(db)
      const ghost = buildPortfolioPerformance({
        portfolioId: portfolio.id,
        id: MISSING_ID,
      })

      await expect(repo.save(ghost)).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe("delete", () => {
    it("should delete record by id", async () => {
      const portfolio = await seedPortfolio(db)
      const saved = await repo.save(
        buildPortfolioPerformance({
          portfolioId: portfolio.id,
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
