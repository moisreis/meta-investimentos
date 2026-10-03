import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { CalculatePortfolioPerformanceUseCase } from "@/services/portfolio-performance/use-cases/calculate-portfolio-performance.use-case"
import { CalculatePositionPerformanceUseCase } from "@/services/position-performance/use-cases/calculate-position-performance.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import {
  createFakeApplicationRepository,
  createFakeFundRepository,
  createFakeNormsPortfoliosRepository,
  createFakeNormRepository,
  createFakePortfolioPerformanceRepository,
  createFakePortfolioRepository,
  createFakePositionPerformanceRepository,
  createFakePositionRepository,
  createFakeQuotaRepository,
  createFakeWithdrawalRepository,
} from "__tests__/__setup__/_fakes.setup"
import {
  buildApplication,
  buildEntityId,
  buildFund,
  buildPortfolio,
  buildPortfolioPerformance,
  buildPositiveMoney,
  buildPosition,
  buildPositionPerformance,
  buildQuota,
  buildQuotaPrice,
  buildQuotaQuantity,
  buildSignedPercentage,
  buildUniqueCnpj,
  buildWithdrawal,
} from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

const TARGET_DATE = new Date("2026-01-15T00:00:00.000Z")
const PREVIOUS_DATE = new Date("2026-01-14T00:00:00.000Z")
const DATE_INPUT = "2026-01-15T00:00:00.000Z"

