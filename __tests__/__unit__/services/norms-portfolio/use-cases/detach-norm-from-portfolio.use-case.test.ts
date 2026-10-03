import { describe, it, expect, beforeEach } from "vitest"

import { DetachNormFromPortfolioUseCase } from "@/services/norms-portfolio/use-cases/detach-norm-from-portfolio.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakeNormsPortfoliosRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildNormsPortfolios,
} from "__tests__/__setup__/_factories.setup"

const NORM = "norm-1"
const PORTFOLIO = "portfolio-1"
const OTHER_NORM = "norm-2"

describe("services/norms-portfolio/use-cases/detach-norm-from-portfolio.use-case", () => {
  let normsPortfoliosRepository: ReturnType<
    typeof createFakeNormsPortfoliosRepository
  >

  beforeEach(() => {
    normsPortfoliosRepository =
      createFakeNormsPortfoliosRepository()
  })

  describe("execute", () => {
    it("should remove the relation when it exists", async () => {
      const saved = await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          normId: buildEntityId(NORM),
          portfolioId: buildEntityId(PORTFOLIO),
        })
      )
      const useCase = new DetachNormFromPortfolioUseCase(
        normsPortfoliosRepository
      )

      await useCase.execute({
        normId: NORM,
        portfolioId: PORTFOLIO,
      })

      expect(
        await normsPortfoliosRepository.findByNormIdAndPortfolioId(
          buildEntityId(NORM),
          buildEntityId(PORTFOLIO)
        )
      ).toBeNull()
      expect(
        await normsPortfoliosRepository.findAllByNormId(
          saved.normId
        )
      ).toStrictEqual([])
    })

    it("should leave the other relations untouched when the relation exists", async () => {
      await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          normId: buildEntityId(NORM),
          portfolioId: buildEntityId(PORTFOLIO),
        })
      )
      const other = await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          normId: buildEntityId(OTHER_NORM),
          portfolioId: buildEntityId(PORTFOLIO),
        })
      )
      const useCase = new DetachNormFromPortfolioUseCase(
        normsPortfoliosRepository
      )

      await useCase.execute({
        normId: NORM,
        portfolioId: PORTFOLIO,
      })

      expect(
        await normsPortfoliosRepository.findByNormIdAndPortfolioId(
          other.normId,
          other.portfolioId
        )
      ).not.toBeNull()
    })

    it("should resolve without a payload when the relation exists", async () => {
      await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          normId: buildEntityId(NORM),
          portfolioId: buildEntityId(PORTFOLIO),
        })
      )
      const useCase = new DetachNormFromPortfolioUseCase(
        normsPortfoliosRepository
      )

      const response = await useCase.execute({
        normId: NORM,
        portfolioId: PORTFOLIO,
      })

      expect(response).toBeUndefined()
    })

    it("should throw NotFoundError when the relation does not exist", async () => {
      const useCase = new DetachNormFromPortfolioUseCase(
        normsPortfoliosRepository
      )

      await expect(
        useCase.execute({ normId: NORM, portfolioId: PORTFOLIO })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw NotFoundError when the portfolio does not match", async () => {
      await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          normId: buildEntityId(NORM),
          portfolioId: buildEntityId(PORTFOLIO),
        })
      )
      const useCase = new DetachNormFromPortfolioUseCase(
        normsPortfoliosRepository
      )

      await expect(
        useCase.execute({
          normId: NORM,
          portfolioId: "portfolio-other",
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw ValidationError when the norm id is blank", async () => {
      const useCase = new DetachNormFromPortfolioUseCase(
        normsPortfoliosRepository
      )

      await expect(
        useCase.execute({ normId: "  ", portfolioId: PORTFOLIO })
      ).rejects.toThrow(ValidationError)
    })
  })
})
