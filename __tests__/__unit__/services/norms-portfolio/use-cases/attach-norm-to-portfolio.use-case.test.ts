import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { AttachNormToPortfolioUseCase } from "@/services/norms-portfolio/use-cases/attach-norm-to-portfolio.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import {
  createFakeNormRepository,
  createFakeNormsPortfoliosRepository,
  createFakePortfolioRepository,
} from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildNorm,
  buildNormsPortfolios,
  buildPortfolio,
} from "__tests__/__setup__/_factories.setup"
import {
  getFixedDate,
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

const NORM = "norm-1"
const PORTFOLIO = "portfolio-1"
const MISSING = "missing-1"

describe("services/norms-portfolio/use-cases/attach-norm-to-portfolio.use-case", () => {
  let normsPortfoliosRepository: ReturnType<
    typeof createFakeNormsPortfoliosRepository
  >
  let normRepository: ReturnType<typeof createFakeNormRepository>
  let portfolioRepository: ReturnType<
    typeof createFakePortfolioRepository
  >

  beforeEach(() => {
    useFixedClock()
    normsPortfoliosRepository =
      createFakeNormsPortfoliosRepository()
    normRepository = createFakeNormRepository()
    portfolioRepository = createFakePortfolioRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  describe("execute", () => {
    it("should persist the relation when the norm and the portfolio exist", async () => {
      await normRepository.save(
        buildNorm({ id: buildEntityId(NORM) })
      )
      await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(PORTFOLIO) })
      )
      const useCase = new AttachNormToPortfolioUseCase(
        normsPortfoliosRepository,
        normRepository,
        portfolioRepository
      )

      const response = await useCase.execute({
        normId: NORM,
        portfolioId: PORTFOLIO,
        minAllocation: "5.25",
        maxAllocation: "40.75",
        targetAllocation: "12.50",
      })

      expect(response.id).toBeDefined()
      expect(response.normId).toBe(NORM)
      expect(response.portfolioId).toBe(PORTFOLIO)
      expect(response.minAllocation).toBe("5.25")
      expect(response.maxAllocation).toBe("40.75")
      expect(response.targetAllocation).toBe("12.5")
    })

    it("should store exactly one relation when the relation does not exist yet", async () => {
      await normRepository.save(
        buildNorm({ id: buildEntityId(NORM) })
      )
      await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(PORTFOLIO) })
      )
      const useCase = new AttachNormToPortfolioUseCase(
        normsPortfoliosRepository,
        normRepository,
        portfolioRepository
      )

      await useCase.execute({
        normId: NORM,
        portfolioId: PORTFOLIO,
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      const stored =
        await normsPortfoliosRepository.findByNormIdAndPortfolioId(
          buildEntityId(NORM),
          buildEntityId(PORTFOLIO)
        )

      expect(stored).not.toBeNull()
      expect(
        await normsPortfoliosRepository.findAllByNormId(
          buildEntityId(NORM)
        )
      ).toHaveLength(1)
    })

    it("should expose the current clock as creation timestamp when attaching", async () => {
      await normRepository.save(
        buildNorm({ id: buildEntityId(NORM) })
      )
      await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(PORTFOLIO) })
      )
      const useCase = new AttachNormToPortfolioUseCase(
        normsPortfoliosRepository,
        normRepository,
        portfolioRepository
      )

      const response = await useCase.execute({
        normId: NORM,
        portfolioId: PORTFOLIO,
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      expect(response.createdAt).toBe(
        getFixedDate().toISOString()
      )
    })

    it("should throw NotFoundError when the norm does not exist", async () => {
      await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(PORTFOLIO) })
      )
      const useCase = new AttachNormToPortfolioUseCase(
        normsPortfoliosRepository,
        normRepository,
        portfolioRepository
      )

      await expect(
        useCase.execute({
          normId: MISSING,
          portfolioId: PORTFOLIO,
          minAllocation: "5",
          maxAllocation: "20",
          targetAllocation: "12",
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw NotFoundError when the portfolio does not exist", async () => {
      await normRepository.save(
        buildNorm({ id: buildEntityId(NORM) })
      )
      const useCase = new AttachNormToPortfolioUseCase(
        normsPortfoliosRepository,
        normRepository,
        portfolioRepository
      )

      await expect(
        useCase.execute({
          normId: NORM,
          portfolioId: MISSING,
          minAllocation: "5",
          maxAllocation: "20",
          targetAllocation: "12",
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw ValidationError when the relation already exists", async () => {
      await normRepository.save(
        buildNorm({ id: buildEntityId(NORM) })
      )
      await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(PORTFOLIO) })
      )
      await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          normId: buildEntityId(NORM),
          portfolioId: buildEntityId(PORTFOLIO),
        })
      )
      const useCase = new AttachNormToPortfolioUseCase(
        normsPortfoliosRepository,
        normRepository,
        portfolioRepository
      )

      await expect(
        useCase.execute({
          normId: NORM,
          portfolioId: PORTFOLIO,
          minAllocation: "5",
          maxAllocation: "20",
          targetAllocation: "12",
        })
      ).rejects.toThrow(ValidationError)
    })

    it("should keep the existing relation when the relation already exists", async () => {
      await normRepository.save(
        buildNorm({ id: buildEntityId(NORM) })
      )
      await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(PORTFOLIO) })
      )
      const existing = await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          normId: buildEntityId(NORM),
          portfolioId: buildEntityId(PORTFOLIO),
        })
      )
      const useCase = new AttachNormToPortfolioUseCase(
        normsPortfoliosRepository,
        normRepository,
        portfolioRepository
      )

      await expect(
        useCase.execute({
          normId: NORM,
          portfolioId: PORTFOLIO,
          minAllocation: "5",
          maxAllocation: "20",
          targetAllocation: "12",
        })
      ).rejects.toThrow(ValidationError)

      const stored =
        await normsPortfoliosRepository.findByNormIdAndPortfolioId(
          buildEntityId(NORM),
          buildEntityId(PORTFOLIO)
        )

      expect(stored?.id).toBe(existing.id)
    })

    it("should throw ValidationError when the minimum allocation exceeds the target allocation", async () => {
      await normRepository.save(
        buildNorm({ id: buildEntityId(NORM) })
      )
      await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(PORTFOLIO) })
      )
      const useCase = new AttachNormToPortfolioUseCase(
        normsPortfoliosRepository,
        normRepository,
        portfolioRepository
      )

      await expect(
        useCase.execute({
          normId: NORM,
          portfolioId: PORTFOLIO,
          minAllocation: "30",
          maxAllocation: "40",
          targetAllocation: "12",
        })
      ).rejects.toThrow(ValidationError)
    })
  })
})
