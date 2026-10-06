import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { CreatePortfolioUseCase } from "@/services/portfolio/use-cases/create-portfolio.use-case"
import { ValidationError } from "@errors/validation.error"
import { EntityId } from "@/value-objects"
import {
  createFakeNormsPortfoliosRepository,
  createFakePortfolioRepository,
} from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPortfolio,
} from "__tests__/__setup__/_factories.setup"
import {
  getFixedDate,
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

describe("services/portfolio/use-cases/create-portfolio.use-case", () => {
  let portfolioRepository: ReturnType<
    typeof createFakePortfolioRepository
  >
  let normsPortfoliosRepository: ReturnType<
    typeof createFakeNormsPortfoliosRepository
  >

  beforeEach(() => {
    useFixedClock()
    portfolioRepository = createFakePortfolioRepository()
    normsPortfoliosRepository =
      createFakeNormsPortfoliosRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  describe("execute", () => {
    it("should persist a portfolio built from the payload when creating a portfolio", async () => {
      const useCase = new CreatePortfolioUseCase(
        portfolioRepository,
        normsPortfoliosRepository
      )

      const response = await useCase.execute({
        acronym: "ME",
        name: "Meu Portfolio",
        userId: "user-1",
        annualInterestRate: "12.0",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      expect(response.acronym).toBe("ME")
      expect(response.name).toBe("Meu Portfolio")
      expect(response.userId).toBe("user-1")
      expect(response.id).toBeDefined()
    })

    it("should expose the parsed percentages when creating a portfolio", async () => {
      const useCase = new CreatePortfolioUseCase(
        portfolioRepository,
        normsPortfoliosRepository
      )

      const response = await useCase.execute({
        acronym: "ME",
        name: "Meu Portfolio",
        userId: "user-1",
        annualInterestRate: "12.0",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      expect(response.annualInterestRate).toBe("12")
      expect(response.minAllocation).toBe("5")
      expect(response.maxAllocation).toBe("20")
      expect(response.targetAllocation).toBe("12")
    })

    it("should stamp both timestamps from the clock when creating a portfolio", async () => {
      const useCase = new CreatePortfolioUseCase(
        portfolioRepository,
        normsPortfoliosRepository
      )

      const response = await useCase.execute({
        acronym: "ME",
        name: "Meu Portfolio",
        userId: "user-1",
        annualInterestRate: "12.0",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      const EXPECTED = getFixedDate().toISOString()

      expect(response.createdAt).toBe(EXPECTED)
      expect(response.updatedAt).toBe(EXPECTED)
    })

    it("should store exactly one row when creating a portfolio", async () => {
      const useCase = new CreatePortfolioUseCase(
        portfolioRepository,
        normsPortfoliosRepository
      )

      await useCase.execute({
        acronym: "ME",
        name: "Meu Portfolio",
        userId: "user-1",
        annualInterestRate: "12.0",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      const stored = await portfolioRepository.findAll({})

      expect(stored.length).toBe(1)
      expect(stored[0].acronym).toBe("ME")
    })

    it("should keep the previous rows when creating a portfolio", async () => {
      await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId("portfolio-1") })
      )
      const useCase = new CreatePortfolioUseCase(
        portfolioRepository,
        normsPortfoliosRepository
      )

      await useCase.execute({
        acronym: "ME",
        name: "Meu Portfolio",
        userId: "user-1",
        annualInterestRate: "12.0",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      const stored = await portfolioRepository.findAll({})

      expect(stored.length).toBe(2)
    })

    it("should throw ValidationError when the acronym is blank", async () => {
      const useCase = new CreatePortfolioUseCase(
        portfolioRepository,
        normsPortfoliosRepository
      )

      await expect(
        useCase.execute({
          acronym: "   ",
          name: "Meu Portfolio",
          userId: "user-1",
          annualInterestRate: "12.0",
          minAllocation: "5",
          maxAllocation: "20",
          targetAllocation: "12",
        })
      ).rejects.toThrow(ValidationError)
    })

    it("should store no row when the name is blank", async () => {
      const useCase = new CreatePortfolioUseCase(
        portfolioRepository,
        normsPortfoliosRepository
      )

      await expect(
        useCase.execute({
          acronym: "ME",
          name: "  ",
          userId: "user-1",
          annualInterestRate: "12.0",
          minAllocation: "5",
          maxAllocation: "20",
          targetAllocation: "12",
        })
      ).rejects.toThrow(ValidationError)

      expect(
        (await portfolioRepository.findAll({})).length
      ).toBe(0)
    })
  })

  describe("execute with norms", () => {
    it("should attach one relation per requested norm when creating a portfolio", async () => {
      const useCase = new CreatePortfolioUseCase(
        portfolioRepository,
        normsPortfoliosRepository
      )

      const response = await useCase.execute({
        acronym: "ME",
        name: "Meu Portfolio",
        userId: "user-1",
        annualInterestRate: "12.0",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
        norms: [
          {
            normId: "norm-1",
            minAllocation: "5",
            targetAllocation: "10",
            maxAllocation: "15",
          },
          {
            normId: "norm-2",
            minAllocation: "0",
            targetAllocation: "50",
            maxAllocation: "60",
          },
        ],
      })

      const stored =
        await normsPortfoliosRepository.findAllByPortfolioId(
          EntityId.create(response.id ?? "")
        )

      expect(stored.length).toBe(2)
    })

    it("should store the requested bounds when creating a portfolio with norms", async () => {
      const useCase = new CreatePortfolioUseCase(
        portfolioRepository,
        normsPortfoliosRepository
      )

      const response = await useCase.execute({
        acronym: "ME",
        name: "Meu Portfolio",
        userId: "user-1",
        annualInterestRate: "12.0",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
        norms: [
          {
            normId: "norm-1",
            minAllocation: "5",
            targetAllocation: "10",
            maxAllocation: "15",
          },
        ],
      })

      const relation =
        await normsPortfoliosRepository.findByNormIdAndPortfolioId(
          EntityId.create("norm-1"),
          EntityId.create(response.id ?? "")
        )

      expect(relation?.minAllocation.value.toString()).toBe("5")
      expect(relation?.targetAllocation.value.toString()).toBe(
        "10"
      )
      expect(relation?.maxAllocation.value.toString()).toBe("15")
    })

    it("should store no relation when the payload carries no norms", async () => {
      const useCase = new CreatePortfolioUseCase(
        portfolioRepository,
        normsPortfoliosRepository
      )

      await useCase.execute({
        acronym: "ME",
        name: "Meu Portfolio",
        userId: "user-1",
        annualInterestRate: "12.0",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      const stored = await portfolioRepository.findAll({})
      const PORTFOLIO = stored[0]

      const relations = PORTFOLIO
        ? await normsPortfoliosRepository.findAllByPortfolioId(
            PORTFOLIO.id ?? EntityId.create("")
          )
        : []

      expect(relations.length).toBe(0)
    })
  })
})
