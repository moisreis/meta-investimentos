import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { UpdateFundUseCase } from "@/services/fund/use-cases/update-fund.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakeFundRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildFund,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"
import {
  getFixedDate,
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

const ID = "00000000-0000-0000-0000-000000000032"
const CREATED_AT = new Date("2026-01-01T00:00:00.000Z")

describe("services/fund/use-cases/update-fund.use-case", () => {
  let fundRepository: ReturnType<typeof createFakeFundRepository>

  beforeEach(() => {
    useFixedClock()
    fundRepository = createFakeFundRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  describe("execute", () => {
    it("should rename the fund and persist it when the fund exists", async () => {
      const saved = await fundRepository.save(
        buildFund({
          id: buildEntityId(ID),
          name: "Fundo Master",
        })
      )
      const useCase = new UpdateFundUseCase(fundRepository)

      const response = await useCase.execute({
        fundId: saved.id!,
        name: "Fundo Master II",
      })

      expect(response.id).toBe(ID)
      expect(response.name).toBe("Fundo Master II")

      const stored = await fundRepository.findById(saved.id!)

      expect(stored?.name).toBe("Fundo Master II")
      expect(await fundRepository.findAll({})).toHaveLength(1)
    })

    it("should keep the current fees and links when the payload omits them", async () => {
      const saved = await fundRepository.save(
        buildFund({
          id: buildEntityId(ID),
          name: "Fundo Master",
          administrationFee: buildSignedPercentage("1.50"),
          performanceFee: buildSignedPercentage("20.00"),
          benchmarkId: buildEntityId("benchmark-1"),
          categoryId: buildEntityId("category-1"),
        })
      )
      const useCase = new UpdateFundUseCase(fundRepository)

      const response = await useCase.execute({
        fundId: saved.id!,
      })

      expect(response.administrationFee).toBe("1.5")
      expect(response.performanceFee).toBe("20")
      expect(response.benchmarkId).toBe("benchmark-1")
      expect(response.categoryId).toBe("category-1")
    })

    it("should clear the fees and links when the payload sends null", async () => {
      const saved = await fundRepository.save(
        buildFund({
          id: buildEntityId(ID),
          name: "Fundo Master",
          administrationFee: buildSignedPercentage("1.50"),
          performanceFee: buildSignedPercentage("20.00"),
          benchmarkId: buildEntityId("benchmark-1"),
          categoryId: buildEntityId("category-1"),
        })
      )
      const useCase = new UpdateFundUseCase(fundRepository)

      const response = await useCase.execute({
        fundId: saved.id!,
        administrationFee: null,
        performanceFee: null,
        benchmarkId: null,
        categoryId: null,
      })

      expect(response.administrationFee).toBeNull()
      expect(response.performanceFee).toBeNull()
      expect(response.benchmarkId).toBeNull()
      expect(response.categoryId).toBeNull()
    })

    it("should replace the fees and links when the payload provides values", async () => {
      const saved = await fundRepository.save(
        buildFund({ id: buildEntityId(ID) })
      )
      const useCase = new UpdateFundUseCase(fundRepository)

      const response = await useCase.execute({
        fundId: saved.id!,
        administrationFee: "3.50",
        performanceFee: "20.25",
        benchmarkId: "  benchmark-9  ",
        categoryId: " category-8 ",
      })

      expect(response.administrationFee).toBe("3.5")
      expect(response.performanceFee).toBe("20.25")
      expect(response.benchmarkId).toBe("benchmark-9")
      expect(response.categoryId).toBe("category-8")
    })

    it("should keep the creation timestamp and refresh the update timestamp", async () => {
      const saved = await fundRepository.save(
        buildFund({
          id: buildEntityId(ID),
          createdAt: CREATED_AT,
          updatedAt: CREATED_AT,
        })
      )
      const useCase = new UpdateFundUseCase(fundRepository)

      const response = await useCase.execute({
        fundId: saved.id!,
        name: "Fundo Master II",
      })

      expect(response.createdAt).toBe(CREATED_AT.toISOString())
      expect(response.updatedAt).toBe(
        getFixedDate().toISOString()
      )
    })

    it("should throw NotFoundError when the fund does not exist", async () => {
      const useCase = new UpdateFundUseCase(fundRepository)

      await expect(
        useCase.execute({ fundId: ID, name: "Fundo Master II" })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw ValidationError when the new name is blank", async () => {
      const saved = await fundRepository.save(
        buildFund({
          id: buildEntityId(ID),
          name: "Fundo Master",
        })
      )
      const useCase = new UpdateFundUseCase(fundRepository)

      await expect(
        useCase.execute({ fundId: saved.id!, name: "  " })
      ).rejects.toThrow(ValidationError)

      const stored = await fundRepository.findById(saved.id!)

      expect(stored?.name).toBe("Fundo Master")
    })

    it("should throw ValidationError when the payload sends a blank category id", async () => {
      const saved = await fundRepository.save(
        buildFund({ id: buildEntityId(ID) })
      )
      const useCase = new UpdateFundUseCase(fundRepository)

      await expect(
        useCase.execute({ fundId: saved.id!, categoryId: " " })
      ).rejects.toThrow(ValidationError)
    })
  })
})
