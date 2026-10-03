import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { GetPortfolioPerformanceUseCase } from "@/services/portfolio-performance/use-cases/get-portfolio-performance.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakePortfolioPerformanceRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPortfolioPerformance,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

const ID = "00000000-0000-0000-0000-000000000012"

describe("services/portfolio-performance/use-cases/get-portfolio-performance.use-case", () => {
  let portfolioPerformanceRepository: ReturnType<
    typeof createFakePortfolioPerformanceRepository
  >

  beforeEach(() => {
    useFixedClock()
    portfolioPerformanceRepository =
      createFakePortfolioPerformanceRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  describe("execute", () => {
    it("should map the stored snapshot when the performance exists", async () => {
      const saved = await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          id: buildEntityId(ID),
          portfolioId: buildEntityId("portfolio-9"),
          date: new Date("2026-03-31T00:00:00.000Z"),
        })
      )
      const useCase = new GetPortfolioPerformanceUseCase(
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({ id: saved.id! })

      expect(response.id).toBe(ID)
      expect(response.portfolioId).toBe("portfolio-9")
      expect(response.date).toBe("2026-03-31T00:00:00.000Z")
    })

    it("should expose the stored optional returns when the snapshot carries them", async () => {
      const saved = await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          id: buildEntityId(ID),
          returnMonthly: buildSignedPercentage("1.5"),
          returnYearly: buildSignedPercentage("8.25"),
          returnLast12m: buildSignedPercentage("7"),
          target: buildSignedPercentage("9.75"),
          cumulativeTarget: buildSignedPercentage("9.5"),
          inflationSpread: buildSignedPercentage("4.5"),
          riskFreeSpread: buildSignedPercentage("7.5"),
          marketSpread: buildSignedPercentage("-2"),
        })
      )
      const useCase = new GetPortfolioPerformanceUseCase(
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({ id: saved.id! })

      expect(response.returnMonthly).toBe("1.5")
      expect(response.returnYearly).toBe("8.25")
      expect(response.returnLast12m).toBe("7")
      expect(response.target).toBe("9.75")
      expect(response.cumulativeTarget).toBe("9.5")
      expect(response.inflationSpread).toBe("4.5")
      expect(response.riskFreeSpread).toBe("7.5")
      expect(response.marketSpread).toBe("-2")
    })

    it("should expose null optional returns when the snapshot omits them", async () => {
      const saved = await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          id: buildEntityId(ID),
          returnMonthly: null,
          returnYearly: null,
          returnLast12m: null,
          target: null,
          cumulativeTarget: null,
          inflationSpread: null,
          riskFreeSpread: null,
          marketSpread: null,
        })
      )
      const useCase = new GetPortfolioPerformanceUseCase(
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({ id: saved.id! })

      expect(response.returnMonthly).toBeNull()
      expect(response.returnYearly).toBeNull()
      expect(response.returnLast12m).toBeNull()
      expect(response.target).toBeNull()
      expect(response.cumulativeTarget).toBeNull()
      expect(response.inflationSpread).toBeNull()
      expect(response.riskFreeSpread).toBeNull()
      expect(response.marketSpread).toBeNull()
    })

    it("should throw NotFoundError when the performance does not exist", async () => {
      const useCase = new GetPortfolioPerformanceUseCase(
        portfolioPerformanceRepository
      )

      await expect(useCase.execute({ id: ID })).rejects.toThrow(
        NotFoundError
      )
    })

    it("should throw ValidationError when the performance id is blank", async () => {
      const useCase = new GetPortfolioPerformanceUseCase(
        portfolioPerformanceRepository
      )

      await expect(
        useCase.execute({ id: "  " })
      ).rejects.toThrow(ValidationError)
    })
  })
})
