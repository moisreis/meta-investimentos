import { describe, it, expect, beforeEach } from "vitest"

import { ListPortfolioRowSummariesUseCase } from "@/services/portfolio/use-cases/list-portfolio-row-summaries.use-case"
import {
  createFakeBankAccountRepository,
  createFakePositionRepository,
} from "__tests__/__setup__/_fakes.setup"
import {
  buildBankAccount,
  buildEntityId,
  buildPosition,
} from "__tests__/__setup__/_factories.setup"

describe("services/portfolio/use-cases/list-portfolio-row-summaries.use-case", () => {
  let positionRepository: ReturnType<
    typeof createFakePositionRepository
  >
  let bankAccountRepository: ReturnType<
    typeof createFakeBankAccountRepository
  >

  beforeEach(() => {
    positionRepository = createFakePositionRepository()
    bankAccountRepository = createFakeBankAccountRepository()
  })

  describe("execute", () => {
    it("should count the funds and the bank accounts of each portfolio when both hold rows", async () => {
      await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId("pf-1"),
          fundId: buildEntityId("fund-1"),
        })
      )
      await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId("pf-1"),
          fundId: buildEntityId("fund-2"),
        })
      )
      await bankAccountRepository.save(
        buildBankAccount({
          portfolioId: buildEntityId("pf-1"),
        })
      )
      const useCase = new ListPortfolioRowSummariesUseCase(
        positionRepository,
        bankAccountRepository
      )

      const response = await useCase.execute({
        portfolioIds: ["pf-1"],
      })

      expect(response.length).toBe(1)
      expect(response[0].portfolioId).toBe("pf-1")
      expect(response[0].fundCount).toBe(2)
      expect(response[0].bankAccountCount).toBe(1)
    })

    it("should report a zero bank account count when the portfolio holds no bank account", async () => {
      await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId("pf-1"),
          fundId: buildEntityId("fund-1"),
        })
      )
      const useCase = new ListPortfolioRowSummariesUseCase(
        positionRepository,
        bankAccountRepository
      )

      const response = await useCase.execute({
        portfolioIds: ["pf-1"],
      })

      expect(response[0].fundCount).toBe(1)
      expect(response[0].bankAccountCount).toBe(0)
    })

    it("should report a zero fund count when the portfolio holds no position", async () => {
      await bankAccountRepository.save(
        buildBankAccount({
          portfolioId: buildEntityId("pf-1"),
        })
      )
      const useCase = new ListPortfolioRowSummariesUseCase(
        positionRepository,
        bankAccountRepository
      )

      const response = await useCase.execute({
        portfolioIds: ["pf-1"],
      })

      expect(response[0].fundCount).toBe(0)
      expect(response[0].bankAccountCount).toBe(1)
    })

    it("should return one summary per portfolio when several portfolios hold rows", async () => {
      await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId("pf-1"),
          fundId: buildEntityId("fund-1"),
        })
      )
      await bankAccountRepository.save(
        buildBankAccount({
          portfolioId: buildEntityId("pf-2"),
        })
      )
      const useCase = new ListPortfolioRowSummariesUseCase(
        positionRepository,
        bankAccountRepository
      )

      const response = await useCase.execute({
        portfolioIds: ["pf-1", "pf-2"],
      })

      expect(response.length).toBe(2)
      expect(
        response.map((row) => row.portfolioId).sort()
      ).toEqual(["pf-1", "pf-2"])
    })

    it("should return an empty list when no portfolio holds rows", async () => {
      const useCase = new ListPortfolioRowSummariesUseCase(
        positionRepository,
        bankAccountRepository
      )

      const response = await useCase.execute({
        portfolioIds: ["pf-1"],
      })

      expect(response).toEqual([])
    })

    it("should return an empty list when the portfolio id list is empty", async () => {
      await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId("pf-1"),
          fundId: buildEntityId("fund-1"),
        })
      )
      const useCase = new ListPortfolioRowSummariesUseCase(
        positionRepository,
        bankAccountRepository
      )

      const response = await useCase.execute({
        portfolioIds: [],
      })

      expect(response).toEqual([])
    })
  })
})
