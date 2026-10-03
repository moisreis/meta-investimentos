import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { AddApplicationUseCase } from "@/services/application/use-cases/add-application.use-case"
import { CreateApplicationUseCase } from "@/services/application/use-cases/create-application.use-case"
import { CreatePositionUseCase } from "@/services/position/use-cases/create-position.use-case"
import { RedistributePositionAllocationUseCase } from "@/services/position/use-cases/redistribute-position-allocation.use-case"
import { NotFoundError } from "@errors/not-found.error"
import {
  createFakeApplicationRepository,
  createFakePositionRepository,
  createFakeQuotaRepository,
} from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPosition,
  buildQuota,
  buildQuotaPrice,
} from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

const DATE = "2026-01-15"

describe("services/application/use-cases/add-application.use-case", () => {
  let applicationRepository: ReturnType<
    typeof createFakeApplicationRepository
  >
  let positionRepository: ReturnType<
    typeof createFakePositionRepository
  >
  let quotaRepository: ReturnType<
    typeof createFakeQuotaRepository
  >

  beforeEach(() => {
    useFixedClock()
    applicationRepository = createFakeApplicationRepository()
    positionRepository = createFakePositionRepository()
    quotaRepository = createFakeQuotaRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  // Wires the real collaborator use cases on top of the
  // fake repositories, so the only mocked boundary is
  // persistence.
  const buildUseCase = (): AddApplicationUseCase =>
    new AddApplicationUseCase(
      positionRepository,
      quotaRepository,
      new CreatePositionUseCase(positionRepository),
      new RedistributePositionAllocationUseCase(
        positionRepository
      ),
      new CreateApplicationUseCase(
        applicationRepository,
        positionRepository
      )
    )

  describe("execute", () => {
    it("should derive the quotas from the quota price of the application date", async () => {
      await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
        })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId("fund-1"),
          date: new Date(DATE),
          price: buildQuotaPrice("10.50"),
        })
      )
      const useCase = buildUseCase()

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        fundId: "fund-1",
        date: DATE,
        amount: "1000",
      })

      expect(response.quotas).toBe("95.238095")
      expect(response.amount).toBe("1000")
      expect(response.date).toBe("2026-01-15T00:00:00.000Z")
    })

    it("should reuse the existing position when the portfolio already holds the fund", async () => {
      const position = await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
        })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId("fund-1"),
          date: new Date(DATE),
          price: buildQuotaPrice("10.50"),
        })
      )
      const useCase = buildUseCase()

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        fundId: "fund-1",
        date: DATE,
        amount: "1050.00",
      })

      const positions =
        await positionRepository.findAllByPortfolioId(
          buildEntityId("portfolio-1")
        )

      expect(positions.length).toBe(1)
      expect(response.positionId).toBe(position.id)
    })

    it("should open a position holding the full allocation when the fund is not held yet", async () => {
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId("fund-1"),
          date: new Date(DATE),
          price: buildQuotaPrice("10.50"),
        })
      )
      const useCase = buildUseCase()

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        fundId: "fund-1",
        date: DATE,
        amount: "1050.00",
      })

      const positions =
        await positionRepository.findAllByPortfolioId(
          buildEntityId("portfolio-1")
        )

      expect(positions.length).toBe(1)
      expect(positions[0].fundId).toBe("fund-1")
      expect(positions[0].allocation.value.toFixed(2)).toBe(
        "100.00"
      )
      expect(response.positionId).toBe(positions[0].id)
    })

    it("should split the portfolio evenly when a new position joins it", async () => {
      await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-9"),
        })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId("fund-1"),
          date: new Date(DATE),
          price: buildQuotaPrice("10.50"),
        })
      )
      const useCase = buildUseCase()

      await useCase.execute({
        portfolioId: "portfolio-1",
        fundId: "fund-1",
        date: DATE,
        amount: "1050.00",
      })

      const positions =
        await positionRepository.findAllByPortfolioId(
          buildEntityId("portfolio-1")
        )

      expect(positions.length).toBe(2)
      expect(
        positions.map((position) =>
          position.allocation.value.toFixed(2)
        )
      ).toEqual(["50.00", "50.00"])
    })

    it("should persist the application with the derived quotas", async () => {
      await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
        })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId("fund-1"),
          date: new Date(DATE),
          price: buildQuotaPrice("10.50"),
        })
      )
      const useCase = buildUseCase()

      await useCase.execute({
        portfolioId: "portfolio-1",
        fundId: "fund-1",
        date: DATE,
        amount: "1050.00",
      })

      const stored =
        await applicationRepository.findAllByPositionId(
          buildEntityId("portfolio-1-fund-1")
        )

      expect(stored.length).toBe(1)
      expect(stored[0].quotas.value.toString()).toBe("100")
      expect(stored[0].amount.value.toString()).toBe("1050")
    })

    it("should throw NotFoundError when no quota price exists for the application date", async () => {
      await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
        })
      )
      const useCase = buildUseCase()

      await expect(
        useCase.execute({
          portfolioId: "portfolio-1",
          fundId: "fund-1",
          date: DATE,
          amount: "1000",
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should not persist an application when no quota price exists for the application date", async () => {
      await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
        })
      )
      const useCase = buildUseCase()

      await expect(
        useCase.execute({
          portfolioId: "portfolio-1",
          fundId: "fund-1",
          date: DATE,
          amount: "1000",
        })
      ).rejects.toThrow(NotFoundError)

      const stored =
        await applicationRepository.findAllByPositionId(
          buildEntityId("portfolio-1-fund-1")
        )

      expect(stored.length).toBe(0)
    })
  })
})
