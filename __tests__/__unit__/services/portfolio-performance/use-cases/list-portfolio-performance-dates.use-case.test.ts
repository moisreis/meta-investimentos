import { describe, it, expect, beforeEach } from "vitest"

import { ListPortfolioPerformanceDatesUseCase } from "@/services/portfolio-performance/use-cases/list-portfolio-performance-dates.use-case"
import { createFakePortfolioPerformanceRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPortfolioPerformance,
} from "__tests__/__setup__/_factories.setup"

describe("services/portfolio-performance/use-cases/list-portfolio-performance-dates.use-case", () => {
  let portfolioPerformanceRepository: ReturnType<
    typeof createFakePortfolioPerformanceRepository
  >

  beforeEach(() => {
    portfolioPerformanceRepository =
      createFakePortfolioPerformanceRepository()
  })

  describe("execute", () => {
    it("should list the distinct day keys ordered ascending when several snapshots exist", async () => {
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          date: new Date("2026-03-31T00:00:00.000Z"),
        })
      )
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          date: new Date("2026-01-31T00:00:00.000Z"),
        })
      )
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          date: new Date("2026-02-28T00:00:00.000Z"),
        })
      )
      const useCase = new ListPortfolioPerformanceDatesUseCase(
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioIds: ["portfolio-1"],
      })

      expect(response).toEqual([
        "2026-01-31",
        "2026-02-28",
        "2026-03-31",
      ])
    })

    it("should collapse snapshots of different portfolios sharing a day when listing the dates", async () => {
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-1"),
          date: new Date("2026-01-31T00:00:00.000Z"),
        })
      )
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-2"),
          date: new Date("2026-01-31T00:00:00.000Z"),
        })
      )
      const useCase = new ListPortfolioPerformanceDatesUseCase(
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioIds: ["portfolio-1", "portfolio-2"],
      })

      expect(response).toEqual(["2026-01-31"])
    })

    it("should exclude the days of a portfolio that was not requested when listing the dates", async () => {
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
      const useCase = new ListPortfolioPerformanceDatesUseCase(
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioIds: ["portfolio-1"],
      })

      expect(response).toEqual(["2026-01-31"])
    })

    it("should return an empty list when no portfolio holds a snapshot", async () => {
      const useCase = new ListPortfolioPerformanceDatesUseCase(
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
          date: new Date("2026-01-31T00:00:00.000Z"),
        })
      )
      const useCase = new ListPortfolioPerformanceDatesUseCase(
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioIds: [],
      })

      expect(response).toEqual([])
    })
  })
})
