import { describe, it, expect, beforeEach } from "vitest"

import { ListPortfolioNormsUseCase } from "@/services/norms-portfolio/use-cases/list-portfolio-norms.use-case"
import { ValidationError } from "@errors/validation.error"
import { createFakeNormsPortfoliosRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildNormsPortfolios,
} from "__tests__/__setup__/_factories.setup"

const PORTFOLIO = "portfolio-1"
const OTHER_PORTFOLIO = "portfolio-2"

describe("services/norms-portfolio/use-cases/list-portfolio-norms.use-case", () => {
  let normsPortfoliosRepository: ReturnType<
    typeof createFakeNormsPortfoliosRepository
  >

  beforeEach(() => {
    normsPortfoliosRepository =
      createFakeNormsPortfoliosRepository()
  })

  describe("execute", () => {
    it("should return the relations of the requested portfolio when listing portfolio norms", async () => {
      await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          normId: buildEntityId("norm-1"),
          portfolioId: buildEntityId(PORTFOLIO),
        })
      )
      await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          normId: buildEntityId("norm-2"),
          portfolioId: buildEntityId(PORTFOLIO),
        })
      )
      const useCase = new ListPortfolioNormsUseCase(
        normsPortfoliosRepository
      )

      const response = await useCase.execute({
        portfolioId: PORTFOLIO,
      })

      expect(response.map((link) => link.normId)).toStrictEqual([
        "norm-1",
        "norm-2",
      ])
    })

    it("should exclude the relations of other portfolios when listing portfolio norms", async () => {
      await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          normId: buildEntityId("norm-1"),
          portfolioId: buildEntityId(OTHER_PORTFOLIO),
        })
      )
      const useCase = new ListPortfolioNormsUseCase(
        normsPortfoliosRepository
      )

      const response = await useCase.execute({
        portfolioId: PORTFOLIO,
      })

      expect(response).toStrictEqual([])
    })

    it("should return an empty array when the portfolio has no relations", async () => {
      const useCase = new ListPortfolioNormsUseCase(
        normsPortfoliosRepository
      )

      const response = await useCase.execute({
        portfolioId: PORTFOLIO,
      })

      expect(response).toStrictEqual([])
    })

    it("should map every row to the response DTO when listing portfolio norms", async () => {
      await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          id: buildEntityId("relation-1"),
          normId: buildEntityId("norm-7"),
          portfolioId: buildEntityId(PORTFOLIO),
          createdAt: new Date("2026-07-01T00:00:00.000Z"),
        })
      )
      const useCase = new ListPortfolioNormsUseCase(
        normsPortfoliosRepository
      )

      const response = await useCase.execute({
        portfolioId: PORTFOLIO,
      })

      expect(response[0]).toStrictEqual({
        id: "relation-1",
        normId: "norm-7",
        portfolioId: PORTFOLIO,
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
        createdAt: "2026-07-01T00:00:00.000Z",
      })
    })

    it("should throw ValidationError when the portfolio id is blank", async () => {
      const useCase = new ListPortfolioNormsUseCase(
        normsPortfoliosRepository
      )

      await expect(
        useCase.execute({ portfolioId: "   " })
      ).rejects.toThrow(ValidationError)
    })
  })
})
