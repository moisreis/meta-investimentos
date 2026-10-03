import { describe, it, expect, beforeEach } from "vitest"

import { CalculatePositionPerformanceUseCase } from "@/services/position-performance/use-cases/calculate-position-performance.use-case"
import type { Position } from "@domain/position/entities/position.entity"
import { NotFoundError } from "@errors/not-found.error"
import type { EntityId, PositiveMoney } from "@/value-objects"
import { createAllFakes } from "__tests__/__setup__/_fakes.setup"
import {
  buildApplication,
  buildCnpj,
  buildEntityId,
  buildFund,
  buildNorm,
  buildNormsPortfolios,
  buildPosition,
  buildPositionPerformance,
  buildPositiveMoney,
  buildQuotaPrice,
  buildQuota,
  buildQuotaQuantity,
  buildSignedPercentage,
  buildWithdrawal,
} from "__tests__/__setup__/_factories.setup"

const POSITION_ID = "00000000-0000-0000-0000-0000000000b1"
const PORTFOLIO_ID = "00000000-0000-0000-0000-0000000000a1"
const FUND_ID = "00000000-0000-0000-0000-0000000000f1"
const CATEGORY_ID = "00000000-0000-0000-0000-0000000000d1"
const NORM_ID = "00000000-0000-0000-0000-0000000000e1"
const OTHER_NORM_ID = "00000000-0000-0000-0000-0000000000e2"

const TARGET = new Date("2026-01-15T00:00:00.000Z")
const PREVIOUS = new Date("2026-01-14T00:00:00.000Z")
const MONTH_BEFORE = new Date("2025-12-15T00:00:00.000Z")

