import { describe, it, expect, beforeEach } from "vitest"

import { ResolvePortfolioPeriodReturnsUseCase } from "@/services/portfolio-performance/use-cases/resolve-portfolio-period-returns.use-case"
import { NotFoundError } from "@errors/not-found.error"
import {
  createFakePortfolioPerformanceRepository,
  createFakePortfolioRepository,
} from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPortfolio,
  buildPortfolioPerformance,
  buildPositiveMoney,
  buildSignedMoney,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"

const FROM = new Date("2026-01-01T00:00:00.000Z")
const TO = new Date("2026-01-31T00:00:00.000Z")

// Builds a consistent chain of snapshots: each day's patrimony is
// the previous balance plus the earnings its return produces, so
// the growth factor rebuilt from the balances equals the daily
// return exactly.
function buildChain(
  entries: { date: string; returnPercent: number }[]
): ReturnType<typeof buildPortfolioPerformance>[] {
  const SNAPSHOTS: ReturnType<
    typeof buildPortfolioPerformance
  >[] = []
  let balance = 1_000_000

  for (const ENTRY of entries) {
    const EARNINGS = balance * (ENTRY.returnPercent / 100)
    const PATRIMONY = balance + EARNINGS

    SNAPSHOTS.push(
      buildPortfolioPerformance({
        date: new Date(`${ENTRY.date}T00:00:00.000Z`),
        patrimony: buildPositiveMoney(PATRIMONY.toFixed(2)),
        cashFlowNet: buildSignedMoney("0.00"),
        earnings: buildSignedMoney(EARNINGS.toFixed(2)),
        returnDaily: buildSignedPercentage(
          ENTRY.returnPercent.toFixed(2)
        ),
      })
    )

    balance = Number(PATRIMONY.toFixed(2))
  }

  return SNAPSHOTS
}

describe("services/portfolio-performance/use-cases/resolve-portfolio-period-returns.use-case", () => {
  let portfolioRepository: ReturnType<
    typeof createFakePortfolioRepository
  >
  let portfolioPerformanceRepository: ReturnType<
    typeof createFakePortfolioPerformanceRepository
  >

  beforeEach(() => {
    portfolioRepository = createFakePortfolioRepository()
    portfolioPerformanceRepository =
      createFakePortfolioPerformanceRepository()
  })

  describe("execute", () => {
    it("should chain the year, month and period returns when the window holds at least two snapshots", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
        })
      )
      for (const SNAPSHOT of buildChain([
        { date: "2026-01-05", returnPercent: 1 },
        { date: "2026-01-10", returnPercent: 2 },
        { date: "2026-01-20", returnPercent: 3 },
        { date: "2026-01-25", returnPercent: 4 },
      ])) {
        await portfolioPerformanceRepository.save(SNAPSHOT)
      }
      const useCase = new ResolvePortfolioPeriodReturnsUseCase(
        portfolioRepository,
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        userId: "user-1",
        from: FROM,
        to: TO,
      })

      expect(response.yearReturn).toBe("10.36")
      expect(response.monthReturn).toBe("10.36")
      expect(response.periodReturn).toBe("10.36")
    })

    it("should clamp the month horizon to the closing month when the window spans two months", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
        })
      )
      for (const SNAPSHOT of buildChain([
        { date: "2026-01-21", returnPercent: 1 },
        { date: "2026-02-02", returnPercent: 2 },
        { date: "2026-02-05", returnPercent: 3 },
      ])) {
        await portfolioPerformanceRepository.save(SNAPSHOT)
      }
      const useCase = new ResolvePortfolioPeriodReturnsUseCase(
        portfolioRepository,
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        userId: "user-1",
        from: new Date("2026-01-20T00:00:00.000Z"),
        to: new Date("2026-02-10T00:00:00.000Z"),
      })

      expect(response.yearReturn).toBe("6.11")
      expect(response.monthReturn).toBe("5.06")
      expect(response.periodReturn).toBe("6.11")
    })

    it("should fall back to the stored trailing return when the month horizon holds a single snapshot", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
        })
      )
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          date: new Date("2026-01-20T00:00:00.000Z"),
          returnDaily: buildSignedPercentage("1"),
          returnMonthly: buildSignedPercentage("5.5"),
          returnYearly: buildSignedPercentage("9"),
        })
      )
      const useCase = new ResolvePortfolioPeriodReturnsUseCase(
        portfolioRepository,
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        userId: "user-1",
        from: FROM,
        to: TO,
      })

      expect(response.yearReturn).toBe("9")
      expect(response.monthReturn).toBe("5.5")
    })

    it("should return a null period return when the window holds a single snapshot", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
        })
      )
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          date: new Date("2026-01-20T00:00:00.000Z"),
          returnDaily: buildSignedPercentage("1"),
        })
      )
      const useCase = new ResolvePortfolioPeriodReturnsUseCase(
        portfolioRepository,
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        userId: "user-1",
        from: FROM,
        to: TO,
      })

      expect(response.yearReturn).toBeNull()
      expect(response.monthReturn).toBeNull()
      expect(response.periodReturn).toBeNull()
    })

    it("should exclude the snapshots outside the window when resolving the period returns", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
        })
      )
      for (const SNAPSHOT of buildChain([
        { date: "2025-12-31", returnPercent: 50 },
        { date: "2026-01-12", returnPercent: 1 },
        { date: "2026-01-15", returnPercent: 2 },
      ])) {
        await portfolioPerformanceRepository.save(SNAPSHOT)
      }
      const useCase = new ResolvePortfolioPeriodReturnsUseCase(
        portfolioRepository,
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        userId: "user-1",
        from: FROM,
        to: TO,
      })

      expect(response.periodReturn).toBe("3.02")
    })

    it("should return null returns when the portfolio has no snapshot", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
        })
      )
      const useCase = new ResolvePortfolioPeriodReturnsUseCase(
        portfolioRepository,
        portfolioPerformanceRepository
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        userId: "user-1",
        from: FROM,
        to: TO,
      })

      expect(response.yearReturn).toBeNull()
      expect(response.monthReturn).toBeNull()
      expect(response.periodReturn).toBeNull()
    })

    it("should throw NotFoundError when the portfolio does not exist", async () => {
      const useCase = new ResolvePortfolioPeriodReturnsUseCase(
        portfolioRepository,
        portfolioPerformanceRepository
      )

      await expect(
        useCase.execute({
          portfolioId: "portfolio-1",
          userId: "user-1",
          from: FROM,
          to: TO,
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw NotFoundError when the portfolio belongs to another user", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
        })
      )
      const useCase = new ResolvePortfolioPeriodReturnsUseCase(
        portfolioRepository,
        portfolioPerformanceRepository
      )

      await expect(
        useCase.execute({
          portfolioId: "portfolio-1",
          userId: "user-2",
          from: FROM,
          to: TO,
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should not read any snapshot when the portfolio belongs to another user", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
        })
      )
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-1"),
          returnDaily: buildSignedPercentage("4"),
        })
      )
      const useCase = new ResolvePortfolioPeriodReturnsUseCase(
        portfolioRepository,
        portfolioPerformanceRepository
      )

      await expect(
        useCase.execute({
          portfolioId: "portfolio-1",
          userId: "user-2",
          from: FROM,
          to: TO,
        })
      ).rejects.toThrow(NotFoundError)

      expect(
        await portfolioPerformanceRepository.findAllByPortfolioId(
          buildEntityId("portfolio-1")
        )
      ).toHaveLength(1)
    })
  })
})
