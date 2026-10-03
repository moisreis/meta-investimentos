import { describe, it, expect, beforeEach } from "vitest"

import { ListPortfolioPerformanceUseCase } from "@/services/portfolio-performance/use-cases/list-portfolio-performance.use-case"
import { ValidationError } from "@errors/validation.error"
import { createFakePortfolioPerformanceRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPortfolioPerformance,
} from "__tests__/__setup__/_factories.setup"

describe("services/portfolio-performance/use-cases/list-portfolio-performance.use-case", () => {
  let portfolioPerformanceRepository: ReturnType<
    typeof createFakePortfolioPerformanceRepository
  >

  beforeEach(() => {
    portfolioPerformanceRepository =
      createFakePortfolioPerformanceRepository()
  })

  describe("execute", () => {
    it("should list the snapshots ordered by ascending date when the portfolio has rows", async () => {
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          date: new Date("2026-02-28T00:00:00.000Z"),
        })
      )
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          date: new Date("2026-01-31T00:00:00.000Z"),
        })
      )
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          date: new Date("2026-03-31T00:00:00.000Z"),
        })
      )
      const useCase = new ListPortfolioPerformanceUseCase(
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
      })

      expect(response.map((row) => row.date)).toEqual([
        "2026-01-31T00:00:00.000Z",
        "2026-02-28T00:00:00.000Z",
        "2026-03-31T00:00:00.000Z",
      ])
    })

    it("should exclude the snapshots of another portfolio when listing a portfolio", async () => {
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
      const useCase = new ListPortfolioPerformanceUseCase(
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
      })

      expect(response.length).toBe(1)
      expect(response[0].portfolioId).toBe("portfolio-1")
    })

    it("should return a single mapped snapshot when the portfolio has one row", async () => {
      const saved = await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-1"),
        })
      )
      const useCase = new ListPortfolioPerformanceUseCase(
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
      })

      expect(response.length).toBe(1)
      expect(response[0].id).toBe(saved.id!)
      expect(response[0].patrimony).toBe("50000")
    })

    it("should return an empty list when the portfolio has no snapshot", async () => {
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-2"),
        })
      )
      const useCase = new ListPortfolioPerformanceUseCase(
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
      })

      expect(response).toEqual([])
    })

    it("should throw ValidationError when the portfolio id is blank", async () => {
      const useCase = new ListPortfolioPerformanceUseCase(
        portfolioPerformanceRepository
      )

      await expect(
        useCase.execute({ portfolioId: "   " })
      ).rejects.toThrow(ValidationError)
    })
  })
})
