import { describe, it, expect, beforeEach } from "vitest"

import { BulkDeleteCategoriesUseCase } from "@/services/category/use-cases/bulk-delete-categories.use-case"
import { createFakeCategoryRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildCategory,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const FIRST = "00000000-0000-0000-0000-000000000021"
const SECOND = "00000000-0000-0000-0000-000000000022"
const MISSING = "00000000-0000-0000-0000-000000000099"

describe("services/category/use-cases/bulk-delete-categories.use-case", () => {
  let categoryRepository: ReturnType<
    typeof createFakeCategoryRepository
  >

  beforeEach(() => {
    categoryRepository = createFakeCategoryRepository()
  })

  describe("execute", () => {
    it("should remove every matching row when all ids exist", async () => {
      const first = await categoryRepository.save(
        buildCategory({ id: buildEntityId(FIRST) })
      )
      const second = await categoryRepository.save(
        buildCategory({ id: buildEntityId(SECOND) })
      )
      const useCase = new BulkDeleteCategoriesUseCase(
        categoryRepository
      )

      await useCase.execute({
        categoryIds: [first.id!, second.id!],
      })

      expect(await categoryRepository.findAll({})).toStrictEqual(
        []
      )
    })

    it("should delete only the existing rows when the id list mixes found and missing ids", async () => {
      const first = await categoryRepository.save(
        buildCategory({ id: buildEntityId(FIRST) })
      )
      const second = await categoryRepository.save(
        buildCategory({ id: buildEntityId(SECOND) })
      )
      const useCase = new BulkDeleteCategoriesUseCase(
        categoryRepository
      )

      await useCase.execute({
        categoryIds: [first.id!, MISSING, second.id!],
      })

      expect(await categoryRepository.findAll({})).toStrictEqual(
        []
      )
    })

    it("should keep the untouched rows when the id list mixes found and missing ids", async () => {
      const target = await categoryRepository.save(
        buildCategory({ id: buildEntityId(FIRST) })
      )
      const other = await categoryRepository.save(
        buildCategory({ id: buildEntityId(SECOND) })
      )
      const useCase = new BulkDeleteCategoriesUseCase(
        categoryRepository
      )

      await useCase.execute({
        categoryIds: [target.id!, MISSING],
      })

      expect(
        await categoryRepository.findById(other.id!)
      ).not.toBeNull()
    })

    it("should keep every row when the id list is empty", async () => {
      const saved = await categoryRepository.save(
        buildCategory({ id: buildEntityId(FIRST) })
      )
      const useCase = new BulkDeleteCategoriesUseCase(
        categoryRepository
      )

      await useCase.execute({ categoryIds: [] })

      expect(
        await categoryRepository.findById(saved.id!)
      ).not.toBeNull()
    })

    it("should keep every row when no id matches", async () => {
      const saved = await categoryRepository.save(
        buildCategory({ id: buildEntityId(FIRST) })
      )
      const useCase = new BulkDeleteCategoriesUseCase(
        categoryRepository
      )

      await useCase.execute({ categoryIds: [MISSING] })

      expect(
        await categoryRepository.findById(saved.id!)
      ).not.toBeNull()
    })

    it("should resolve without a payload when the id list is empty", async () => {
      const useCase = new BulkDeleteCategoriesUseCase(
        categoryRepository
      )

      const response = await useCase.execute({ categoryIds: [] })

      expect(response).toBeUndefined()
    })
  })
})
