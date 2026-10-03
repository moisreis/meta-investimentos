import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"

import { Portfolio } from "@/domain/portfolio/entities/portfolio.entity"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
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
import { buildPortfolio } from "__tests__/__setup__/_factories.setup"
import {
  seedPortfolio,
  seedUser,
} from "__tests__/__setup__/_seeds.setup"

const MISSING_ID = EntityId.create(
  "00000000-0000-0000-0000-000000000000"
)

describe("infrastructure/portfolio/repositories/portfolio.repository", () => {
  let repo: PortfolioRepository
  let db: ReturnType<typeof getTestDb>

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new PortfolioRepository(db)
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("findById", () => {
    it("should return null when portfolio does not exist", async () => {
      const result = await repo.findById(MISSING_ID)

      expect(result).toBeNull()
    })

    it("should return portfolio when found by id", async () => {
      const seeded = await seedPortfolio(db, {
        name: "Carteira Alfa",
      })

      const result = await repo.findById(seeded.id)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(seeded.id)
      expect(result!.name).toBe("Carteira Alfa")
      expect(result!.version).toBe(0)
    })
  })

  describe("findAllByUserId", () => {
    it("should return empty array when the user has no portfolios", async () => {
      const owner = await seedUser(db)

      const result = await repo.findAllByUserId(owner.id)

      expect(result).toEqual([])
    })

    it("should return only the portfolios of the given user", async () => {
      const owner = await seedUser(db)
      await seedPortfolio(db, { userId: owner.id, name: "A" })
      await seedPortfolio(db, { userId: owner.id, name: "B" })
      await seedPortfolio(db, { name: "C" })

      const result = await repo.findAllByUserId(owner.id)

      expect(result.map((p) => p.name).sort()).toEqual([
        "A",
        "B",
      ])
    })
  })

  describe("findAllByIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByIds([])

      expect(result).toEqual([])
    })

    it("should return matching portfolios by ids", async () => {
      const first = await seedPortfolio(db, { name: "A" })
      const second = await seedPortfolio(db, { name: "B" })

      const result = await repo.findAllByIds([
        first.id,
        second.id,
      ])

      expect(result.length).toBe(2)
    })

    it("should only return existing ids", async () => {
      const first = await seedPortfolio(db)

      const result = await repo.findAllByIds([
        first.id,
        MISSING_ID,
      ])

      expect(result.length).toBe(1)
    })
  })

  describe("findAll", () => {
    it("should return empty array when no portfolios exist", async () => {
      const result = await repo.findAll()

      expect(result).toEqual([])
    })

    it("should return all portfolios ordered by createdAt", async () => {
      await seedPortfolio(db, {
        name: "B",
        createdAt: new Date("2026-02-01T00:00:00.000Z"),
      })
      await seedPortfolio(db, {
        name: "A",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      })

      const result = await repo.findAll()

      expect(result.map((p) => p.name)).toEqual(["A", "B"])
    })

    it("should support pagination with limit and offset", async () => {
      await seedPortfolio(db, {
        name: "A",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      })
      await seedPortfolio(db, {
        name: "B",
        createdAt: new Date("2026-02-01T00:00:00.000Z"),
      })
      await seedPortfolio(db, {
        name: "C",
        createdAt: new Date("2026-03-01T00:00:00.000Z"),
      })

      const page1 = await repo.findAll({ limit: 2, offset: 0 })
      expect(page1.map((p) => p.name)).toEqual(["A", "B"])

      const page2 = await repo.findAll({ limit: 2, offset: 2 })
      expect(page2.map((p) => p.name)).toEqual(["C"])
    })
  })

  describe("save", () => {
    it("should insert new portfolio and assign id", async () => {
      const owner = await seedUser(db)

      const saved = await repo.save(
        buildPortfolio({ userId: owner.id, name: "Nova" })
      )

      expect(saved.id).toBeDefined()
      expect(saved.version).toBe(0)

      const rows = await repo.findAllByUserId(owner.id)
      expect(rows.length).toBe(1)
    })

    it("should update existing portfolio and bump the version", async () => {
      const seeded = await seedPortfolio(db)

      const updated = await repo.save(
        seeded.updateAnnualInterestRate(
          SignedPercentage.create("12.75")
        )
      )

      expect(updated.id).toBe(seeded.id)
      expect(updated.annualInterestRate.value.toFixed(2)).toBe(
        "12.75"
      )
      expect(updated.version).toBe(1)
    })

    it("should throw ConcurrencyError when the version is stale", async () => {
      const seeded = await seedPortfolio(db)

      await repo.save(
        seeded.updateAnnualInterestRate(
          SignedPercentage.create("12.75")
        )
      )

      await expect(
        repo.save(
          seeded.updateAnnualInterestRate(
            SignedPercentage.create("14.00")
          )
        )
      ).rejects.toThrow(ConcurrencyError)
    })

    it("should throw NotFoundError when updating non-existent portfolio", async () => {
      const owner = await seedUser(db)
      const ghost = Portfolio.create(
        {
          acronym: "GHO",
          name: "Fantasma",
          userId: owner.id,
          annualInterestRate: SignedPercentage.create("10"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        MISSING_ID
      )

      await expect(repo.save(ghost)).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe("delete", () => {
    it("should delete portfolio by id", async () => {
      const seeded = await seedPortfolio(db)

      await repo.delete(seeded.id)

      expect(await repo.findById(seeded.id)).toBeNull()
    })

    it("should do nothing when deleting non-existent id", async () => {
      await expect(
        repo.delete(MISSING_ID)
      ).resolves.toBeUndefined()
    })
  })

  describe("deleteByIds", () => {
    it("should do nothing for empty array", async () => {
      await expect(repo.deleteByIds([])).resolves.toBeUndefined()
    })

    it("should delete multiple portfolios by ids", async () => {
      const first = await seedPortfolio(db)
      const second = await seedPortfolio(db)
      const kept = await seedPortfolio(db)

      await repo.deleteByIds([first.id, second.id])

      expect((await repo.findAll()).map((p) => p.id)).toEqual([
        kept.id,
      ])
    })
  })
})
