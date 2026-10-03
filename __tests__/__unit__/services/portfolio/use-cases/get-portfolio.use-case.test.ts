import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { GetPortfolioUseCase } from "@/services/portfolio/use-cases/get-portfolio.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakePortfolioRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPortfolio,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

const ID = "00000000-0000-0000-0000-000000000002"

describe("services/portfolio/use-cases/get-portfolio.use-case", () => {
  let portfolioRepository: ReturnType<
    typeof createFakePortfolioRepository
  >

  beforeEach(() => {
    useFixedClock()
    portfolioRepository = createFakePortfolioRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  describe("execute", () => {
    it("should map the stored portfolio when the portfolio exists", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(ID),
          acronym: "ME",
          name: "Meu Portfolio",
          userId: buildEntityId("user-7"),
        })
      )
      const useCase = new GetPortfolioUseCase(
        portfolioRepository
      )

      const response = await useCase.execute({
        portfolioId: saved.id!,
      })

      expect(response.id).toBe(ID)
      expect(response.acronym).toBe("ME")
      expect(response.name).toBe("Meu Portfolio")
      expect(response.userId).toBe("user-7")
    })

    it("should expose every percentage as a decimal string when the portfolio exists", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(ID),
          annualInterestRate: buildSignedPercentage("11.25"),
          minAllocation: buildSignedPercentage("3.5"),
          maxAllocation: buildSignedPercentage("30"),
          targetAllocation: buildSignedPercentage("15.75"),
        })
      )
      const useCase = new GetPortfolioUseCase(
        portfolioRepository
      )

      const response = await useCase.execute({
        portfolioId: saved.id!,
      })

      expect(response.annualInterestRate).toBe("11.25")
      expect(response.minAllocation).toBe("3.5")
      expect(response.maxAllocation).toBe("30")
      expect(response.targetAllocation).toBe("15.75")
    })

    it("should throw NotFoundError when the portfolio does not exist", async () => {
      const useCase = new GetPortfolioUseCase(
        portfolioRepository
      )

      await expect(
        useCase.execute({ portfolioId: ID })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw ValidationError when the portfolio id is blank", async () => {
      const useCase = new GetPortfolioUseCase(
        portfolioRepository
      )

      await expect(
        useCase.execute({ portfolioId: "  " })
      ).rejects.toThrow(ValidationError)
    })
  })
})
