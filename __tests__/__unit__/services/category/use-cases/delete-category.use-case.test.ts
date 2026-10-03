import { describe, it, expect, beforeEach } from "vitest"

import { DeleteCategoryUseCase } from "@/services/category/use-cases/delete-category.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakeCategoryRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildCategory,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000011"

describe("services/category/use-cases/delete-category.use-case", () => {
  let categoryRepository: ReturnType<
    typeof createFakeCategoryRepository
  >

  beforeEach(() => {
    categoryRepository = createFakeCategoryRepository()
  })

  describe("execute", () => {
    it("should remove the row when the category exists", async () => {
      const saved = await categoryRepository.save(
        buildCategory({ id: buildEntityId(ID) })
      )
      const useCase = new DeleteCategoryUseCase(
        categoryRepository
      )

      await useCase.execute({ categoryId: saved.id! })

      expect(
        await categoryRepository.findById(saved.id!)
      ).toBeNull()
    })

    it("should leave the other rows untouched when the category exists", async () => {
      const target = await categoryRepository.save(
        buildCategory({ id: buildEntityId(ID) })
      )
      const other = await categoryRepository.save(
        buildCategory({ id: buildEntityId("other-category") })
      )
      const useCase = new DeleteCategoryUseCase(
        categoryRepository
      )

      await useCase.execute({ categoryId: target.id! })

      expect(
        await categoryRepository.findById(other.id!)
      ).not.toBeNull()
    })

    it("should resolve without a payload when the category exists", async () => {
      const saved = await categoryRepository.save(
        buildCategory({ id: buildEntityId(ID) })
      )
      const useCase = new DeleteCategoryUseCase(
        categoryRepository
      )

      const response = await useCase.execute({
        categoryId: saved.id!,
      })

      expect(response).toBeUndefined()
    })

    it("should throw NotFoundError when the category does not exist", async () => {
      const useCase = new DeleteCategoryUseCase(
        categoryRepository
      )

      await expect(
        useCase.execute({ categoryId: ID })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw ValidationError when the category id is blank", async () => {
      const useCase = new DeleteCategoryUseCase(
        categoryRepository
      )

      await expect(
        useCase.execute({ categoryId: "   " })
      ).rejects.toThrow(ValidationError)
    })
  })
})
