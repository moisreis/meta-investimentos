import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"
import { eq } from "drizzle-orm"

import { Fund } from "@/domain/fund/entities/fund.entity"
import { FundRepository } from "@/infrastructure/fund/repositories/fund.repository"
import { fund } from "@/database/schemas"
import { EntityId } from "@/value-objects"
import { NotFoundError } from "@/errors/not-found.error"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import {
  buildFund,
  buildUniqueCnpj,
} from "__tests__/__setup__/_factories.setup"
import {
  seedBank,
  seedBenchmark,
  seedCategory,
  seedFund,
} from "__tests__/__setup__/_seeds.setup"

const MISSING_ID = EntityId.create(
  "00000000-0000-0000-0000-000000000000"
)

describe("infrastructure/fund/repositories/fund.repository", () => {
  let repo: FundRepository
  let db: ReturnType<typeof getTestDb>

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new FundRepository(db)
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("findById", () => {
    it("should return null when fund does not exist", async () => {
      const result = await repo.findById(MISSING_ID)

      expect(result).toBeNull()
    })

    it("should return fund when found by id", async () => {
      const seeded = await seedFund(db, { name: "Fundo Alfa" })

      const result = await repo.findById(seeded.id)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(seeded.id)
      expect(result!.name).toBe("Fundo Alfa")
      expect(result!.bankId).toBe(seeded.bankId)
    })
  })

  describe("findByCnpj", () => {
    it("should return null when fund does not exist", async () => {
      const result = await repo.findByCnpj(
        buildUniqueCnpj("999999999999")
      )

      expect(result).toBeNull()
    })

    it("should return fund when found by cnpj", async () => {
      const seeded = await seedFund(db)

      const result = await repo.findByCnpj(seeded.cnpj)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(seeded.id)
      expect(result!.cnpj.value).toBe(seeded.cnpj.value)
    })
  })

  describe("findAllByIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByIds([])

      expect(result).toEqual([])
    })

    it("should return matching funds by ids", async () => {
      const first = await seedFund(db, { name: "A" })
      const second = await seedFund(db, { name: "B" })
      await seedFund(db, { name: "C" })

      const result = await repo.findAllByIds([
        first.id,
        second.id,
      ])

      expect(result.map((f) => f.name).sort()).toEqual([
        "A",
        "B",
      ])
    })

    it("should only return existing ids", async () => {
      const first = await seedFund(db)

      const result = await repo.findAllByIds([
        first.id,
        MISSING_ID,
      ])

      expect(result.length).toBe(1)
      expect(result[0].id).toBe(first.id)
    })
  })

  describe("findAll", () => {
    it("should return empty array when no funds exist", async () => {
      const result = await repo.findAll()

      expect(result).toEqual([])
    })

    it("should return all funds ordered by name", async () => {
      await seedFund(db, { name: "Zeta" })
      await seedFund(db, { name: "Alpha" })
      await seedFund(db, { name: "Mid" })

      const result = await repo.findAll()

      expect(result.map((f) => f.name)).toEqual([
        "Alpha",
        "Mid",
        "Zeta",
      ])
    })

    it("should support pagination with limit and offset", async () => {
      await seedFund(db, { name: "A" })
      await seedFund(db, { name: "B" })
      await seedFund(db, { name: "C" })

      const page1 = await repo.findAll({ limit: 2, offset: 0 })
      expect(page1.map((f) => f.name)).toEqual(["A", "B"])

      const page2 = await repo.findAll({ limit: 2, offset: 2 })
      expect(page2.map((f) => f.name)).toEqual(["C"])
    })
  })

  describe("findAllByBankId", () => {
    it("should return empty array when the bank has no funds", async () => {
      const bank = await seedBank(db)

      const result = await repo.findAllByBankId(bank.id)

      expect(result).toEqual([])
    })

    it("should return funds linked to the bank", async () => {
      const bank = await seedBank(db)
      await seedFund(db, { bankId: bank.id, name: "A" })
      await seedFund(db, { name: "B" })

      const result = await repo.findAllByBankId(bank.id)

      expect(result.map((f) => f.name)).toEqual(["A"])
    })
  })

  describe("findAllByBenchmarkId", () => {
    it("should return empty array when the benchmark has no funds", async () => {
      const benchmark = await seedBenchmark(db)

      const result = await repo.findAllByBenchmarkId(
        benchmark.id
      )

      expect(result).toEqual([])
    })

    it("should return funds linked to the benchmark", async () => {
      const benchmark = await seedBenchmark(db)
      await seedFund(db, {
        benchmarkId: benchmark.id,
        name: "A",
      })

      const result = await repo.findAllByBenchmarkId(
        benchmark.id
      )

      expect(result.map((f) => f.name)).toEqual(["A"])
    })
  })

  describe("findAllByCategoryId", () => {
    it("should return empty array when the category has no funds", async () => {
      const category = await seedCategory(db)

      const result = await repo.findAllByCategoryId(category.id)

      expect(result).toEqual([])
    })

    it("should return funds linked to the category", async () => {
      const category = await seedCategory(db)
      await seedFund(db, { categoryId: category.id, name: "A" })
      await seedFund(db, { categoryId: category.id, name: "B" })

      const result = await repo.findAllByCategoryId(category.id)

      expect(result.map((f) => f.name).sort()).toEqual([
        "A",
        "B",
      ])
    })
  })

  describe("countByCategoryIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.countByCategoryIds([])

      expect(result).toEqual([])
    })

    it("should count funds grouped by category", async () => {
      const first = await seedCategory(db)
      const second = await seedCategory(db)
      await seedFund(db, { categoryId: first.id })
      await seedFund(db, { categoryId: first.id })
      await seedFund(db, { categoryId: second.id })

      const result = await repo.countByCategoryIds([
        first.id,
        second.id,
      ])

      const COUNTS = new Map(
        result.map((entry) => [entry.categoryId, entry.count])
      )

      expect(COUNTS.get(first.id)).toBe(2)
      expect(COUNTS.get(second.id)).toBe(1)
    })

    it("should omit categories without funds", async () => {
      const populated = await seedCategory(db)
      const empty = await seedCategory(db)
      await seedFund(db, { categoryId: populated.id })

      const result = await repo.countByCategoryIds([
        populated.id,
        empty.id,
      ])

      expect(result).toEqual([
        { categoryId: populated.id, count: 1 },
      ])
    })
  })

  describe("save", () => {
    it("should insert new fund and assign id", async () => {
      const bank = await seedBank(db)
      const seeded = await repo.save(
        buildFund({
          bankId: bank.id,
          benchmarkId: null,
          categoryId: null,
          cnpj: buildUniqueCnpj("123456789012"),
          name: "Novo Fundo",
        })
      )

      expect(seeded.id).toBeDefined()

      const rows = await db
        .select()
        .from(fund)
        .where(eq(fund.name, "Novo Fundo"))
        .execute()

      expect(rows.length).toBe(1)
      expect(rows[0].benchmarkId).toBeNull()
    })

    it("should update existing fund", async () => {
      const seeded = await seedFund(db, { name: "Nome Antigo" })

      const updated = await repo.save(
        seeded.update({ name: "Nome Novo" })
      )

      expect(updated.id).toBe(seeded.id)
      expect(updated.name).toBe("Nome Novo")

      const rows = await db
        .select()
        .from(fund)
        .where(eq(fund.id, seeded.id))
        .execute()

      expect(rows[0].name).toBe("Nome Novo")
    })

    it("should throw NotFoundError when updating non-existent fund", async () => {
      const bank = await seedBank(db)
      const ghost = Fund.create(
        {
          cnpj: buildUniqueCnpj("111111111111"),
          name: "Fantasma",
          bankId: bank.id,
        },
        MISSING_ID
      )

      await expect(repo.save(ghost)).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe("delete", () => {
    it("should delete fund by id", async () => {
      const seeded = await seedFund(db)

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

    it("should delete multiple funds by ids", async () => {
      const first = await seedFund(db)
      const second = await seedFund(db)
      const kept = await seedFund(db)

      await repo.deleteByIds([first.id, second.id])

      expect((await repo.findAll()).map((f) => f.id)).toEqual([
        kept.id,
      ])
    })
  })
})
