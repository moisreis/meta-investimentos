import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { UpdateCategoryUseCase } from "@/services/category/use-cases/update-category.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakeCategoryRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildCategory,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"
import {
  getFixedDate,
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

const ID = "00000000-0000-0000-0000-000000000013"
const CREATED_AT = new Date("2026-01-01T00:00:00.000Z")

describe("services/category/use-cases/update-category.use-case", () => {
  let categoryRepository: ReturnType<
    typeof createFakeCategoryRepository
  >

  beforeEach(() => {
    useFixedClock()
    categoryRepository = createFakeCategoryRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  describe("execute", () => {
    it("should persist the renamed category when the category exists", async () => {
      const saved = await categoryRepository.save(
        buildCategory({
          id: buildEntityId(ID),
          name: "Renda Fixa",
        })
      )
      const useCase = new UpdateCategoryUseCase(
        categoryRepository
      )

      const response = await useCase.execute({
        categoryId: saved.id!,
        name: "Renda Variável",
      })

      expect(response.id).toBe(ID)
      expect(response.name).toBe("Renda Variável")
    })

    it("should replace the stored row when the category exists", async () => {
      const saved = await categoryRepository.save(
        buildCategory({
          id: buildEntityId(ID),
          name: "Renda Fixa",
        })
      )
      const useCase = new UpdateCategoryUseCase(
        categoryRepository
      )

      await useCase.execute({
        categoryId: saved.id!,
        name: "Renda Variável",
      })

      const stored = await categoryRepository.findById(saved.id!)

      expect(stored?.name).toBe("Renda Variável")
      expect(await categoryRepository.findAll({})).toHaveLength(
        1
      )
    })

    it("should keep the creation timestamp when renaming a category", async () => {
      const saved = await categoryRepository.save(
        buildCategory({
          id: buildEntityId(ID),
          name: "Renda Fixa",
          createdAt: CREATED_AT,
          updatedAt: CREATED_AT,
        })
      )
      const useCase = new UpdateCategoryUseCase(
        categoryRepository
      )

      const response = await useCase.execute({
        categoryId: saved.id!,
        name: "Renda Variável",
      })

      expect(response.createdAt).toBe(CREATED_AT.toISOString())
      expect(response.updatedAt).toBe(
        getFixedDate().toISOString()
      )
    })

    it("should throw NotFoundError when the category does not exist", async () => {
      const useCase = new UpdateCategoryUseCase(
        categoryRepository
      )

      await expect(
        useCase.execute({
          categoryId: ID,
          name: "Renda Variável",
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw ValidationError when the new name is blank", async () => {
      const saved = await categoryRepository.save(
        buildCategory({
          id: buildEntityId(ID),
          name: "Renda Fixa",
        })
      )
      const useCase = new UpdateCategoryUseCase(
        categoryRepository
      )

      await expect(
        useCase.execute({ categoryId: saved.id!, name: "  " })
      ).rejects.toThrow(ValidationError)
    })

    it("should keep the previous name when the new name is blank", async () => {
      const saved = await categoryRepository.save(
        buildCategory({
          id: buildEntityId(ID),
          name: "Renda Fixa",
        })
      )
      const useCase = new UpdateCategoryUseCase(
        categoryRepository
      )

      await expect(
        useCase.execute({ categoryId: saved.id!, name: "" })
      ).rejects.toThrow(ValidationError)

      const stored = await categoryRepository.findById(saved.id!)

      expect(stored?.name).toBe("Renda Fixa")
    })
  })
})
