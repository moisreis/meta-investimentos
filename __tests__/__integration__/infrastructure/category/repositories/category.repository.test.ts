import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"
import { eq } from "drizzle-orm"

import { Category } from "@/domain/category/entities/category.entity"
import { CategoryRepository } from "@/infrastructure/category/repositories/category.repository"
import { category } from "@/database/schemas"
import { EntityId } from "@/value-objects"
import { NotFoundError } from "@/errors/not-found.error"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import { buildCategory } from "__tests__/__setup__/_factories.setup"

const MISSING_ID = EntityId.create(
  "00000000-0000-0000-0000-000000000000"
)

describe("infrastructure/category/repositories/category.repository", () => {
  let repo: CategoryRepository
  let db: ReturnType<typeof getTestDb>

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new CategoryRepository(db)
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("findById", () => {
    it("should return null when category does not exist", async () => {
      const result = await repo.findById(MISSING_ID)

      expect(result).toBeNull()
    })

    it("should return category when found by id", async () => {
      const saved = await repo.save(
        buildCategory({ name: "Renda Fixa" })
      )

      const result = await repo.findById(saved.id!)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(saved.id)
      expect(result!.name).toBe("Renda Fixa")
    })
  })

  describe("findByName", () => {
    it("should return null when category does not exist", async () => {
      const result = await repo.findByName("Inexistente")

      expect(result).toBeNull()
    })

    it("should return category when found by name", async () => {
      await repo.save(buildCategory({ name: "Renda Variável" }))

      const result = await repo.findByName("Renda Variável")

      expect(result).not.toBeNull()
      expect(result!.name).toBe("Renda Variável")
    })
  })

  describe("findAll", () => {
    it("should return empty array when no categories exist", async () => {
      const result = await repo.findAll()

      expect(result).toEqual([])
    })

    it("should return all categories ordered by name", async () => {
      await repo.save(buildCategory({ name: "Renda Variável" }))
      await repo.save(buildCategory({ name: "Renda Fixa" }))
      await repo.save(buildCategory({ name: "Multimercado" }))

      const result = await repo.findAll()

      expect(result.map((c) => c.name)).toEqual([
        "Multimercado",
        "Renda Fixa",
        "Renda Variável",
      ])
    })

    it("should support pagination with limit and offset", async () => {
      await repo.save(buildCategory({ name: "A" }))
      await repo.save(buildCategory({ name: "B" }))
      await repo.save(buildCategory({ name: "C" }))

      const page1 = await repo.findAll({ limit: 2, offset: 0 })
      expect(page1.map((c) => c.name)).toEqual(["A", "B"])

      const page2 = await repo.findAll({ limit: 2, offset: 2 })
      expect(page2.map((c) => c.name)).toEqual(["C"])
    })
  })

  describe("findAllByIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByIds([])

      expect(result).toEqual([])
    })

    it("should return matching categories by ids", async () => {
      const first = await repo.save(buildCategory({ name: "A" }))
      const second = await repo.save(
        buildCategory({ name: "B" })
      )
      await repo.save(buildCategory({ name: "C" }))

      const result = await repo.findAllByIds([
        first.id!,
        second.id!,
      ])

      expect(result.map((c) => c.name).sort()).toEqual([
        "A",
        "B",
      ])
    })

    it("should only return existing ids", async () => {
      const first = await repo.save(buildCategory({ name: "A" }))

      const result = await repo.findAllByIds([
        first.id!,
        MISSING_ID,
      ])

      expect(result.length).toBe(1)
      expect(result[0].id).toBe(first.id)
    })
  })

  describe("save", () => {
    it("should insert new category and assign id", async () => {
      const saved = await repo.save(
        buildCategory({ name: "Nova Categoria" })
      )

      expect(saved.id).toBeDefined()
      expect(saved.name).toBe("Nova Categoria")

      const rows = await db
        .select()
        .from(category)
        .where(eq(category.name, "Nova Categoria"))
        .execute()

      expect(rows.length).toBe(1)
    })

    it("should update existing category", async () => {
      const saved = await repo.save(
        buildCategory({ name: "Nome Original" })
      )

      const updated = await repo.save(saved.rename("Novo Nome"))

      expect(updated.id).toBe(saved.id)
      expect(updated.name).toBe("Novo Nome")

      const rows = await db
        .select()
        .from(category)
        .where(eq(category.name, "Novo Nome"))
        .execute()

      expect(rows.length).toBe(1)
    })

    it("should throw NotFoundError when updating non-existent category", async () => {
      const ghost = Category.create(
        { name: "Fantasma" },
        MISSING_ID
      )

      await expect(repo.save(ghost)).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe("delete", () => {
    it("should delete category by id", async () => {
      const saved = await repo.save(
        buildCategory({ name: "Deletar" })
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

  describe("deleteByIds", () => {
    it("should delete multiple categories by ids", async () => {
      const first = await repo.save(buildCategory({ name: "A" }))
      const second = await repo.save(
        buildCategory({ name: "B" })
      )
      await repo.save(buildCategory({ name: "C" }))

      await repo.deleteByIds([first.id!, second.id!])

      const remaining = await repo.findAll()

      expect(remaining.map((c) => c.name)).toEqual(["C"])
    })

    it("should do nothing for empty array", async () => {
      await expect(repo.deleteByIds([])).resolves.toBeUndefined()
    })
  })
})
