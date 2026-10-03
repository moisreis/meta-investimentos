import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"

import { AddApplicationUseCase } from "@/services/application/use-cases/add-application.use-case"
import { CreateApplicationUseCase } from "@/services/application/use-cases/create-application.use-case"
import { CreatePositionUseCase } from "@/services/position/use-cases/create-position.use-case"
import { RedistributePositionAllocationUseCase } from "@/services/position/use-cases/redistribute-position-allocation.use-case"
import { ApplicationRepository } from "@/infrastructure/application/repositories/application.repository"
import { PositionRepository } from "@/infrastructure/position/repositories/position.repository"
import { QuotaRepository } from "@/infrastructure/quota/repositories/quota.repository"
import { NotFoundError } from "@/errors/not-found.error"
import { EntityId } from "@/value-objects"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import {
  seedFund,
  seedPortfolio,
  seedQuota,
  seedPosition,
} from "__tests__/__setup__/_seeds.setup"
import { buildQuotaPrice } from "__tests__/__setup__/_factories.setup"

const DATE = new Date("2026-01-15T00:00:00.000Z")
const DATE_ONLY = "2026-01-15"

describe("services/application/use-cases/add-application.use-case", () => {
  let db: ReturnType<typeof getTestDb>
  let applicationRepository: ApplicationRepository
  let positionRepository: PositionRepository
  let quotaRepository: QuotaRepository
  let useCase: AddApplicationUseCase

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()

    applicationRepository = new ApplicationRepository(db)
    positionRepository = new PositionRepository(db)
    quotaRepository = new QuotaRepository(db)

    useCase = new AddApplicationUseCase(
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
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("execute", () => {
    it("should open the position and record the application when the portfolio does not hold the fund", async () => {
      const portfolio = await seedPortfolio(db)
      const fund = await seedFund(db)
      await seedQuota(db, {
        fundId: fund.id,
        date: DATE,
        price: buildQuotaPrice("10.50"),
      })

      const response = await useCase.execute({
        portfolioId: portfolio.id,
        fundId: fund.id,
        date: DATE_ONLY,
        amount: "1000.00",
      })

      const position =
        await positionRepository.findByPortfolioIdAndFundId(
          portfolio.id,
          fund.id
        )

      expect(position).not.toBeNull()
      expect(response.positionId).toBe(position!.id)
    })

    it("should derive the quotas from the quota price of the date when recording", async () => {
      const portfolio = await seedPortfolio(db)
      const fund = await seedFund(db)
      await seedQuota(db, {
        fundId: fund.id,
        date: DATE,
        price: buildQuotaPrice("10.50"),
      })

      const response = await useCase.execute({
        portfolioId: portfolio.id,
        fundId: fund.id,
        date: DATE_ONLY,
        amount: "1000.00",
      })

      expect(response.quotas).toBe("95.238095")
      expect(response.amount).toBe("1000")
    })

    it("should reuse the existing position when the portfolio already holds the fund", async () => {
      const portfolio = await seedPortfolio(db)
      const fund = await seedFund(db)
      await seedPosition(db, {
        portfolioId: portfolio.id,
        fundId: fund.id,
      })
      await seedQuota(db, {
        fundId: fund.id,
        date: DATE,
        price: buildQuotaPrice("10.50"),
      })

      await useCase.execute({
        portfolioId: portfolio.id,
        fundId: fund.id,
        date: DATE_ONLY,
        amount: "1000.00",
      })

      const positions =
        await positionRepository.findAllByPortfolioId(
          portfolio.id
        )

      expect(positions.length).toBe(1)
    })

    it("should keep every allocation at one hundred when the portfolio opens its first position", async () => {
      const portfolio = await seedPortfolio(db)
      const fund = await seedFund(db)
      await seedQuota(db, {
        fundId: fund.id,
        date: DATE,
        price: buildQuotaPrice("10.50"),
      })

      await useCase.execute({
        portfolioId: portfolio.id,
        fundId: fund.id,
        date: DATE_ONLY,
        amount: "1000.00",
      })

      const position =
        await positionRepository.findByPortfolioIdAndFundId(
          portfolio.id,
          fund.id
        )

      expect(position!.allocation.value.toFixed(2)).toBe(
        "100.00"
      )
    })

    it("should split the portfolio evenly when a second fund is added", async () => {
      const portfolio = await seedPortfolio(db)
      const first = await seedFund(db)
      const second = await seedFund(db)
      await seedPosition(db, {
        portfolioId: portfolio.id,
        fundId: first.id,
      })
      await seedQuota(db, {
        fundId: second.id,
        date: DATE,
        price: buildQuotaPrice("10.50"),
      })

      await useCase.execute({
        portfolioId: portfolio.id,
        fundId: second.id,
        date: DATE_ONLY,
        amount: "1000.00",
      })

      const positions =
        await positionRepository.findAllByPortfolioId(
          portfolio.id
        )
      const ALLOCATIONS = positions.map((position) =>
        position.allocation.value.toFixed(2)
      )

      expect(positions.length).toBe(2)
      expect(ALLOCATIONS).toEqual(["50.00", "50.00"])
    })

    it("should throw NotFoundError when the date has no quota price", async () => {
      const portfolio = await seedPortfolio(db)
      const fund = await seedFund(db)

      await expect(
        useCase.execute({
          portfolioId: portfolio.id,
          fundId: fund.id,
          date: DATE_ONLY,
          amount: "1000.00",
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should persist exactly one application row when recording", async () => {
      const portfolio = await seedPortfolio(db)
      const fund = await seedFund(db)
      await seedQuota(db, {
        fundId: fund.id,
        date: DATE,
        price: buildQuotaPrice("10.50"),
      })

      const response = await useCase.execute({
        portfolioId: portfolio.id,
        fundId: fund.id,
        date: DATE_ONLY,
        amount: "1000.00",
      })

      const stored = await applicationRepository.findById(
        EntityId.create(response.id)
      )

      expect(stored).not.toBeNull()
    })
  })
})
