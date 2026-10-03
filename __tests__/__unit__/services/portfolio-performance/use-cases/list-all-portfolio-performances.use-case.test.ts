import { describe, it, expect, beforeEach } from "vitest"

import { ListAllPortfolioPerformancesUseCase } from "@/services/portfolio-performance/use-cases/list-all-portfolio-performances.use-case"
import { createFakePortfolioPerformanceRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPortfolioPerformance,
} from "__tests__/__setup__/_factories.setup"

describe("services/portfolio-performance/use-cases/list-all-portfolio-performances.use-case", () => {
  let portfolioPerformanceRepository: ReturnType<
    typeof createFakePortfolioPerformanceRepository
  >

  beforeEach(() => {
    portfolioPerformanceRepository =
      createFakePortfolioPerformanceRepository()
  })

  describe("execute", () => {
    it("should list the snapshots of every provided portfolio when several portfolios have rows", async () => {
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-1"),
          date: new Date("2026-01-31T00:00:00.000Z"),
        })
      )
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-2"),
          date: new Date("2026-02-28T00:00:00.000Z"),
        })
      )
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-3"),
          date: new Date("2026-03-31T00:00:00.000Z"),
        })
      )
      const useCase = new ListAllPortfolioPerformancesUseCase(
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioIds: ["portfolio-1", "portfolio-2"],
      })

      expect(response.length).toBe(2)
      expect(
        response.map((row) => row.portfolioId).sort()
      ).toEqual(["portfolio-1", "portfolio-2"])
    })

    it("should exclude the snapshots of a portfolio that was not requested when listing every portfolio", async () => {
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-1"),
        })
      )
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-2"),
          date: new Date("2026-02-28T00:00:00.000Z"),
        })
      )
      const useCase = new ListAllPortfolioPerformancesUseCase(
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioIds: ["portfolio-1"],
      })

      expect(response.length).toBe(1)
      expect(response[0].portfolioId).toBe("portfolio-1")
    })

    it("should return an empty list when no provided portfolio has a snapshot", async () => {
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-9"),
        })
      )
      const useCase = new ListAllPortfolioPerformancesUseCase(
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioIds: ["portfolio-1"],
      })

      expect(response).toEqual([])
    })

    it("should return an empty list when the portfolio id list is empty", async () => {
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-1"),
        })
      )
      const useCase = new ListAllPortfolioPerformancesUseCase(
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioIds: [],
      })

      expect(response).toEqual([])
    })
  })
})
