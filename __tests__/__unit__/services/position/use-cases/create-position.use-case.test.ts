import { describe, it, expect, beforeEach } from "vitest"

import { CreatePositionUseCase } from "@/services/position/use-cases/create-position.use-case"
import { ValidationError } from "@errors/validation.error"
import { createFakePositionRepository } from "__tests__/__setup__/_fakes.setup"
import { buildEntityId } from "__tests__/__setup__/_factories.setup"

const PORTFOLIO_ID = "00000000-0000-0000-0000-0000000000a1"
const FUND_ID = "00000000-0000-0000-0000-0000000000b2"

describe("services/position/use-cases/create-position.use-case", () => {
  let positionRepository: ReturnType<
    typeof createFakePositionRepository
  >

  beforeEach(() => {
    positionRepository = createFakePositionRepository()
  })

  describe("execute", () => {
    it("should return the mapped payload when creating a position", async () => {
      const useCase = new CreatePositionUseCase(
        positionRepository
      )

      const response = await useCase.execute({
        portfolioId: PORTFOLIO_ID,
        fundId: FUND_ID,
        initialBalance: "12345.678",
        initialBalanceDate: "2026-01-01T00:00:00.000Z",
        allocation: "40",
      })

      expect(response.portfolioId).toBe(PORTFOLIO_ID)
      expect(response.fundId).toBe(FUND_ID)
      expect(response.initialBalance).toBe("12345.68")
      expect(response.initialBalanceDate).toBe(
        "2026-01-01T00:00:00.000Z"
      )
      expect(response.allocation).toBe("40")
      expect(response.version).toBe(0)
      expect(response.id).toBeDefined()
    })

    it("should store the position under its portfolio and fund key when creating a position", async () => {
      const useCase = new CreatePositionUseCase(
        positionRepository
      )

      await useCase.execute({
        portfolioId: PORTFOLIO_ID,
        fundId: FUND_ID,
      })

      const stored =
        await positionRepository.findByPortfolioIdAndFundId(
          buildEntityId(PORTFOLIO_ID),
          buildEntityId(FUND_ID)
        )

      expect(stored).not.toBeNull()
      expect(stored?.allocation.value.toString()).toBe("100")
    })

    it("should default the allocation to the full share when the payload omits it", async () => {
      const useCase = new CreatePositionUseCase(
        positionRepository
      )

      const response = await useCase.execute({
        portfolioId: PORTFOLIO_ID,
        fundId: FUND_ID,
      })

      expect(response.allocation).toBe("100")
    })

    it("should map the initial balance to null when the payload omits it", async () => {
      const useCase = new CreatePositionUseCase(
        positionRepository
      )

      const response = await useCase.execute({
        portfolioId: PORTFOLIO_ID,
        fundId: FUND_ID,
      })

      expect(response.initialBalance).toBeNull()
      expect(response.initialBalanceDate).toBeNull()
    })

    it("should store exactly one row when creating a position", async () => {
      const useCase = new CreatePositionUseCase(
        positionRepository
      )

      await useCase.execute({
        portfolioId: PORTFOLIO_ID,
        fundId: FUND_ID,
      })

      const stored =
        await positionRepository.findAllByPortfolioId(
          buildEntityId(PORTFOLIO_ID)
        )

      expect(stored.length).toBe(1)
    })

    it("should throw ValidationError when the portfolio id is blank", async () => {
      const useCase = new CreatePositionUseCase(
        positionRepository
      )

      await expect(
        useCase.execute({
          portfolioId: "   ",
          fundId: FUND_ID,
        })
      ).rejects.toThrow(ValidationError)
    })

    it("should throw ValidationError when the allocation is not a number", async () => {
      const useCase = new CreatePositionUseCase(
        positionRepository
      )

      await expect(
        useCase.execute({
          portfolioId: PORTFOLIO_ID,
          fundId: FUND_ID,
          allocation: "abc",
        })
      ).rejects.toThrow(ValidationError)
    })
  })
})
