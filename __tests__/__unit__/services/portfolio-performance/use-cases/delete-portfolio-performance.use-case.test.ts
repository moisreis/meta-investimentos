import { describe, it, expect, beforeEach } from "vitest"

import { DeletePortfolioPerformanceUseCase } from "@/services/portfolio-performance/use-cases/delete-portfolio-performance.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakePortfolioPerformanceRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPortfolioPerformance,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000011"

describe("services/portfolio-performance/use-cases/delete-portfolio-performance.use-case", () => {
  let portfolioPerformanceRepository: ReturnType<
    typeof createFakePortfolioPerformanceRepository
  >

  beforeEach(() => {
    portfolioPerformanceRepository =
      createFakePortfolioPerformanceRepository()
  })

  describe("execute", () => {
    it("should remove the row when the performance exists", async () => {
      const saved = await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({ id: buildEntityId(ID) })
      )
      const useCase = new DeletePortfolioPerformanceUseCase(
        portfolioPerformanceRepository
      )

      await useCase.execute({ performanceId: saved.id! })

      expect(
        await portfolioPerformanceRepository.findById(saved.id!)
      ).toBeNull()
    })

    it("should throw NotFoundError when the performance does not exist", async () => {
      const useCase = new DeletePortfolioPerformanceUseCase(
        portfolioPerformanceRepository
      )

      await expect(
        useCase.execute({ performanceId: ID })
      ).rejects.toThrow(NotFoundError)
    })

    it("should leave the other rows untouched when the performance exists", async () => {
      const target = await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({ id: buildEntityId(ID) })
      )
      const other = await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          date: new Date("2026-02-28T00:00:00.000Z"),
        })
      )
      const useCase = new DeletePortfolioPerformanceUseCase(
        portfolioPerformanceRepository
      )

      await useCase.execute({ performanceId: target.id! })

      expect(
        await portfolioPerformanceRepository.findById(other.id!)
      ).not.toBeNull()
    })

    it("should throw ValidationError when the performance id is blank", async () => {
      const useCase = new DeletePortfolioPerformanceUseCase(
        portfolioPerformanceRepository
      )

      await expect(
        useCase.execute({ performanceId: "  " })
      ).rejects.toThrow(ValidationError)
    })
  })
})
