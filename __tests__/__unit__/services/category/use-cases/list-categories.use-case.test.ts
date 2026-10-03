import { describe, it, expect, beforeEach } from "vitest"

import { ListCategoriesUseCase } from "@/services/category/use-cases/list-categories.use-case"
import { createFakeCategoryRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildCategory,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

describe("services/category/use-cases/list-categories.use-case", () => {
  let categoryRepository: ReturnType<
    typeof createFakeCategoryRepository
  >

  beforeEach(() => {
    categoryRepository = createFakeCategoryRepository()
  })

  describe("execute", () => {
    it("should return every category when the input has no pagination", async () => {
      await categoryRepository.save(
        buildCategory({
          id: buildEntityId("category-1"),
          name: "Ações",
        })
      )
      await categoryRepository.save(
        buildCategory({
          id: buildEntityId("category-2"),
          name: "Renda Fixa",
        })
      )
      const useCase = new ListCategoriesUseCase(
        categoryRepository
      )

      const response = await useCase.execute({})

      expect(
        response.map((category) => category.name)
      ).toStrictEqual(["Ações", "Renda Fixa"])
    })

    it("should return an empty array when no category is registered", async () => {
      const useCase = new ListCategoriesUseCase(
        categoryRepository
      )

      const response = await useCase.execute({})

      expect(response).toStrictEqual([])
    })

    it("should truncate the page when the input provides a limit", async () => {
      await categoryRepository.save(
        buildCategory({ id: buildEntityId("category-1") })
      )
      await categoryRepository.save(
        buildCategory({ id: buildEntityId("category-2") })
      )
      await categoryRepository.save(
        buildCategory({ id: buildEntityId("category-3") })
      )
      const useCase = new ListCategoriesUseCase(
        categoryRepository
      )

      const response = await useCase.execute({ limit: 2 })

      expect(response).toHaveLength(2)
      expect(
        response.map((category) => category.id)
      ).toStrictEqual(["category-1", "category-2"])
    })

    it("should skip the leading rows when the input provides an offset", async () => {
      await categoryRepository.save(
        buildCategory({ id: buildEntityId("category-1") })
      )
      await categoryRepository.save(
        buildCategory({ id: buildEntityId("category-2") })
      )
      await categoryRepository.save(
        buildCategory({ id: buildEntityId("category-3") })
      )
      const useCase = new ListCategoriesUseCase(
        categoryRepository
      )

      const response = await useCase.execute({
        limit: 1,
        offset: 1,
      })

      expect(
        response.map((category) => category.id)
      ).toStrictEqual(["category-2"])
    })

    it("should map every row to the response DTO when listing categories", async () => {
      const saved = await categoryRepository.save(
        buildCategory({
          id: buildEntityId("category-1"),
          name: "Multimercado",
          createdAt: new Date("2026-05-01T00:00:00.000Z"),
          updatedAt: new Date("2026-05-02T00:00:00.000Z"),
        })
      )
      const useCase = new ListCategoriesUseCase(
        categoryRepository
      )

      const response = await useCase.execute({})

      expect(response[0]).toStrictEqual({
        id: saved.id,
        name: "Multimercado",
        createdAt: "2026-05-01T00:00:00.000Z",
        updatedAt: "2026-05-02T00:00:00.000Z",
      })
    })
  })
})
