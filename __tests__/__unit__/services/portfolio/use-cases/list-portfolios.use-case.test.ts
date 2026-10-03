import { describe, it, expect, beforeEach } from "vitest"

import { ListPortfoliosUseCase } from "@/services/portfolio/use-cases/list-portfolios.use-case"
import { ValidationError } from "@errors/validation.error"
import { createFakePortfolioRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPortfolio,
} from "__tests__/__setup__/_factories.setup"

describe("services/portfolio/use-cases/list-portfolios.use-case", () => {
  let portfolioRepository: ReturnType<
    typeof createFakePortfolioRepository
  >

  beforeEach(() => {
    portfolioRepository = createFakePortfolioRepository()
  })

  describe("execute", () => {
    it("should return only the portfolios of the user when listing portfolios", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
        })
      )
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-2"),
          acronym: "FII",
          userId: buildEntityId("user-1"),
        })
      )
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-3"),
          acronym: "ETF",
          userId: buildEntityId("user-2"),
        })
      )
      const useCase = new ListPortfoliosUseCase(
        portfolioRepository
      )

      const response = await useCase.execute({
        userId: "user-1",
      })

      expect(response.length).toBe(2)
      expect(response.map((row) => row.acronym)).toEqual([
        "FIA",
        "FII",
      ])
    })

    it("should map every listed portfolio when listing portfolios", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          acronym: "ME",
          name: "Meu Portfolio",
          userId: buildEntityId("user-1"),
        })
      )
      const useCase = new ListPortfoliosUseCase(
        portfolioRepository
      )

      const response = await useCase.execute({
        userId: "user-1",
      })

      expect(response[0].id).toBe("portfolio-1")
      expect(response[0].acronym).toBe("ME")
      expect(response[0].name).toBe("Meu Portfolio")
      expect(response[0].userId).toBe("user-1")
    })

    it("should return an empty list when the user owns no portfolio", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-2"),
        })
      )
      const useCase = new ListPortfoliosUseCase(
        portfolioRepository
      )

      const response = await useCase.execute({
        userId: "user-1",
      })

      expect(response).toEqual([])
    })

    it("should throw ValidationError when the user id is blank", async () => {
      const useCase = new ListPortfoliosUseCase(
        portfolioRepository
      )

      await expect(
        useCase.execute({ userId: "   " })
      ).rejects.toThrow(ValidationError)
    })
  })
})
