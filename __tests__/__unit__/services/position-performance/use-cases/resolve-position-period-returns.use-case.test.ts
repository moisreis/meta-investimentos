import { describe, it, expect, beforeEach } from "vitest"

import { ResolvePositionPeriodReturnsUseCase } from "@/services/position-performance/use-cases/resolve-position-period-returns.use-case"
import type { IPosition } from "@domain/position/interfaces/position.interface"
import { NotFoundError } from "@errors/not-found.error"
import {
  createFakePortfolioRepository,
  createFakePositionPerformanceRepository,
  createFakePositionRepository,
} from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPortfolio,
  buildPosition,
  buildPositionPerformance,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"

const POSITION_ID = "00000000-0000-0000-0000-0000000000b1"
const PORTFOLIO_ID = "00000000-0000-0000-0000-0000000000a1"
const USER_ID = "00000000-0000-0000-0000-0000000000c1"
const OTHER_USER_ID = "00000000-0000-0000-0000-0000000000c2"

const FROM = new Date("2026-01-01T00:00:00.000Z")
const TO = new Date("2026-01-31T00:00:00.000Z")

describe("services/position-performance/use-cases/resolve-position-period-returns.use-case", () => {
  let positionRepository: ReturnType<
    typeof createFakePositionRepository
  >
  let portfolioRepository: ReturnType<
    typeof createFakePortfolioRepository
  >
  let positionPerformanceRepository: ReturnType<
    typeof createFakePositionPerformanceRepository
  >

  beforeEach(() => {
    positionRepository = createFakePositionRepository()
    portfolioRepository = createFakePortfolioRepository()
    positionPerformanceRepository =
      createFakePositionPerformanceRepository()
  })

  describe("execute", () => {
    it("should chain the daily returns of the window when several snapshots fall inside it", async () => {
      const position = await positionRepository.save(
        buildPosition({
          id: buildEntityId(POSITION_ID),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          fundId: buildEntityId("fund-1"),
        })
      )
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(PORTFOLIO_ID),
          userId: buildEntityId(USER_ID),
        })
      )
      await positionPerformanceRepository.save(
        buildPositionPerformance({
          positionId: buildEntityId(POSITION_ID),
          date: new Date("2026-01-05T00:00:00.000Z"),
          returnDaily: buildSignedPercentage("1"),
        })
      )
      await positionPerformanceRepository.save(
        buildPositionPerformance({
          positionId: buildEntityId(POSITION_ID),
          date: new Date("2026-01-10T00:00:00.000Z"),
          returnDaily: buildSignedPercentage("1"),
        })
      )
      const useCase = new ResolvePositionPeriodReturnsUseCase(
        positionRepository,
        portfolioRepository,
        positionPerformanceRepository
      )

      const response = await useCase.execute({
        positionId: position.id!,
        userId: USER_ID,
        from: FROM,
        to: TO,
      })

      expect(response).toEqual({
        yearReturn: "2.01",
        monthReturn: "2.01",
        periodReturn: "2.01",
      })
    })

    it("should fall back to the stored trailing returns when the window holds a single snapshot", async () => {
      const position = await positionRepository.save(
        buildPosition({
          id: buildEntityId(POSITION_ID),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          fundId: buildEntityId("fund-1"),
        })
      )
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(PORTFOLIO_ID),
          userId: buildEntityId(USER_ID),
        })
      )
      await positionPerformanceRepository.save(
        buildPositionPerformance({
          positionId: buildEntityId(POSITION_ID),
          date: new Date("2025-12-15T00:00:00.000Z"),
          returnDaily: buildSignedPercentage("5"),
        })
      )
      await positionPerformanceRepository.save(
        buildPositionPerformance({
          positionId: buildEntityId(POSITION_ID),
          date: new Date("2026-01-10T00:00:00.000Z"),
          returnDaily: buildSignedPercentage("0.5"),
          returnMonthly: buildSignedPercentage("3.25"),
          returnYearly: buildSignedPercentage("12.50"),
        })
      )
      const useCase = new ResolvePositionPeriodReturnsUseCase(
        positionRepository,
        portfolioRepository,
        positionPerformanceRepository
      )

      const response = await useCase.execute({
        positionId: position.id!,
        userId: USER_ID,
        from: FROM,
        to: TO,
      })

      expect(response).toEqual({
        yearReturn: "12.5",
        monthReturn: "3.25",
        periodReturn: null,
      })
    })

    it("should return null for every horizon when the window holds no snapshot", async () => {
      const position = await positionRepository.save(
        buildPosition({
          id: buildEntityId(POSITION_ID),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          fundId: buildEntityId("fund-1"),
        })
      )
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(PORTFOLIO_ID),
          userId: buildEntityId(USER_ID),
        })
      )
      const useCase = new ResolvePositionPeriodReturnsUseCase(
        positionRepository,
        portfolioRepository,
        positionPerformanceRepository
      )

      const response = await useCase.execute({
        positionId: position.id!,
        userId: USER_ID,
        from: FROM,
        to: TO,
      })

      expect(response).toEqual({
        yearReturn: null,
        monthReturn: null,
        periodReturn: null,
      })
    })

    it("should throw NotFoundError when the position does not exist", async () => {
      const useCase = new ResolvePositionPeriodReturnsUseCase(
        positionRepository,
        portfolioRepository,
        positionPerformanceRepository
      )

      await expect(
        useCase.execute({
          positionId: POSITION_ID,
          userId: USER_ID,
          from: FROM,
          to: TO,
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw NotFoundError when the position was never persisted", async () => {
      const UNPERSISTED = buildPosition({
        portfolioId: buildEntityId(PORTFOLIO_ID),
        fundId: buildEntityId("fund-1"),
      })
      const READ_ONLY: IPosition = {
        ...positionRepository,
        async findById() {
          return UNPERSISTED
        },
      }
      const useCase = new ResolvePositionPeriodReturnsUseCase(
        READ_ONLY,
        portfolioRepository,
        positionPerformanceRepository
      )

      await expect(
        useCase.execute({
          positionId: POSITION_ID,
          userId: USER_ID,
          from: FROM,
          to: TO,
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw NotFoundError when the portfolio does not exist", async () => {
      const position = await positionRepository.save(
        buildPosition({
          id: buildEntityId(POSITION_ID),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          fundId: buildEntityId("fund-1"),
        })
      )
      const useCase = new ResolvePositionPeriodReturnsUseCase(
        positionRepository,
        portfolioRepository,
        positionPerformanceRepository
      )

      await expect(
        useCase.execute({
          positionId: position.id!,
          userId: USER_ID,
          from: FROM,
          to: TO,
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw NotFoundError when the portfolio belongs to another user", async () => {
      const position = await positionRepository.save(
        buildPosition({
          id: buildEntityId(POSITION_ID),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          fundId: buildEntityId("fund-1"),
        })
      )
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(PORTFOLIO_ID),
          userId: buildEntityId(OTHER_USER_ID),
        })
      )
      await positionPerformanceRepository.save(
        buildPositionPerformance({
          positionId: buildEntityId(POSITION_ID),
          date: new Date("2026-01-10T00:00:00.000Z"),
          returnDaily: buildSignedPercentage("1"),
        })
      )
      const useCase = new ResolvePositionPeriodReturnsUseCase(
        positionRepository,
        portfolioRepository,
        positionPerformanceRepository
      )

      await expect(
        useCase.execute({
          positionId: position.id!,
          userId: USER_ID,
          from: FROM,
          to: TO,
        })
      ).rejects.toThrow(NotFoundError)
    })
  })
})
