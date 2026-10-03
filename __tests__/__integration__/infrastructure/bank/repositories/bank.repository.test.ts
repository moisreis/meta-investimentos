import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"
import { Bank } from "@/domain/bank/entities/bank.entity"
import { BankRepository } from "@/infrastructure/bank/repositories/bank.repository"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import { buildBank } from "__tests__/__setup__/_factories.setup"
import { EntityId } from "@/value-objects"
import { NotFoundError } from "@/errors/not-found.error"
import { eq } from "drizzle-orm"
import { bank } from "@/database/schemas"

describe("infrastructure/bank/repositories/bank.repository", () => {
  let repo: BankRepository
  let db: ReturnType<typeof getTestDb>

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new BankRepository(db)
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("findById", () => {
    it("should return null when bank does not exist", async () => {
      const result = await repo.findById(
        EntityId.create("00000000-0000-0000-0000-000000000000")
      )
      expect(result).toBeNull()
    })

    it("should return bank when found by id", async () => {
      const bankEntity = buildBank({
        code: "001",
        name: "Banco do Brasil",
      })
      const saved = await repo.save(bankEntity)

      const result = await repo.findById(saved.id!)
      expect(result).not.toBeNull()
      expect(result!.id).toBe(saved.id)
      expect(result!.code).toBe("001")
      expect(result!.name).toBe("Banco do Brasil")
    })
  })

  describe("findByCode", () => {
    it("should return null when bank does not exist", async () => {
      const result = await repo.findByCode("999")
      expect(result).toBeNull()
    })

    it("should return bank when found by code", async () => {
      const bankEntity = buildBank({
        code: "002",
        name: "Banco Bradesco",
      })
      await repo.save(bankEntity)

      const result = await repo.findByCode("002")
      expect(result).not.toBeNull()
      expect(result!.code).toBe("002")
      expect(result!.name).toBe("Banco Bradesco")
    })
  })

  describe("findAll", () => {
    it("should return empty array when no banks exist", async () => {
      const result = await repo.findAll()
      expect(result).toEqual([])
    })

    it("should return all banks ordered by code", async () => {
      await repo.save(
        buildBank({ code: "237", name: "Banco Bradesco" })
      )
      await repo.save(
        buildBank({ code: "001", name: "Banco do Brasil" })
      )
      await repo.save(
        buildBank({ code: "341", name: "Itaú Unibanco" })
      )

      const result = await repo.findAll()
      expect(result.length).toBe(3)
      expect(result[0].code).toBe("001")
      expect(result[1].code).toBe("237")
      expect(result[2].code).toBe("341")
    })

    it("should support pagination with limit and offset", async () => {
      await repo.save(
        buildBank({ code: "001", name: "Banco do Brasil" })
      )
      await repo.save(
        buildBank({ code: "237", name: "Banco Bradesco" })
      )
      await repo.save(
        buildBank({ code: "341", name: "Itaú Unibanco" })
      )

      const page1 = await repo.findAll({ limit: 2, offset: 0 })
      expect(page1.length).toBe(2)
      expect(page1[0].code).toBe("001")
      expect(page1[1].code).toBe("237")

      const page2 = await repo.findAll({ limit: 2, offset: 2 })
      expect(page2.length).toBe(1)
      expect(page2[0].code).toBe("341")
    })
  })

  describe("findAllByIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByIds([])
      expect(result).toEqual([])
    })

    it("should return matching banks by ids", async () => {
      const b1 = await repo.save(
        buildBank({ code: "003", name: "Banco 1" })
      )
      const b2 = await repo.save(
        buildBank({ code: "004", name: "Banco 2" })
      )
      await repo.save(
        buildBank({ code: "005", name: "Banco 3" })
      )

      const result = await repo.findAllByIds([b1.id!, b2.id!])
      expect(result.length).toBe(2)
      expect(result.map((b) => b.code).sort()).toEqual([
        "003",
        "004",
      ])
    })

    it("should only return existing ids", async () => {
      const b1 = await repo.save(
        buildBank({ code: "006", name: "Banco 1" })
      )

      const result = await repo.findAllByIds([
        b1.id!,
        EntityId.create("00000000-0000-0000-0000-000000000000"),
      ])
      expect(result.length).toBe(1)
      expect(result[0].id).toBe(b1.id)
    })
  })

  describe("save", () => {
    it("should insert new bank and assign id", async () => {
      const bankEntity = buildBank({
        code: "999",
        name: "Test Bank",
      })
      const saved = await repo.save(bankEntity)

      expect(saved.id).toBeDefined()
      expect(saved.code).toBe("999")
      expect(saved.name).toBe("Test Bank")

      // Verify in database
      const rows = await db
        .select()
        .from(bank)
        .where(eq(bank.code, "999"))
        .execute()
      expect(rows.length).toBe(1)
    })

    it("should update existing bank", async () => {
      const bankEntity = await repo.save(
        buildBank({ code: "007", name: "Banco Original" })
      )
      const originalId = bankEntity.id

      const updatedEntity = bankEntity.changeCode("008")
      const updated = await repo.save(updatedEntity)

      expect(updated.id).toBe(originalId)
      expect(updated.code).toBe("008")

      // Verify in database
      const rows = await db
        .select()
        .from(bank)
        .where(eq(bank.code, "008"))
        .execute()
      expect(rows.length).toBe(1)
      const oldRows = await db
        .select()
        .from(bank)
        .where(eq(bank.code, "007"))
        .execute()
      expect(oldRows.length).toBe(0)
    })

    it("should throw NotFoundError when updating non-existent bank", async () => {
      // Create a new entity with a non-existent ID by using changeCode/rename which preserves id
      const withId = Bank.create(
        {
          code: "999",
          name: "Test Bank",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        EntityId.create("00000000-0000-0000-0000-000000000000")
      )

      await expect(repo.save(withId)).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe("delete", () => {
    it("should delete bank by id", async () => {
      const bankEntity = await repo.save(
        buildBank({ code: "009", name: "Banco para Deletar" })
      )

      await repo.delete(bankEntity.id!)

      const result = await repo.findById(bankEntity.id!)
      expect(result).toBeNull()
    })

    it("should do nothing when deleting non-existent id", async () => {
      await expect(
        repo.delete(
          EntityId.create("00000000-0000-0000-0000-000000000000")
        )
      ).resolves.toBeUndefined()
    })
  })

  describe("deleteByIds", () => {
    it("should delete multiple banks by ids", async () => {
      const b1 = await repo.save(
        buildBank({ code: "010", name: "Banco 1" })
      )
      const b2 = await repo.save(
        buildBank({ code: "011", name: "Banco 2" })
      )
      await repo.save(
        buildBank({ code: "012", name: "Banco 3" })
      )

      await repo.deleteByIds([b1.id!, b2.id!])

      const remaining = await repo.findAll()
      expect(remaining.length).toBe(1)
      expect(remaining[0].code).toBe("012")
    })

    it("should do nothing for empty array", async () => {
      await expect(repo.deleteByIds([])).resolves.toBeUndefined()
    })
  })

  describe("unique constraint", () => {
    it("should enforce unique code constraint", async () => {
      await repo.save(
        buildBank({ code: "013", name: "Banco do Brasil" })
      )

      await expect(
        repo.save(
          buildBank({ code: "013", name: "Outro Banco" })
        )
      ).rejects.toThrow()
    })
  })
})