describe("services/position-performance/use-cases/calculate-position-performance.use-case", () => {
  let fakes: ReturnType<typeof createAllFakes>

  beforeEach(() => {
    fakes = createAllFakes()
  })

  function buildUseCase(): CalculatePositionPerformanceUseCase {
    return new CalculatePositionPerformanceUseCase(
      fakes.position,
      fakes.fund,
      fakes.quota,
      fakes.application,
      fakes.withdrawal,
      fakes.positionPerformance,
      fakes.norm,
      fakes.normsPortfolios
    )
  }

  async function seedFund(
    categoryId: EntityId | null = buildEntityId(CATEGORY_ID)
  ): Promise<void> {
    await fakes.fund.save(
      buildFund({
        id: buildEntityId(FUND_ID),
        cnpj: buildCnpj(),
        categoryId,
      })
    )
  }

  async function seedPosition(
    initialBalance: PositiveMoney | null = buildPositiveMoney(
      "10000.00"
    )
  ): Promise<Position> {
    return fakes.position.save(
      buildPosition({
        id: buildEntityId(POSITION_ID),
        portfolioId: buildEntityId(PORTFOLIO_ID),
        fundId: buildEntityId(FUND_ID),
        initialBalance,
        initialBalanceDate: new Date("2026-01-01T00:00:00.000Z"),
      })
    )
  }

  describe("execute", () => {
    it("should throw NotFoundError when the position does not exist", async () => {
      const useCase = buildUseCase()

      await expect(
        useCase.execute({
          positionId: POSITION_ID,
          date: TARGET.toISOString(),
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw NotFoundError when the fund does not exist", async () => {
      await seedPosition()
      const useCase = buildUseCase()

      await expect(
        useCase.execute({
          positionId: POSITION_ID,
          date: TARGET.toISOString(),
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should return null when the target date has no quota", async () => {
      await seedPosition()
      await seedFund()
      const useCase = buildUseCase()

      const response = await useCase.execute({
        positionId: POSITION_ID,
        date: TARGET.toISOString(),
      })

      expect(response).toBeNull()
      expect(
        await fakes.positionPerformance.findAllByPositionId(
          buildEntityId(POSITION_ID)
        )
      ).toEqual([])
    })

    it("should return null when the position holds no quota", async () => {
      await seedPosition()
      await seedFund()
      await fakes.quota.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: TARGET,
          price: buildQuotaPrice("2.00"),
        })
      )
      const useCase = buildUseCase()

      const response = await useCase.execute({
        positionId: POSITION_ID,
        date: TARGET.toISOString(),
      })

      expect(response).toBeNull()
      expect(
        await fakes.positionPerformance.findAllByPositionId(
          buildEntityId(POSITION_ID)
        )
      ).toEqual([])
    })

    it("should persist the snapshot built from the previous one when the day closes", async () => {
      await seedPosition()
      await seedFund()
      await fakes.quota.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: PREVIOUS,
          price: buildQuotaPrice("1.90"),
        })
      )
      await fakes.quota.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: TARGET,
          price: buildQuotaPrice("2.00"),
        })
      )
      await fakes.positionPerformance.save(
        buildPositionPerformance({
          positionId: buildEntityId(POSITION_ID),
          date: PREVIOUS,
          quotasHeld: buildQuotaQuantity("1000.00"),
          patrimony: buildPositiveMoney("1900.00"),
          allocation: buildSignedPercentage("40"),
        })
      )
      const useCase = buildUseCase()

      const response = await useCase.execute({
        positionId: POSITION_ID,
        date: TARGET.toISOString(),
      })

      expect(response?.positionId).toBe(POSITION_ID)
      expect(response?.date).toBe(TARGET.toISOString())
      expect(response?.quotasHeld).toBe("1000")
      expect(response?.patrimony).toBe("2000")
      expect(response?.earnings).toBe("100")
      expect(response?.returnDaily).toBe("5.26")
      expect(response?.applicationTotal).toBe("0")
      expect(response?.redemptionTotal).toBe("0")
      expect(response?.cashFlowNet).toBe("0")
      expect(response?.allocation).toBe("40")

      const stored =
        await fakes.positionPerformance.findByPositionIdAndDate(
          buildEntityId(POSITION_ID),
          TARGET
        )

      expect(stored).not.toBeNull()
      expect(stored?.quotasHeld.value.toString()).toBe("1000")
    })

    it("should return null for the trailing horizons when the window holds a single quota", async () => {
      await seedPosition()
      await seedFund()
      await fakes.quota.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: TARGET,
          price: buildQuotaPrice("2.00"),
        })
      )
      await fakes.positionPerformance.save(
        buildPositionPerformance({
          positionId: buildEntityId(POSITION_ID),
          date: PREVIOUS,
          quotasHeld: buildQuotaQuantity("1000.00"),
          patrimony: buildPositiveMoney("1900.00"),
        })
      )
      const useCase = buildUseCase()

      const response = await useCase.execute({
        positionId: POSITION_ID,
        date: TARGET.toISOString(),
      })

      expect(response?.returnMonthly).toBeNull()
      expect(response?.returnYearly).toBeNull()
      expect(response?.returnLast12m).toBeNull()
    })

    it("should chain the quota prices of the window into the trailing returns", async () => {
      await seedPosition()
      await seedFund()
      await fakes.quota.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: PREVIOUS,
          price: buildQuotaPrice("1.90"),
        })
      )
      await fakes.quota.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: TARGET,
          price: buildQuotaPrice("2.00"),
        })
      )
      await fakes.quota.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: MONTH_BEFORE,
          price: buildQuotaPrice("1.80"),
        })
      )
      await fakes.positionPerformance.save(
        buildPositionPerformance({
          positionId: buildEntityId(POSITION_ID),
          date: PREVIOUS,
          quotasHeld: buildQuotaQuantity("1000.00"),
          patrimony: buildPositiveMoney("1900.00"),
        })
      )
      const useCase = buildUseCase()

      const response = await useCase.execute({
        positionId: POSITION_ID,
        date: TARGET.toISOString(),
      })

      expect(response?.returnMonthly).toBe("11.11")
      expect(response?.returnYearly).toBe("11.11")
      expect(response?.returnLast12m).toBe("11.11")
    })

    it("should add the day movements to the held quotas when closing the day", async () => {
      await seedPosition()
      await seedFund()
      await fakes.quota.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: PREVIOUS,
          price: buildQuotaPrice("1.90"),
        })
      )
      await fakes.quota.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: TARGET,
          price: buildQuotaPrice("2.00"),
        })
      )
      await fakes.positionPerformance.save(
        buildPositionPerformance({
          positionId: buildEntityId(POSITION_ID),
          date: PREVIOUS,
          quotasHeld: buildQuotaQuantity("1000.00"),
          patrimony: buildPositiveMoney("1900.00"),
        })
      )
      await fakes.application.save(
        buildApplication({
          positionId: buildEntityId(POSITION_ID),
          date: TARGET,
          amount: buildPositiveMoney("1000.00"),
          quotas: buildQuotaQuantity("200.00"),
        })
      )
      await fakes.withdrawal.save(
        buildWithdrawal({
          positionId: buildEntityId(POSITION_ID),
          date: TARGET,
          amount: buildPositiveMoney("500.00"),
          quotas: buildQuotaQuantity("100.00"),
        })
      )
      const useCase = buildUseCase()

      const response = await useCase.execute({
        positionId: POSITION_ID,
        date: TARGET.toISOString(),
      })

      expect(response?.quotasHeld).toBe("1100")
      expect(response?.patrimony).toBe("2200")
      expect(response?.applicationTotal).toBe("1000")
      expect(response?.redemptionTotal).toBe("500")
      expect(response?.cashFlowNet).toBe("500")
      expect(response?.earnings).toBe("-200")
      expect(response?.returnDaily).toBe("-10.53")
    })

    it("should report a zero daily return and allocation when no snapshot precedes the day", async () => {
      await seedPosition()
      await seedFund()
      await fakes.quota.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: TARGET,
          price: buildQuotaPrice("2.00"),
        })
      )
      await fakes.application.save(
        buildApplication({
          positionId: buildEntityId(POSITION_ID),
          date: TARGET,
          amount: buildPositiveMoney("1000.00"),
          quotas: buildQuotaQuantity("500.00"),
        })
      )
      const useCase = buildUseCase()

      const response = await useCase.execute({
        positionId: POSITION_ID,
        date: TARGET.toISOString(),
      })

      expect(response?.quotasHeld).toBe("500")
      expect(response?.patrimony).toBe("1000")
      expect(response?.earnings).toBe("-10000")
      expect(response?.returnDaily).toBe("0")
      expect(response?.allocation).toBe("0")
    })

    it("should read the initial balance from the position when it has none", async () => {
      await seedPosition(null)
      await seedFund()
      await fakes.quota.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: TARGET,
          price: buildQuotaPrice("2.00"),
        })
      )
      await fakes.application.save(
        buildApplication({
          positionId: buildEntityId(POSITION_ID),
          date: TARGET,
          amount: buildPositiveMoney("1000.00"),
          quotas: buildQuotaQuantity("500.00"),
        })
      )
      const useCase = buildUseCase()

      const response = await useCase.execute({
        positionId: POSITION_ID,
        date: TARGET.toISOString(),
      })

      expect(response?.earnings).toBe("0")
    })

    it("should resolve the allocation from the norm of the category", async () => {
      await seedPosition()
      await seedFund()
      await fakes.quota.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: TARGET,
          price: buildQuotaPrice("2.00"),
        })
      )
      await fakes.positionPerformance.save(
        buildPositionPerformance({
          positionId: buildEntityId(POSITION_ID),
          date: PREVIOUS,
          quotasHeld: buildQuotaQuantity("1000.00"),
          patrimony: buildPositiveMoney("1900.00"),
          allocation: buildSignedPercentage("40"),
        })
      )
      await fakes.norm.save(
        buildNorm({
          id: buildEntityId(NORM_ID),
          categoryId: buildEntityId(CATEGORY_ID),
          targetAllocation: buildSignedPercentage("15"),
        })
      )
      await fakes.normsPortfolios.save(
        buildNormsPortfolios({
          normId: buildEntityId(NORM_ID),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          targetAllocation: buildSignedPercentage("15"),
        })
      )
      const useCase = buildUseCase()

      const response = await useCase.execute({
        positionId: POSITION_ID,
        date: TARGET.toISOString(),
      })

      expect(response?.allocation).toBe("15")
    })

    it("should keep the previous allocation when the fund has no category", async () => {
      await seedPosition()
      await seedFund(null)
      await fakes.quota.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: TARGET,
          price: buildQuotaPrice("2.00"),
        })
      )
      await fakes.positionPerformance.save(
        buildPositionPerformance({
          positionId: buildEntityId(POSITION_ID),
          date: PREVIOUS,
          quotasHeld: buildQuotaQuantity("1000.00"),
          patrimony: buildPositiveMoney("1900.00"),
          allocation: buildSignedPercentage("45"),
        })
      )
      const useCase = buildUseCase()

      const response = await useCase.execute({
        positionId: POSITION_ID,
        date: TARGET.toISOString(),
      })

      expect(response?.allocation).toBe("45")
    })

    it("should keep the previous allocation when no norm relation matches the category", async () => {
      await seedPosition()
      await seedFund()
      await fakes.quota.save(
        buildQuota({
          fundId: buildEntityId(FUND_ID),
          date: TARGET,
          price: buildQuotaPrice("2.00"),
        })
      )
      await fakes.positionPerformance.save(
        buildPositionPerformance({
          positionId: buildEntityId(POSITION_ID),
          date: PREVIOUS,
          quotasHeld: buildQuotaQuantity("1000.00"),
          patrimony: buildPositiveMoney("1900.00"),
          allocation: buildSignedPercentage("45"),
        })
      )
      await fakes.normsPortfolios.save(
        buildNormsPortfolios({
          normId: buildEntityId(OTHER_NORM_ID),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          targetAllocation: buildSignedPercentage("15"),
        })
      )
      const useCase = buildUseCase()

      const response = await useCase.execute({
        positionId: POSITION_ID,
        date: TARGET.toISOString(),
      })

      expect(response?.allocation).toBe("45")
    })
  })
})
