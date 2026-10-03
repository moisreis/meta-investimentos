import { describe, it, expect, beforeEach } from "vitest"

import { DeletePortfolioUseCase } from "@/services/portfolio/use-cases/delete-portfolio.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakePortfolioRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPortfolio,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"

describe("services/portfolio/use-cases/delete-portfolio.use-case", () => {
  let portfolioRepository: ReturnType<
    typeof createFakePortfolioRepository
  >

  beforeEach(() => {
    portfolioRepository = createFakePortfolioRepository()
  })

  describe("execute", () => {
    it("should remove the row when the portfolio exists", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(ID) })
      )
      const useCase = new DeletePortfolioUseCase(
        portfolioRepository
      )

      await useCase.execute({ portfolioId: saved.id! })

      expect(
        await portfolioRepository.findById(saved.id!)
      ).toBeNull()
    })

    it("should throw NotFoundError when the portfolio does not exist", async () => {
      const useCase = new DeletePortfolioUseCase(
        portfolioRepository
      )

      await expect(
        useCase.execute({ portfolioId: ID })
      ).rejects.toThrow(NotFoundError)
    })

    it("should remove the row when the requesting user owns the portfolio", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(ID),
          userId: buildEntityId("user-1"),
        })
      )
      const useCase = new DeletePortfolioUseCase(
        portfolioRepository
      )

      await useCase.execute({
        portfolioId: saved.id!,
        userId: "user-1",
      })

      expect(
        await portfolioRepository.findById(saved.id!)
      ).toBeNull()
    })

    it("should throw NotFoundError when the portfolio belongs to another user", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(ID),
          userId: buildEntityId("user-1"),
        })
      )
      const useCase = new DeletePortfolioUseCase(
        portfolioRepository
      )

      await expect(
        useCase.execute({
          portfolioId: saved.id!,
          userId: "user-2",
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should keep the row when the portfolio belongs to another user", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId(ID),
          userId: buildEntityId("user-1"),
        })
      )
      const useCase = new DeletePortfolioUseCase(
        portfolioRepository
      )

      await expect(
        useCase.execute({
          portfolioId: saved.id!,
          userId: "user-2",
        })
      ).rejects.toThrow(NotFoundError)

      expect(
        await portfolioRepository.findById(saved.id!)
      ).not.toBeNull()
    })

    it("should leave the other rows untouched when the portfolio exists", async () => {
      const target = await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(ID) })
      )
      const other = await portfolioRepository.save(
        buildPortfolio({
          id: buildEntityId("portfolio-2"),
          acronym: "FII",
        })
      )
      const useCase = new DeletePortfolioUseCase(
        portfolioRepository
      )

      await useCase.execute({ portfolioId: target.id! })

      expect(
        await portfolioRepository.findById(other.id!)
      ).not.toBeNull()
    })

    it("should throw ValidationError when the portfolio id is blank", async () => {
      const useCase = new DeletePortfolioUseCase(
        portfolioRepository
      )

      await expect(
        useCase.execute({ portfolioId: "  " })
      ).rejects.toThrow(ValidationError)
    })
  })
})
