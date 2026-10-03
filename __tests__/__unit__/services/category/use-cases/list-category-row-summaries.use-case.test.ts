import { describe, it, expect, beforeEach } from "vitest"

import { ListCategoryRowSummariesUseCase } from "@/services/category/use-cases/list-category-row-summaries.use-case"
import { ValidationError } from "@errors/validation.error"
import { createFakeFundRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildFund,
  buildUniqueCnpj,
} from "__tests__/__setup__/_factories.setup"

const CATEGORY_A = "category-1"
const CATEGORY_B = "category-2"

describe("services/category/use-cases/list-category-row-summaries.use-case", () => {
  let fundRepository: ReturnType<typeof createFakeFundRepository>

  beforeEach(() => {
    fundRepository = createFakeFundRepository()
  })

  describe("execute", () => {
    it("should count the funds of each category when listing row summaries", async () => {
      await fundRepository.save(
        buildFund({
          cnpj: buildUniqueCnpj("111111111111"),
          categoryId: buildEntityId(CATEGORY_A),
        })
      )
      await fundRepository.save(
        buildFund({
          cnpj: buildUniqueCnpj("222222222222"),
          categoryId: buildEntityId(CATEGORY_A),
        })
      )
      const useCase = new ListCategoryRowSummariesUseCase(
        fundRepository
      )

      const response = await useCase.execute({
        categoryIds: [CATEGORY_A],
      })

      expect(response).toStrictEqual([
        { categoryId: CATEGORY_A, fundCount: 2 },
      ])
    })

    it("should tally several categories when listing row summaries", async () => {
      await fundRepository.save(
        buildFund({
          cnpj: buildUniqueCnpj("111111111111"),
          categoryId: buildEntityId(CATEGORY_A),
        })
      )
      await fundRepository.save(
        buildFund({
          cnpj: buildUniqueCnpj("222222222222"),
          categoryId: buildEntityId(CATEGORY_B),
        })
      )
      const useCase = new ListCategoryRowSummariesUseCase(
        fundRepository
      )

      const response = await useCase.execute({
        categoryIds: [CATEGORY_A, CATEGORY_B],
      })

      expect(response).toStrictEqual([
        { categoryId: CATEGORY_A, fundCount: 1 },
        { categoryId: CATEGORY_B, fundCount: 1 },
      ])
    })

    it("should omit categories without funds when listing row summaries", async () => {
      await fundRepository.save(
        buildFund({
          cnpj: buildUniqueCnpj("111111111111"),
          categoryId: buildEntityId(CATEGORY_A),
        })
      )
      const useCase = new ListCategoryRowSummariesUseCase(
        fundRepository
      )

      const response = await useCase.execute({
        categoryIds: [CATEGORY_A, CATEGORY_B],
      })

      expect(
        response.map((entry) => entry.categoryId)
      ).toStrictEqual([CATEGORY_A])
    })

    it("should return an empty array when no fund matches", async () => {
      const useCase = new ListCategoryRowSummariesUseCase(
        fundRepository
      )

      const response = await useCase.execute({
        categoryIds: [CATEGORY_A, CATEGORY_B],
      })

      expect(response).toStrictEqual([])
    })

    it("should return an empty array when the id list is empty", async () => {
      await fundRepository.save(
        buildFund({
          cnpj: buildUniqueCnpj("111111111111"),
          categoryId: buildEntityId(CATEGORY_A),
        })
      )
      const useCase = new ListCategoryRowSummariesUseCase(
        fundRepository
      )

      const response = await useCase.execute({ categoryIds: [] })

      expect(response).toStrictEqual([])
    })

    it("should throw ValidationError when a category id is blank", async () => {
      const useCase = new ListCategoryRowSummariesUseCase(
        fundRepository
      )

      await expect(
        useCase.execute({ categoryIds: ["   "] })
      ).rejects.toThrow(ValidationError)
    })
  })
})
