import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { CreateCategoryUseCase } from "@/services/category/use-cases/create-category.use-case"
import { ValidationError } from "@errors/validation.error"
import { createFakeCategoryRepository } from "__tests__/__setup__/_fakes.setup"
import { buildCategory } from "__tests__/__setup__/_factories.setup"
import {
  getFixedDate,
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

describe("services/category/use-cases/create-category.use-case", () => {
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
    it("should persist a category built from the payload when creating a category", async () => {
      const useCase = new CreateCategoryUseCase(
        categoryRepository
      )

      const response = await useCase.execute({
        name: "Renda Variável",
      })

      expect(response.name).toBe("Renda Variável")
      expect(response.id).toBeDefined()
      expect(
        await categoryRepository.findByName("Renda Variável")
      ).not.toBeNull()
    })

    it("should store exactly one row when creating a category", async () => {
      const useCase = new CreateCategoryUseCase(
        categoryRepository
      )

      await useCase.execute({ name: "Multimercado" })

      const stored = await categoryRepository.findAll({})

      expect(stored.length).toBe(1)
    })

    it("should keep the previous rows when creating a category", async () => {
      await categoryRepository.save(
        buildCategory({ name: "Renda Fixa" })
      )
      const useCase = new CreateCategoryUseCase(
        categoryRepository
      )

      await useCase.execute({ name: "Renda Variável" })

      const stored = await categoryRepository.findAll({})

      expect(stored.length).toBe(2)
    })

    it("should expose the current clock as creation timestamp when creating a category", async () => {
      const useCase = new CreateCategoryUseCase(
        categoryRepository
      )

      const response = await useCase.execute({
        name: "Multimercado",
      })

      expect(response.createdAt).toBe(
        getFixedDate().toISOString()
      )
      expect(response.updatedAt).toBe(
        getFixedDate().toISOString()
      )
    })

    it("should throw ValidationError when the name is blank", async () => {
      const useCase = new CreateCategoryUseCase(
        categoryRepository
      )

      await expect(
        useCase.execute({ name: "   " })
      ).rejects.toThrow(ValidationError)
    })

    it("should store nothing when the name is blank", async () => {
      const useCase = new CreateCategoryUseCase(
        categoryRepository
      )

      await expect(
        useCase.execute({ name: "" })
      ).rejects.toThrow(ValidationError)

      expect(await categoryRepository.findAll({})).toStrictEqual(
        []
      )
    })
  })
})
