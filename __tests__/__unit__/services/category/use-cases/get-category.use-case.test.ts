import { describe, it, expect, beforeEach } from "vitest"

import { GetCategoryUseCase } from "@/services/category/use-cases/get-category.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakeCategoryRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildCategory,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000012"

describe("services/category/use-cases/get-category.use-case", () => {
  let categoryRepository: ReturnType<
    typeof createFakeCategoryRepository
  >

  beforeEach(() => {
    categoryRepository = createFakeCategoryRepository()
  })

  describe("execute", () => {
    it("should return the category when it exists", async () => {
      const saved = await categoryRepository.save(
        buildCategory({
          id: buildEntityId(ID),
          name: "Renda Fixa",
        })
      )
      const useCase = new GetCategoryUseCase(categoryRepository)

      const response = await useCase.execute({
        categoryId: saved.id!,
      })

      expect(response.id).toBe(ID)
      expect(response.name).toBe("Renda Fixa")
    })

    it("should expose every field when the category exists", async () => {
      const saved = await categoryRepository.save(
        buildCategory({
          id: buildEntityId(ID),
          name: "Renda Variável",
          createdAt: new Date("2026-03-01T00:00:00.000Z"),
          updatedAt: new Date("2026-03-02T00:00:00.000Z"),
        })
      )
      const useCase = new GetCategoryUseCase(categoryRepository)

      const response = await useCase.execute({
        categoryId: saved.id!,
      })

      expect(response).toStrictEqual({
        id: ID,
        name: "Renda Variável",
        createdAt: "2026-03-01T00:00:00.000Z",
        updatedAt: "2026-03-02T00:00:00.000Z",
      })
    })

    it("should return the requested category when several exist", async () => {
      await categoryRepository.save(
        buildCategory({ id: buildEntityId("category-1") })
      )
      const target = await categoryRepository.save(
        buildCategory({
          id: buildEntityId(ID),
          name: "Multimercado",
        })
      )
      const useCase = new GetCategoryUseCase(categoryRepository)

      const response = await useCase.execute({
        categoryId: target.id!,
      })

      expect(response.name).toBe("Multimercado")
    })

    it("should throw NotFoundError when the category does not exist", async () => {
      const useCase = new GetCategoryUseCase(categoryRepository)

      await expect(
        useCase.execute({ categoryId: ID })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw ValidationError when the category id is blank", async () => {
      const useCase = new GetCategoryUseCase(categoryRepository)

      await expect(
        useCase.execute({ categoryId: "  " })
      ).rejects.toThrow(ValidationError)
    })
  })
})
