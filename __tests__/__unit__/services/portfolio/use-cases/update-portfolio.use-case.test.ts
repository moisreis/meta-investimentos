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
import { createFakeNormsPortfoliosRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildNormsPortfolios,
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
    it("should update the acronym when the payload provides one", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(ID) })
      )
      const useCase = new UpdatePortfolioUseCase(
        portfolioRepository,
        normsPortfoliosRepository
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
        portfolioRepository,
        normsPortfoliosRepository
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
        portfolioRepository,
        normsPortfoliosRepository
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
        portfolioRepository,
        normsPortfoliosRepository
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
        portfolioRepository,
        normsPortfoliosRepository
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
        portfolioRepository,
        normsPortfoliosRepository
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
        portfolioRepository,
        normsPortfoliosRepository
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
        portfolioRepository,
        normsPortfoliosRepository
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
        portfolioRepository,
        normsPortfoliosRepository
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
        portfolioRepository,
        normsPortfoliosRepository
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
        portfolioRepository,
        normsPortfoliosRepository
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
        portfolioRepository,
        normsPortfoliosRepository
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

  describe("execute with norms", () => {
    it("should attach a relation per submitted norm when the payload carries norms", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(ID) })
      )
      const useCase = new UpdatePortfolioUseCase(
        portfolioRepository,
        normsPortfoliosRepository
      )

      await useCase.execute({
        portfolioId: saved.id!,
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
          buildEntityId(ID)
        )

      expect(stored.length).toBe(2)
    })

    it("should re-bound a kept relation instead of recreating it", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(ID) })
      )
      const original = await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          normId: buildEntityId("norm-1"),
          portfolioId: buildEntityId(ID),
        })
      )
      const useCase = new UpdatePortfolioUseCase(
        portfolioRepository,
        normsPortfoliosRepository
      )

      await useCase.execute({
        portfolioId: saved.id!,
        norms: [
          {
            normId: "norm-1",
            minAllocation: "8",
            targetAllocation: "9",
            maxAllocation: "11",
          },
        ],
      })

      const stored =
        await normsPortfoliosRepository.findByNormIdAndPortfolioId(
          buildEntityId("norm-1"),
          buildEntityId(ID)
        )

      expect(stored?.minAllocation.value.toString()).toBe("8")
      expect(stored?.targetAllocation.value.toString()).toBe("9")
      expect(stored?.maxAllocation.value.toString()).toBe("11")
      expect(stored?.createdAt).toStrictEqual(original.createdAt)
    })

    it("should detach a relation the user removed from the portfolio", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(ID) })
      )
      await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          normId: buildEntityId("norm-1"),
          portfolioId: buildEntityId(ID),
        })
      )
      await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          normId: buildEntityId("norm-2"),
          portfolioId: buildEntityId(ID),
        })
      )
      const useCase = new UpdatePortfolioUseCase(
        portfolioRepository,
        normsPortfoliosRepository
      )

      await useCase.execute({
        portfolioId: saved.id!,
        norms: [
          {
            normId: "norm-2",
            minAllocation: "0",
            targetAllocation: "50",
            maxAllocation: "60",
          },
        ],
      })

      const detached =
        await normsPortfoliosRepository.findByNormIdAndPortfolioId(
          buildEntityId("norm-1"),
          buildEntityId(ID)
        )
      const kept =
        await normsPortfoliosRepository.findByNormIdAndPortfolioId(
          buildEntityId("norm-2"),
          buildEntityId(ID)
        )

      expect(detached).toBeNull()
      expect(kept).not.toBeNull()
    })

    it("should keep every relation when the payload omits the norms", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(ID) })
      )
      await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          normId: buildEntityId("norm-1"),
          portfolioId: buildEntityId(ID),
        })
      )
      const useCase = new UpdatePortfolioUseCase(
        portfolioRepository,
        normsPortfoliosRepository
      )

      await useCase.execute({
        portfolioId: saved.id!,
        name: "Renamed",
      })

      const stored =
        await normsPortfoliosRepository.findAllByPortfolioId(
          buildEntityId(ID)
        )

      expect(stored.length).toBe(1)
    })

    it("should drop every relation when the payload submits an empty norm list", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(ID) })
      )
      await normsPortfoliosRepository.save(
        buildNormsPortfolios({
          normId: buildEntityId("norm-1"),
          portfolioId: buildEntityId(ID),
        })
      )
      const useCase = new UpdatePortfolioUseCase(
        portfolioRepository,
        normsPortfoliosRepository
      )

      await useCase.execute({
        portfolioId: saved.id!,
        norms: [],
      })

      const stored =
        await normsPortfoliosRepository.findAllByPortfolioId(
          buildEntityId(ID)
        )

      expect(stored.length).toBe(0)
    })

    it("should leave no relation behind when a submitted range breaks the entity rule", async () => {
      const saved = await portfolioRepository.save(
        buildPortfolio({ id: buildEntityId(ID) })
      )
      const useCase = new UpdatePortfolioUseCase(
        portfolioRepository,
        normsPortfoliosRepository
      )

      await expect(
        useCase.execute({
          portfolioId: saved.id!,
          norms: [
            {
              normId: "norm-1",
              minAllocation: "50",
              targetAllocation: "10",
              maxAllocation: "15",
            },
          ],
        })
      ).rejects.toThrow()

      const stored =
        await normsPortfoliosRepository.findAllByPortfolioId(
          buildEntityId(ID)
        )

      expect(stored.length).toBe(0)
    })
  })
})
