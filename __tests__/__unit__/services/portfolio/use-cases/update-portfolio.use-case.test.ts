import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { UpdatePortfolioUseCase } from "@/services/portfolio/use-cases/update-portfolio.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { createFakePortfolioRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPortfolio,
} from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

const ID = "00000000-0000-0000-0000-000000000003"

describe("services/portfolio/use-cases/update-portfolio.use-case", () => {
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
    it("should update the acronym when the payload provides one", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(ID) })
      )
      const useCase = new UpdatePortfolioUseCase(
        portfolioRepository
      )

      const response = await useCase.execute({
        portfolioId: saved.id!,
        acronym: "ME",
      })

      expect(response.acronym).toBe("ME")
      expect(
        (await portfolioRepository.findById(buildEntityId(ID)))
          ?.acronym
      ).toBe("ME")
    })

    it("should update the name when the payload provides one", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(ID) })
      )
      const useCase = new UpdatePortfolioUseCase(
        portfolioRepository
      )

      const response = await useCase.execute({
        portfolioId: saved.id!,
        name: "Carteira Reformada",
      })

      expect(response.name).toBe("Carteira Reformada")
      expect(
        (await portfolioRepository.findById(buildEntityId(ID)))
          ?.name
      ).toBe("Carteira Reformada")
    })

    it("should update the annual interest rate when the payload provides one", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(ID) })
      )
      const useCase = new UpdatePortfolioUseCase(
        portfolioRepository
      )

      const response = await useCase.execute({
        portfolioId: saved.id!,
        annualInterestRate: "13.75",
      })

      expect(response.annualInterestRate).toBe("13.75")
      expect(response.acronym).toBe("FIA")
    })

    it("should keep the untouched allocation bounds when the payload provides only the minimum", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(ID) })
      )
      const useCase = new UpdatePortfolioUseCase(
        portfolioRepository
      )

      const response = await useCase.execute({
        portfolioId: saved.id!,
        minAllocation: "6",
      })

      expect(response.minAllocation).toBe("6")
      expect(response.targetAllocation).toBe("12")
      expect(response.maxAllocation).toBe("20")
    })

    it("should keep the untouched allocation bounds when the payload provides only the target", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(ID) })
      )
      const useCase = new UpdatePortfolioUseCase(
        portfolioRepository
      )

      const response = await useCase.execute({
        portfolioId: saved.id!,
        targetAllocation: "15",
      })

      expect(response.minAllocation).toBe("5")
      expect(response.targetAllocation).toBe("15")
      expect(response.maxAllocation).toBe("20")
    })

    it("should keep the untouched allocation bounds when the payload provides only the maximum", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(ID) })
      )
      const useCase = new UpdatePortfolioUseCase(
        portfolioRepository
      )

      const response = await useCase.execute({
        portfolioId: saved.id!,
        maxAllocation: "25",
      })

      expect(response.minAllocation).toBe("5")
      expect(response.targetAllocation).toBe("12")
      expect(response.maxAllocation).toBe("25")
    })

    it("should update every allocation bound when the payload provides all three", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(ID) })
      )
      const useCase = new UpdatePortfolioUseCase(
        portfolioRepository
      )

      const response = await useCase.execute({
        portfolioId: saved.id!,
        minAllocation: "1",
        targetAllocation: "10",
        maxAllocation: "30",
      })

      expect(response.minAllocation).toBe("1")
      expect(response.targetAllocation).toBe("10")
      expect(response.maxAllocation).toBe("30")
    })

    it("should persist the unchanged values when the payload provides no field", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(ID) })
      )
      const useCase = new UpdatePortfolioUseCase(
        portfolioRepository
      )

      const response = await useCase.execute({
        portfolioId: saved.id!,
      })

      expect(response.acronym).toBe("FIA")
      expect(response.name).toBe(
        "Fundo de Investimento em Ações"
      )
      expect(response.annualInterestRate).toBe("10.5")
      expect(response.minAllocation).toBe("5")
      expect(response.targetAllocation).toBe("12")
      expect(response.maxAllocation).toBe("20")
    })

    it("should update the portfolio when the requesting user owns it", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(ID),
          userId: buildEntityId("user-1"),
        })
      )
      const useCase = new UpdatePortfolioUseCase(
        portfolioRepository
      )

      const response = await useCase.execute({
        portfolioId: saved.id!,
        userId: "user-1",
        name: "Minha Carteira",
      })

      expect(response.name).toBe("Minha Carteira")
    })

    it("should throw NotFoundError when the portfolio does not exist", async () => {
      const useCase = new UpdatePortfolioUseCase(
        portfolioRepository
      )

      await expect(
        useCase.execute({ portfolioId: ID, name: "Qualquer" })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw NotFoundError when the portfolio belongs to another user", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(ID),
          userId: buildEntityId("user-1"),
        })
      )
      const useCase = new UpdatePortfolioUseCase(
        portfolioRepository
      )

      await expect(
        useCase.execute({
          portfolioId: saved.id!,
          userId: "user-2",
          name: "Qualquer",
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should keep the stored name when the portfolio belongs to another user", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(ID),
          name: "Original",
          userId: buildEntityId("user-1"),
        })
      )
      const useCase = new UpdatePortfolioUseCase(
        portfolioRepository
      )

      await expect(
        useCase.execute({
          portfolioId: saved.id!,
          userId: "user-2",
          name: "Qualquer",
        })
      ).rejects.toThrow(NotFoundError)

      expect(
        (await portfolioRepository.findById(buildEntityId(ID)))
          ?.name
      ).toBe("Original")
    })
  })
})
