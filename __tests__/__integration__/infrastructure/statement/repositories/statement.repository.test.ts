import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"

import { Statement } from "@/domain/statement/entities/statement.entity"
import { StatementRepository } from "@/infrastructure/statement/repositories/statement.repository"
import { EntityId } from "@/value-objects"
import { NotFoundError } from "@/errors/not-found.error"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import { buildStatement } from "__tests__/__setup__/_factories.setup"
import {
  seedPortfolio,
  seedUser,
} from "__tests__/__setup__/_seeds.setup"

const MISSING_ID = EntityId.create(
  "00000000-0000-0000-0000-000000000000"
)

describe("infrastructure/statement/repositories/statement.repository", () => {
  let repo: StatementRepository
  let db: ReturnType<typeof getTestDb>

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new StatementRepository(db)
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("findById", () => {
    it("should return null when statement does not exist", async () => {
      const result = await repo.findById(MISSING_ID)

      expect(result).toBeNull()
    })

    it("should return statement when found by id", async () => {
      const portfolio = await seedPortfolio(db)
      const saved = await repo.save(
        buildStatement({
          portfolioId: portfolio.id,
          generatedByUserId: null,
        })
      )

      const result = await repo.findById(saved.id!)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(saved.id)
      expect(result!.portfolioId).toBe(portfolio.id)
      expect(result!.generatedByUserId).toBeNull()
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

    it("should return only the statements of the portfolio", async () => {
      const portfolio = await seedPortfolio(db)
      const other = await seedPortfolio(db)
      await repo.save(
        buildStatement({
          portfolioId: portfolio.id,
          generatedByUserId: null,
        })
      )
      await repo.save(
        buildStatement({
          portfolioId: other.id,
          generatedByUserId: null,
        })
      )

      const result = await repo.findAllByPortfolioId(
        portfolio.id
      )

      expect(result.length).toBe(1)
    })

    it("should not return statements with a null portfolio", async () => {
      const portfolio = await seedPortfolio(db)
      await repo.save(
        buildStatement({
          portfolioId: portfolio.id,
          generatedByUserId: null,
        })
      )
      await repo.save(
        buildStatement({
          portfolioId: null,
          generatedByUserId: null,
        })
      )

      const result = await repo.findAllByPortfolioId(
        portfolio.id
      )

      expect(result.length).toBe(1)
    })
  })

  describe("findAllByPortfolioIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByPortfolioIds([])

      expect(result).toEqual([])
    })

    it("should return statements across multiple portfolios", async () => {
      const first = await seedPortfolio(db)
      const second = await seedPortfolio(db)
      await repo.save(
        buildStatement({
          portfolioId: first.id,
          generatedByUserId: null,
        })
      )
      await repo.save(
        buildStatement({
          portfolioId: second.id,
          generatedByUserId: null,
        })
      )

      const result = await repo.findAllByPortfolioIds([
        first.id,
        second.id,
      ])

      expect(result.length).toBe(2)
    })
  })

  describe("findAllByGeneratedByUserId", () => {
    it("should return empty array when the user generated none", async () => {
      const user = await seedUser(db)

      const result = await repo.findAllByGeneratedByUserId(
        user.id
      )

      expect(result).toEqual([])
    })

    it("should return only the statements of the given user", async () => {
      const portfolio = await seedPortfolio(db)
      const user = await seedUser(db)
      const other = await seedUser(db)
      await repo.save(
        buildStatement({
          portfolioId: portfolio.id,
          generatedByUserId: user.id,
        })
      )
      await repo.save(
        buildStatement({
          portfolioId: null,
          generatedByUserId: user.id,
        })
      )
      await repo.save(
        buildStatement({
          portfolioId: null,
          generatedByUserId: other.id,
        })
      )

      const result = await repo.findAllByGeneratedByUserId(
        user.id
      )

      expect(result.length).toBe(2)
      expect(
        result.every((row) => row.generatedByUserId === user.id)
      ).toBe(true)
    })
  })

  describe("findAllByGeneratedByUserIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByGeneratedByUserIds([])

      expect(result).toEqual([])
    })

    it("should return statements across multiple users", async () => {
      const portfolio = await seedPortfolio(db)
      const first = await seedUser(db)
      const second = await seedUser(db)
      await repo.save(
        buildStatement({
          portfolioId: portfolio.id,
          generatedByUserId: first.id,
        })
      )
      await repo.save(
        buildStatement({
          portfolioId: null,
          generatedByUserId: first.id,
        })
      )
      await repo.save(
        buildStatement({
          portfolioId: null,
          generatedByUserId: second.id,
        })
      )

      const result = await repo.findAllByGeneratedByUserIds([
        first.id,
        second.id,
      ])

      const GENERATORS = new Set(
        result.map((row) => row.generatedByUserId)
      )

      expect(result.length).toBe(3)
      expect(GENERATORS.has(first.id)).toBe(true)
      expect(GENERATORS.has(second.id)).toBe(true)
    })
  })

  describe("save", () => {
    it("should insert new statement and assign id", async () => {
      const portfolio = await seedPortfolio(db)

      const saved = await repo.save(
        buildStatement({
          portfolioId: portfolio.id,
          generatedByUserId: null,
        })
      )

      expect(saved.id).toBeDefined()

      const rows = await repo.findAllByPortfolioId(portfolio.id)
      expect(rows.length).toBe(1)
    })

    it("should update existing statement", async () => {
      const portfolio = await seedPortfolio(db)
      const saved = await repo.save(
        buildStatement({
          portfolioId: portfolio.id,
          generatedByUserId: null,
        })
      )

      const updated = await repo.save(
        Statement.create(
          {
            portfolioId: saved.portfolioId,
            periodStart: saved.periodStart,
            periodEnd: saved.periodEnd,
            fileUrl: "https://cdn.test/novo.pdf",
            generatedByUserId: saved.generatedByUserId,
            createdAt: saved.createdAt,
          },
          saved.id
        )
      )

      expect(updated.id).toBe(saved.id)
      expect(updated.fileUrl).toBe("https://cdn.test/novo.pdf")

      const rows = await repo.findAllByPortfolioId(portfolio.id)
      expect(rows[0].fileUrl).toBe("https://cdn.test/novo.pdf")
    })

    it("should throw NotFoundError when updating non-existent statement", async () => {
      const portfolio = await seedPortfolio(db)
      const ghost = Statement.create(
        {
          portfolioId: portfolio.id,
          periodStart: new Date("2026-01-01"),
          periodEnd: new Date("2026-01-31"),
          fileUrl: "https://cdn.test/ghost.pdf",
          generatedByUserId: null,
        },
        MISSING_ID
      )

      await expect(repo.save(ghost)).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe("delete", () => {
    it("should delete statement by id", async () => {
      const portfolio = await seedPortfolio(db)
      const saved = await repo.save(
        buildStatement({
          portfolioId: portfolio.id,
          generatedByUserId: null,
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
