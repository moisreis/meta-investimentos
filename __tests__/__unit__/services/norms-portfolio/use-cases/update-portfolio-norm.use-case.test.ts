import { describe, it, expect, beforeEach } from "vitest"

import { UpdatePortfolioNormUseCase } from "@/services/norms-portfolio/use-cases/update-portfolio-norm.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakeNormsPortfoliosRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildNormsPortfolios,
} from "__tests__/__setup__/_factories.setup"

const NORM = "norm-1"
const PORTFOLIO = "portfolio-1"

describe("services/norms-portfolio/use-cases/update-portfolio-norm.use-case", () => {
  let normsPortfoliosRepository: ReturnType<
    typeof createFakeNormsPortfoliosRepository
  >

  beforeEach(() => {
    normsPortfoliosRepository =
      createFakeNormsPortfoliosRepository()
  })

  describe("execute", () => {
    it("should persist every provided allocation when the relation exists", async () => {
      await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          normId: buildEntityId(NORM),
          portfolioId: buildEntityId(PORTFOLIO),
        })
      )
      const useCase = new UpdatePortfolioNormUseCase(
        normsPortfoliosRepository
      )

      const response = await useCase.execute({
        normId: NORM,
        portfolioId: PORTFOLIO,
        minAllocation: "3.50",
        maxAllocation: "25.00",
        targetAllocation: "15.00",
      })

      expect(response.normId).toBe(NORM)
      expect(response.portfolioId).toBe(PORTFOLIO)
      expect(response.minAllocation).toBe("3.5")
      expect(response.maxAllocation).toBe("25")
      expect(response.targetAllocation).toBe("15")
    })

    it("should replace the stored relation when the relation exists", async () => {
      const saved = await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          normId: buildEntityId(NORM),
          portfolioId: buildEntityId(PORTFOLIO),
        })
      )
      const useCase = new UpdatePortfolioNormUseCase(
        normsPortfoliosRepository
      )

      const response = await useCase.execute({
        normId: NORM,
        portfolioId: PORTFOLIO,
        targetAllocation: "15",
      })

      expect(response.id).toBe(saved.id)

      const stored =
        await normsPortfoliosRepository.findByNormIdAndPortfolioId(
          buildEntityId(NORM),
          buildEntityId(PORTFOLIO)
        )

      expect(stored?.targetAllocation.value.toString()).toBe(
        "15"
      )
      expect(
        await normsPortfoliosRepository.findAllByPortfolioId(
          buildEntityId(PORTFOLIO)
        )
      ).toHaveLength(1)
    })

    it("should keep the current allocations when the payload omits them", async () => {
      await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          normId: buildEntityId(NORM),
          portfolioId: buildEntityId(PORTFOLIO),
        })
      )
      const useCase = new UpdatePortfolioNormUseCase(
        normsPortfoliosRepository
      )

      const response = await useCase.execute({
        normId: NORM,
        portfolioId: PORTFOLIO,
      })

      expect(response.minAllocation).toBe("5")
      expect(response.maxAllocation).toBe("20")
      expect(response.targetAllocation).toBe("12")
    })

    it("should keep the current allocations when the payload sends blank strings", async () => {
      await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          normId: buildEntityId(NORM),
          portfolioId: buildEntityId(PORTFOLIO),
        })
      )
      const useCase = new UpdatePortfolioNormUseCase(
        normsPortfoliosRepository
      )

      const response = await useCase.execute({
        normId: NORM,
        portfolioId: PORTFOLIO,
        minAllocation: "",
        maxAllocation: "",
        targetAllocation: "",
      })

      expect(response.minAllocation).toBe("5")
      expect(response.maxAllocation).toBe("20")
      expect(response.targetAllocation).toBe("12")
    })

    it("should throw NotFoundError when the relation does not exist", async () => {
      const useCase = new UpdatePortfolioNormUseCase(
        normsPortfoliosRepository
      )

      await expect(
        useCase.execute({
          normId: NORM,
          portfolioId: PORTFOLIO,
          targetAllocation: "15",
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw ValidationError when the new target allocation exceeds the maximum allocation", async () => {
      await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          normId: buildEntityId(NORM),
          portfolioId: buildEntityId(PORTFOLIO),
        })
      )
      const useCase = new UpdatePortfolioNormUseCase(
        normsPortfoliosRepository
      )

      await expect(
        useCase.execute({
          normId: NORM,
          portfolioId: PORTFOLIO,
          targetAllocation: "35",
        })
      ).rejects.toThrow(ValidationError)
    })

    it("should throw ValidationError when the new minimum allocation exceeds the target allocation", async () => {
      await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          normId: buildEntityId(NORM),
          portfolioId: buildEntityId(PORTFOLIO),
        })
      )
      const useCase = new UpdatePortfolioNormUseCase(
        normsPortfoliosRepository
      )

      await expect(
        useCase.execute({
          normId: NORM,
          portfolioId: PORTFOLIO,
          minAllocation: "30",
        })
      ).rejects.toThrow(ValidationError)
    })

    it("should throw ValidationError when the norm id is blank", async () => {
      const useCase = new UpdatePortfolioNormUseCase(
        normsPortfoliosRepository
      )

      await expect(
        useCase.execute({
          normId: "  ",
          portfolioId: PORTFOLIO,
          targetAllocation: "15",
        })
      ).rejects.toThrow(ValidationError)
    })
  })
})