describe("services/portfolio-performance/use-cases/calculate-portfolio-performance.use-case", () => {
  let portfolioRepository: ReturnType<
    typeof createFakePortfolioRepository
  >
  let positionRepository: ReturnType<
    typeof createFakePositionRepository
  >
  let quotaRepository: ReturnType<
    typeof createFakeQuotaRepository
  >
  let applicationRepository: ReturnType<
    typeof createFakeApplicationRepository
  >
  let withdrawalRepository: ReturnType<
    typeof createFakeWithdrawalRepository
  >
  let positionPerformanceRepository: ReturnType<
    typeof createFakePositionPerformanceRepository
  >
  let portfolioPerformanceRepository: ReturnType<
    typeof createFakePortfolioPerformanceRepository
  >
  let fundRepository: ReturnType<typeof createFakeFundRepository>
  let useCase: CalculatePortfolioPerformanceUseCase

  beforeEach(() => {
    useFixedClock()
    portfolioRepository = createFakePortfolioRepository()
    positionRepository = createFakePositionRepository()
    quotaRepository = createFakeQuotaRepository()
    applicationRepository = createFakeApplicationRepository()
    withdrawalRepository = createFakeWithdrawalRepository()
    positionPerformanceRepository =
      createFakePositionPerformanceRepository()
    portfolioPerformanceRepository =
      createFakePortfolioPerformanceRepository()
    fundRepository = createFakeFundRepository()
    useCase = new CalculatePortfolioPerformanceUseCase(
      portfolioRepository,
      positionRepository,
      quotaRepository,
      applicationRepository,
      withdrawalRepository,
      positionPerformanceRepository,
      portfolioPerformanceRepository,
      new CalculatePositionPerformanceUseCase(
        positionRepository,
        fundRepository,
        quotaRepository,
        applicationRepository,
        withdrawalRepository,
        positionPerformanceRepository,
        createFakeNormRepository(),
        createFakeNormsPortfoliosRepository()
      )
    )
  })

  afterEach(() => {
    useRealClock()
  })

  describe("execute", () => {
    it("should throw NotFoundError when the portfolio does not exist", async () => {
      await expect(
        useCase.execute({
          portfolioId: "portfolio-1",
          date: DATE_INPUT,
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should persist a zeroed snapshot when the portfolio has no position", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
        })
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        date: DATE_INPUT,
      })

      expect(response?.quotasHeld).toBe("0")
      expect(response?.patrimony).toBe("0")
      expect(response?.applicationTotal).toBe("0")
      expect(response?.redemptionTotal).toBe("0")
      expect(response?.cashFlowNet).toBe("0")
      expect(response?.earnings).toBe("0")
      expect(response?.returnDaily).toBe("0")
      expect(response?.target).toBeNull()
    })

    it("should store the zeroed snapshot of the target date when the portfolio has no position", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
        })
      )

      await useCase.execute({
        portfolioId: "portfolio-1",
        date: DATE_INPUT,
      })

      const STORED =
        await portfolioPerformanceRepository.findByPortfolioIdAndDate(
          buildEntityId("portfolio-1"),
          TARGET_DATE
        )

      expect(STORED?.portfolioId).toBe("portfolio-1")
      expect(STORED?.patrimony.value.toFixed(2)).toBe("0.00")
    })

    it("should resolve only the target from the inflation rate when the portfolio has no position", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
          annualInterestRate: buildSignedPercentage("10.5"),
        })
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        date: DATE_INPUT,
        inflationRate: "0.44",
      })

      expect(response?.target).not.toBeNull()
      expect(response?.cumulativeTarget).toBeNull()
      expect(response?.inflationSpread).toBeNull()
    })

    it("should aggregate the position quotas and the day quotes when the portfolio holds a position", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
        })
      )
      await positionRepository.save(
        buildPosition({
          id: buildEntityId("position-1"),
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
          initialBalance: buildPositiveMoney("0"),
        })
      )
      await fundRepository.save(
        buildFund({ id: buildEntityId("fund-1") })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId("fund-1"),
          date: TARGET_DATE,
          price: buildQuotaPrice("10.00"),
        })
      )
      await applicationRepository.save(
        buildApplication({
          positionId: buildEntityId("position-1"),
          date: TARGET_DATE,
          amount: buildPositiveMoney("1000.00"),
          quotas: buildQuotaQuantity("100.00"),
        })
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        date: DATE_INPUT,
      })

      expect(response?.quotasHeld).toBe("100")
      expect(response?.patrimony).toBe("1000")
      expect(response?.applicationTotal).toBe("1000")
      expect(response?.redemptionTotal).toBe("0")
      expect(response?.cashFlowNet).toBe("1000")
      expect(response?.earnings).toBe("0")
      expect(response?.returnDaily).toBe("0")
    })

    it("should leave the trailing returns null when the portfolio has no earlier snapshot", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
        })
      )
      await positionRepository.save(
        buildPosition({
          id: buildEntityId("position-1"),
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
          initialBalance: buildPositiveMoney("0"),
        })
      )
      await fundRepository.save(
        buildFund({ id: buildEntityId("fund-1") })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId("fund-1"),
          date: TARGET_DATE,
          price: buildQuotaPrice("10.00"),
        })
      )
      await applicationRepository.save(
        buildApplication({
          positionId: buildEntityId("position-1"),
          date: TARGET_DATE,
          amount: buildPositiveMoney("1000.00"),
          quotas: buildQuotaQuantity("100.00"),
        })
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        date: DATE_INPUT,
      })

      expect(response?.returnMonthly).toBeNull()
      expect(response?.returnYearly).toBeNull()
      expect(response?.returnLast12m).toBeNull()
      expect(response?.inflationSpread).toBeNull()
      expect(response?.riskFreeSpread).toBeNull()
      expect(response?.marketSpread).toBeNull()
    })

    it("should subtract the redeemed quotas from the holdings when the portfolio redeems on the target day", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
        })
      )
      await positionRepository.save(
        buildPosition({
          id: buildEntityId("position-1"),
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
          initialBalance: buildPositiveMoney("0"),
        })
      )
      await fundRepository.save(
        buildFund({ id: buildEntityId("fund-1") })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId("fund-1"),
          date: TARGET_DATE,
          price: buildQuotaPrice("10.00"),
        })
      )
      await applicationRepository.save(
        buildApplication({
          positionId: buildEntityId("position-1"),
          date: TARGET_DATE,
          amount: buildPositiveMoney("1000.00"),
          quotas: buildQuotaQuantity("100.00"),
        })
      )
      await withdrawalRepository.save(
        buildWithdrawal({
          positionId: buildEntityId("position-1"),
          date: TARGET_DATE,
          amount: buildPositiveMoney("400.00"),
          quotas: buildQuotaQuantity("40.00"),
        })
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        date: DATE_INPUT,
      })

      expect(response?.quotasHeld).toBe("60")
      expect(response?.patrimony).toBe("600")
      expect(response?.redemptionTotal).toBe("400")
      expect(response?.cashFlowNet).toBe("600")
    })

    it("should return null when no fund of the portfolio publishes a quota for the target day", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
        })
      )
      await positionRepository.save(
        buildPosition({
          id: buildEntityId("position-1"),
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
          initialBalance: buildPositiveMoney("0"),
        })
      )
      await fundRepository.save(
        buildFund({ id: buildEntityId("fund-1") })
      )
      await applicationRepository.save(
        buildApplication({
          positionId: buildEntityId("position-1"),
          date: TARGET_DATE,
          amount: buildPositiveMoney("1000.00"),
          quotas: buildQuotaQuantity("100.00"),
        })
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        date: DATE_INPUT,
      })

      expect(response).toBeNull()
      expect(
        await portfolioPerformanceRepository.findAllByPortfolioId(
          buildEntityId("portfolio-1")
        )
      ).toEqual([])
    })

    it("should return null when the portfolio holds no quota on the target day", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
        })
      )
      await positionRepository.save(
        buildPosition({
          id: buildEntityId("position-1"),
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
          initialBalance: buildPositiveMoney("0"),
        })
      )
      await fundRepository.save(
        buildFund({ id: buildEntityId("fund-1") })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId("fund-1"),
          date: TARGET_DATE,
          price: buildQuotaPrice("10.00"),
        })
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        date: DATE_INPUT,
      })

      expect(response).toBeNull()
      expect(
        await portfolioPerformanceRepository.findAllByPortfolioId(
          buildEntityId("portfolio-1")
        )
      ).toEqual([])
    })

    it("should throw ValidationError when a position that holds quotas has no quote", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
        })
      )
      await positionRepository.save(
        buildPosition({
          id: buildEntityId("position-1"),
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
          initialBalance: buildPositiveMoney("0"),
        })
      )
      await positionRepository.save(
        buildPosition({
          id: buildEntityId("position-2"),
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-2"),
          initialBalance: buildPositiveMoney("0"),
        })
      )
      await fundRepository.save(
        buildFund({ id: buildEntityId("fund-1") })
      )
      await fundRepository.save(
        buildFund({
          id: buildEntityId("fund-2"),
          cnpj: buildUniqueCnpj("112223330002"),
        })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId("fund-1"),
          date: TARGET_DATE,
          price: buildQuotaPrice("10.00"),
        })
      )
      await applicationRepository.save(
        buildApplication({
          positionId: buildEntityId("position-2"),
          date: TARGET_DATE,
          amount: buildPositiveMoney("500.00"),
          quotas: buildQuotaQuantity("50.00"),
        })
      )

      await expect(
        useCase.execute({
          portfolioId: "portfolio-1",
          date: DATE_INPUT,
        })
      ).rejects.toThrow(ValidationError)
    })

    it("should carry the position balance forward when the target day has no movement", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
        })
      )
      await positionRepository.save(
        buildPosition({
          id: buildEntityId("position-1"),
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
          initialBalance: buildPositiveMoney("0"),
        })
      )
      await fundRepository.save(
        buildFund({ id: buildEntityId("fund-1") })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId("fund-1"),
          date: TARGET_DATE,
          price: buildQuotaPrice("11.00"),
        })
      )
      await positionPerformanceRepository.save(
        buildPositionPerformance({
          positionId: buildEntityId("position-1"),
          date: PREVIOUS_DATE,
          quotasHeld: buildQuotaQuantity("100.00"),
        })
      )
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-1"),
          date: PREVIOUS_DATE,
          patrimony: buildPositiveMoney("800.00"),
        })
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        date: DATE_INPUT,
      })

      expect(response?.quotasHeld).toBe("100")
      expect(response?.patrimony).toBe("1100")
      expect(response?.earnings).toBe("300")
    })

    it("should derive the daily return from the previous snapshot when one exists", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
        })
      )
      await positionRepository.save(
        buildPosition({
          id: buildEntityId("position-1"),
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
          initialBalance: buildPositiveMoney("0"),
        })
      )
      await fundRepository.save(
        buildFund({ id: buildEntityId("fund-1") })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId("fund-1"),
          date: TARGET_DATE,
          price: buildQuotaPrice("11.00"),
        })
      )
      await positionPerformanceRepository.save(
        buildPositionPerformance({
          positionId: buildEntityId("position-1"),
          date: PREVIOUS_DATE,
          quotasHeld: buildQuotaQuantity("100.00"),
        })
      )
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-1"),
          date: PREVIOUS_DATE,
          patrimony: buildPositiveMoney("800.00"),
        })
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        date: DATE_INPUT,
      })

      expect(response?.returnDaily).toBe("37.5")
    })

    it("should chain the trailing returns when the window holds at least two snapshots", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
        })
      )
      await positionRepository.save(
        buildPosition({
          id: buildEntityId("position-1"),
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
          initialBalance: buildPositiveMoney("0"),
        })
      )
      await fundRepository.save(
        buildFund({ id: buildEntityId("fund-1") })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId("fund-1"),
          date: TARGET_DATE,
          price: buildQuotaPrice("11.00"),
        })
      )
      await positionPerformanceRepository.save(
        buildPositionPerformance({
          positionId: buildEntityId("position-1"),
          date: PREVIOUS_DATE,
          quotasHeld: buildQuotaQuantity("100.00"),
        })
      )
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-1"),
          date: new Date("2025-12-20T00:00:00.000Z"),
          returnDaily: buildSignedPercentage("1"),
        })
      )
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-1"),
          date: new Date("2026-01-05T00:00:00.000Z"),
          returnDaily: buildSignedPercentage("2"),
        })
      )
      await portfolioPerformanceRepository.save(
        buildPortfolioPerformance({
          portfolioId: buildEntityId("portfolio-1"),
          date: PREVIOUS_DATE,
          patrimony: buildPositiveMoney("800.00"),
          returnDaily: buildSignedPercentage("0"),
        })
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        date: DATE_INPUT,
      })

      expect(response?.returnMonthly).toBe("3.02")
      expect(response?.returnYearly).toBe("3.02")
      expect(response?.returnLast12m).toBe("3.02")
    })

    it("should compute the benchmark spreads when the rates are provided", async () => {
      await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
          annualInterestRate: buildSignedPercentage("10.5"),
        })
      )
      await positionRepository.save(
        buildPosition({
          id: buildEntityId("position-1"),
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
          initialBalance: buildPositiveMoney("0"),
        })
      )
      await fundRepository.save(
        buildFund({ id: buildEntityId("fund-1") })
      )
      await quotaRepository.save(
        buildQuota({
          fundId: buildEntityId("fund-1"),
          date: TARGET_DATE,
          price: buildQuotaPrice("10.00"),
        })
      )
      await applicationRepository.save(
        buildApplication({
          positionId: buildEntityId("position-1"),
          date: TARGET_DATE,
          amount: buildPositiveMoney("1000.00"),
          quotas: buildQuotaQuantity("100.00"),
        })
      )

      const response = await useCase.execute({
        portfolioId: "portfolio-1",
        date: DATE_INPUT,
        inflationRate: "0.44",
        riskFreeRate: "0.10",
        marketRate: "1.50",
      })

      expect(response?.target).not.toBeNull()
      expect(response?.cumulativeTarget).toBe(response?.target)
      expect(response?.inflationSpread).toBe("-0.44")
      expect(response?.riskFreeSpread).toBe("-0.1")
      expect(response?.marketSpread).toBe("-1.5")
    })
  })
})
