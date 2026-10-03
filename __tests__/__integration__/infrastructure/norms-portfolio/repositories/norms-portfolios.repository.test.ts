import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"

import { NormsPortfoliosRepository } from "@/infrastructure/norms-portfolio/repositories/norms-portfolios.repository"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import { buildNormsPortfolios } from "__tests__/__setup__/_factories.setup"
import {
  seedNorm,
  seedNormsPortfolios,
  seedPortfolio,
} from "__tests__/__setup__/_seeds.setup"

describe("infrastructure/norms-portfolio/repositories/norms-portfolios.repository", () => {
  let repo: NormsPortfoliosRepository
  let db: ReturnType<typeof getTestDb>

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new NormsPortfoliosRepository(db)
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("findByNormIdAndPortfolioId", () => {
    it("should return null when no link exists", async () => {
      const norm = await seedNorm(db)
      const portfolio = await seedPortfolio(db)

      const result = await repo.findByNormIdAndPortfolioId(
        norm.id,
        portfolio.id
      )

      expect(result).toBeNull()
    })

    it("should return the link when norm and portfolio match", async () => {
      const seeded = await seedNormsPortfolios(db)

      const result = await repo.findByNormIdAndPortfolioId(
        seeded.normId,
        seeded.portfolioId
      )

      expect(result).not.toBeNull()
      expect(result!.normId).toBe(seeded.normId)
      expect(result!.portfolioId).toBe(seeded.portfolioId)
      expect(result!.targetAllocation.value.toFixed(2)).toBe(
        "12.00"
      )
    })
  })

  describe("findAllByPortfolioId", () => {
    it("should return empty array when the portfolio has no links", async () => {
      const portfolio = await seedPortfolio(db)

      const result = await repo.findAllByPortfolioId(
        portfolio.id
      )

      expect(result).toEqual([])
    })

    it("should return every link for the portfolio", async () => {
      const portfolio = await seedPortfolio(db)
      const first = await seedNorm(db)
      const second = await seedNorm(db)
      await repo.save(
        buildNormsPortfolios({
          normId: first.id,
          portfolioId: portfolio.id,
        })
      )
      await repo.save(
        buildNormsPortfolios({
          normId: second.id,
          portfolioId: portfolio.id,
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

    it("should return links across multiple portfolios", async () => {
      const first = await seedPortfolio(db)
      const second = await seedPortfolio(db)
      await seedNormsPortfolios(db, { portfolioId: first.id })
      await seedNormsPortfolios(db, { portfolioId: second.id })

      const result = await repo.findAllByPortfolioIds([
        first.id,
        second.id,
      ])

      expect(result.length).toBe(2)
    })
  })

  describe("findAllByNormId", () => {
    it("should return empty array when the norm has no links", async () => {
      const norm = await seedNorm(db)

      const result = await repo.findAllByNormId(norm.id)

      expect(result).toEqual([])
    })

    it("should return every link for the norm", async () => {
      const norm = await seedNorm(db)
      const first = await seedPortfolio(db)
      const second = await seedPortfolio(db)
      await repo.save(
        buildNormsPortfolios({
          normId: norm.id,
          portfolioId: first.id,
        })
      )
      await repo.save(
        buildNormsPortfolios({
          normId: norm.id,
          portfolioId: second.id,
        })
      )

      const result = await repo.findAllByNormId(norm.id)

      expect(result.length).toBe(2)
    })
  })

  describe("save", () => {
    it("should insert a new link", async () => {
      const norm = await seedNorm(db)
      const portfolio = await seedPortfolio(db)

      const saved = await repo.save(
        buildNormsPortfolios({
          normId: norm.id,
          portfolioId: portfolio.id,
        })
      )

      expect(saved.normId).toBe(norm.id)
      expect(saved.portfolioId).toBe(portfolio.id)

      const rows = await repo.findAllByPortfolioId(portfolio.id)
      expect(rows.length).toBe(1)
    })

    it("should overwrite the allocations when the pair already exists", async () => {
      const seeded = await seedNormsPortfolios(db)

      const updated = await repo.save(
        buildNormsPortfolios({
          normId: seeded.normId,
          portfolioId: seeded.portfolioId,
          minAllocation: SignedPercentage.create("1"),
          maxAllocation: SignedPercentage.create("30"),
          targetAllocation: SignedPercentage.create("22"),
        })
      )

      expect(updated.minAllocation.value.toFixed(2)).toBe("1.00")
      expect(updated.maxAllocation.value.toFixed(2)).toBe(
        "30.00"
      )
      expect(updated.targetAllocation.value.toFixed(2)).toBe(
        "22.00"
      )

      const rows = await repo.findAllByPortfolioId(
        seeded.portfolioId
      )
      expect(rows.length).toBe(1)
    })
  })

  describe("delete", () => {
    it("should delete the link identified by norm and portfolio", async () => {
      const seeded = await seedNormsPortfolios(db)

      await repo.delete(seeded.normId, seeded.portfolioId)

      const result = await repo.findByNormIdAndPortfolioId(
        seeded.normId,
        seeded.portfolioId
      )

      expect(result).toBeNull()
    })

    it("should do nothing when the pair does not exist", async () => {
      const norm = await seedNorm(db)
      const portfolio = await seedPortfolio(db)

      await expect(
        repo.delete(norm.id, portfolio.id)
      ).resolves.toBeUndefined()
    })

    it("should not delete a link sharing only one side", async () => {
      const seeded = await seedNormsPortfolios(db)
      const other = await seedPortfolio(db)

      await repo.delete(seeded.normId, other.id)

      const result = await repo.findByNormIdAndPortfolioId(
        seeded.normId,
        seeded.portfolioId
      )

      expect(result).not.toBeNull()
    })
  })
})
