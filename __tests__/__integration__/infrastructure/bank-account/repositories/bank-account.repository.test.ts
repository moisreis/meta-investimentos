import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"

import { BankAccount } from "@/domain/bank-account/entities/bank-account.entity"
import { BankAccountRepository } from "@/infrastructure/bank-account/repositories/bank-account.repository"
import { EntityId } from "@/value-objects"
import { NotFoundError } from "@/errors/not-found.error"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import { buildBankAccount } from "__tests__/__setup__/_factories.setup"
import {
  seedBank,
  seedBankAccount,
  seedPortfolio,
} from "__tests__/__setup__/_seeds.setup"

const MISSING_ID = EntityId.create(
  "00000000-0000-0000-0000-000000000000"
)

describe("infrastructure/bank-account/repositories/bank-account.repository", () => {
  let repo: BankAccountRepository
  let db: ReturnType<typeof getTestDb>

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new BankAccountRepository(db)
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("findById", () => {
    it("should return null when bank account does not exist", async () => {
      const result = await repo.findById(MISSING_ID)

      expect(result).toBeNull()
    })

    it("should return bank account when found by id", async () => {
      const seeded = await seedBankAccount(db, {
        agency: "4321",
      })

      const result = await repo.findById(seeded.id)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(seeded.id)
      expect(result!.agency).toBe("4321")
      expect(result!.portfolioId).toBe(seeded.portfolioId)
    })
  })

  describe("findAll", () => {
    it("should return empty array when no bank accounts exist", async () => {
      const result = await repo.findAll()

      expect(result).toEqual([])
    })

    it("should return all bank accounts ordered by createdAt", async () => {
      await seedBankAccount(db, {
        agency: "B",
        createdAt: new Date("2026-02-01T00:00:00.000Z"),
      })
      await seedBankAccount(db, {
        agency: "A",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      })

      const result = await repo.findAll()

      expect(result.map((a) => a.agency)).toEqual(["A", "B"])
    })

    it("should support pagination with limit and offset", async () => {
      await seedBankAccount(db, {
        agency: "A",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      })
      await seedBankAccount(db, {
        agency: "B",
        createdAt: new Date("2026-02-01T00:00:00.000Z"),
      })
      await seedBankAccount(db, {
        agency: "C",
        createdAt: new Date("2026-03-01T00:00:00.000Z"),
      })

      const page1 = await repo.findAll({ limit: 2, offset: 0 })
      expect(page1.map((a) => a.agency)).toEqual(["A", "B"])

      const page2 = await repo.findAll({ limit: 2, offset: 2 })
      expect(page2.map((a) => a.agency)).toEqual(["C"])
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

    it("should return bank accounts of the portfolio", async () => {
      const portfolio = await seedPortfolio(db)
      await seedBankAccount(db, {
        portfolioId: portfolio.id,
        agency: "A",
      })
      await seedBankAccount(db, { agency: "B" })

      const result = await repo.findAllByPortfolioId(
        portfolio.id
      )

      expect(result.map((a) => a.agency)).toEqual(["A"])
    })
  })

  describe("findAllByPortfolioIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByPortfolioIds([])

      expect(result).toEqual([])
    })

    it("should return bank accounts across portfolios", async () => {
      const first = await seedPortfolio(db)
      const second = await seedPortfolio(db)
      await seedBankAccount(db, { portfolioId: first.id })
      await seedBankAccount(db, { portfolioId: second.id })

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

    it("should count bank accounts grouped by portfolio", async () => {
      const first = await seedPortfolio(db)
      const second = await seedPortfolio(db)
      await seedBankAccount(db, { portfolioId: first.id })
      await seedBankAccount(db, { portfolioId: first.id })
      await seedBankAccount(db, { portfolioId: second.id })

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

  describe("findAllByBankId", () => {
    it("should return empty array when the bank has none", async () => {
      const bank = await seedBank(db)

      const result = await repo.findAllByBankId(bank.id)

      expect(result).toEqual([])
    })

    it("should return bank accounts of the bank", async () => {
      const bank = await seedBank(db)
      await seedBankAccount(db, { bankId: bank.id, agency: "A" })
      await seedBankAccount(db, { agency: "B" })

      const result = await repo.findAllByBankId(bank.id)

      expect(result.map((a) => a.agency)).toEqual(["A"])
    })
  })

  describe("findAllByBankIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByBankIds([])

      expect(result).toEqual([])
    })

    it("should return bank accounts across banks", async () => {
      const first = await seedBank(db)
      const second = await seedBank(db)
      await seedBankAccount(db, { bankId: first.id })
      await seedBankAccount(db, { bankId: second.id })

      const result = await repo.findAllByBankIds([
        first.id,
        second.id,
      ])

      expect(result.length).toBe(2)
    })
  })

  describe("countByBankIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.countByBankIds([])

      expect(result).toEqual([])
    })

    it("should count bank accounts grouped by bank", async () => {
      const first = await seedBank(db)
      const second = await seedBank(db)
      await seedBankAccount(db, { bankId: first.id })
      await seedBankAccount(db, { bankId: first.id })
      await seedBankAccount(db, { bankId: second.id })

      const result = await repo.countByBankIds([
        first.id,
        second.id,
      ])

      const COUNTS = new Map(
        result.map((entry) => [entry.bankId, entry.count])
      )

      expect(COUNTS.get(first.id)).toBe(2)
      expect(COUNTS.get(second.id)).toBe(1)
    })
  })

  describe("save", () => {
    it("should insert new bank account and assign id", async () => {
      const portfolio = await seedPortfolio(db)
      const bank = await seedBank(db)

      const saved = await repo.save(
        buildBankAccount({
          portfolioId: portfolio.id,
          bankId: bank.id,
        })
      )

      expect(saved.id).toBeDefined()

      const rows = await repo.findAllByPortfolioId(portfolio.id)
      expect(rows.length).toBe(1)
    })

    it("should update existing bank account", async () => {
      const seeded = await seedBankAccount(db, {
        agency: "0001",
      })

      const updated = await repo.save(
        seeded.update({ agency: "9999" })
      )

      expect(updated.id).toBe(seeded.id)
      expect(updated.agency).toBe("9999")

      const rows = await repo.findAllByPortfolioId(
        seeded.portfolioId
      )
      expect(rows[0].agency).toBe("9999")
    })

    it("should throw NotFoundError when updating non-existent bank account", async () => {
      const portfolio = await seedPortfolio(db)
      const bank = await seedBank(db)
      const ghost = BankAccount.create(
        {
          portfolioId: portfolio.id,
          bankId: bank.id,
          agency: "0000",
          accountNumber: "00000-0",
        },
        MISSING_ID
      )

      await expect(repo.save(ghost)).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe("delete", () => {
    it("should delete bank account by id", async () => {
      const seeded = await seedBankAccount(db)

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
