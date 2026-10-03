import { describe, it, expect, beforeEach } from "vitest"

import { ListPortfolioPerformanceByRangeUseCase } from "@/services/portfolio-performance/use-cases/list-portfolio-performance-by-range.use-case"
import { createFakePortfolioPerformanceRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPortfolioPerformance,
} from "__tests__/__setup__/_factories.setup"

const FROM = new Date("2026-01-01T00:00:00.000Z")
const TO = new Date("2026-01-31T00:00:00.000Z")

describe("services/portfolio-performance/use-cases/list-portfolio-performance-by-range.use-case", () => {
  let portfolioPerformanceRepository: ReturnType<
    typeof createFakePortfolioPerformanceRepository
  >

  beforeEach(() => {
    portfolioPerformanceRepository =
      createFakePortfolioPerformanceRepository()
  })

  describe("execute", () => {
    it("should return only the latest snapshot of the range when a portfolio holds several rows", async () => {
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-1"),
          date: new Date("2026-01-05T00:00:00.000Z"),
        })
      )
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-1"),
          date: new Date("2026-01-20T00:00:00.000Z"),
        })
      )
      const useCase = new ListPortfolioPerformanceByRangeUseCase(
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioIds: ["portfolio-1"],
        from: FROM,
        to: TO,
      })

      expect(response.length).toBe(1)
      expect(response[0].date).toBe("2026-01-20T00:00:00.000Z")
    })

    it("should skip a portfolio whose rows all fall outside the range when listing by range", async () => {
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-1"),
          date: new Date("2026-01-20T00:00:00.000Z"),
        })
      )
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-2"),
          date: new Date("2026-02-20T00:00:00.000Z"),
        })
      )
      const useCase = new ListPortfolioPerformanceByRangeUseCase(
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioIds: ["portfolio-1", "portfolio-2"],
        from: FROM,
        to: TO,
      })

      expect(response.length).toBe(1)
      expect(response[0].portfolioId).toBe("portfolio-1")
    })

    it("should include the snapshot on the upper bound when the range closes exactly on it", async () => {
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-1"),
          date: new Date("2026-01-31T00:00:00.000Z"),
        })
      )
      const useCase = new ListPortfolioPerformanceByRangeUseCase(
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioIds: ["portfolio-1"],
        from: FROM,
        to: TO,
      })

      expect(response.length).toBe(1)
      expect(response[0].date).toBe("2026-01-31T00:00:00.000Z")
    })

    it("should exclude the snapshot before the range when the lower bound is after it", async () => {
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-1"),
          date: new Date("2025-12-31T00:00:00.000Z"),
        })
      )
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
        })
      )
      const useCase = new ListPortfolioPerformanceByRangeUseCase(
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioIds: ["portfolio-1"],
        from: FROM,
        to: TO,
      })

      expect(response.length).toBe(1)
      expect(response[0].date).toBe("2026-01-10T00:00:00.000Z")
    })

    it("should return an empty list when no portfolio holds a snapshot in the range", async () => {
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-1"),
          date: new Date("2026-03-31T00:00:00.000Z"),
        })
      )
      const useCase = new ListPortfolioPerformanceByRangeUseCase(
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioIds: ["portfolio-1"],
        from: FROM,
        to: TO,
      })

      expect(response).toEqual([])
    })

    it("should return an empty list when the portfolio id list is empty", async () => {
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-1"),
          date: new Date("2026-01-20T00:00:00.000Z"),
        })
      )
      const useCase = new ListPortfolioPerformanceByRangeUseCase(
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioIds: [],
        from: FROM,
        to: TO,
      })

      expect(response).toEqual([])
    })
  })
})
