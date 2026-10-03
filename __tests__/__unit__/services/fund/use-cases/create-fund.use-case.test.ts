import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { CreateFundUseCase } from "@/services/fund/use-cases/create-fund.use-case"
import { ValidationError } from "@errors/validation.error"
import { createFakeFundRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildFund,
  buildUniqueCnpj,
} from "__tests__/__setup__/_factories.setup"
import {
  getFixedDate,
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

describe("services/fund/use-cases/create-fund.use-case", () => {
  let fundRepository: ReturnType<typeof createFakeFundRepository>

  beforeEach(() => {
    useFixedClock()
    fundRepository = createFakeFundRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  describe("execute", () => {
    it("should persist a fund built from the payload when creating a fund", async () => {
      const useCase = new CreateFundUseCase(fundRepository)

      const response = await useCase.execute({
        cnpj: "11.222.333/0001-81",
        name: "Fundo Multi Mercado",
        administrationFee: "1.50",
        performanceFee: "20.00",
        bankId: "bank-1",
        benchmarkId: "benchmark-1",
        categoryId: "category-1",
      })

      expect(response.id).toBeDefined()
      expect(response.cnpj).toBe("11222333000181")
      expect(response.name).toBe("Fundo Multi Mercado")
      expect(response.bankId).toBe("bank-1")
      expect(response.administrationFee).toBe("1.5")
      expect(response.performanceFee).toBe("20")
      expect(response.benchmarkId).toBe("benchmark-1")
      expect(response.categoryId).toBe("category-1")
    })

    it("should save the row through the fund repository when creating a fund", async () => {
      const useCase = new CreateFundUseCase(fundRepository)

      await useCase.execute({
        cnpj: "11222333000181",
        name: "Fundo Master",
        bankId: "bank-1",
      })

      const stored = await fundRepository.findAll({})

      expect(stored).toHaveLength(1)
      expect(stored[0].name).toBe("Fundo Master")
    })

    it("should null the optional fields when the payload omits them", async () => {
      const useCase = new CreateFundUseCase(fundRepository)

      const response = await useCase.execute({
        cnpj: "11222333000181",
        name: "Fundo Enxuto",
        bankId: "bank-1",
      })

      expect(response.administrationFee).toBeNull()
      expect(response.performanceFee).toBeNull()
      expect(response.benchmarkId).toBeNull()
      expect(response.categoryId).toBeNull()
    })

    it("should keep the previous rows when creating a fund", async () => {
      await fundRepository.save(
        buildFund({ cnpj: buildUniqueCnpj("111111111111") })
      )
      const useCase = new CreateFundUseCase(fundRepository)

      await useCase.execute({
        cnpj: "11222333000181",
        name: "Fundo Master",
        bankId: "bank-1",
      })

      expect(await fundRepository.findAll({})).toHaveLength(2)
    })

    it("should expose the current clock as creation timestamp when creating a fund", async () => {
      const useCase = new CreateFundUseCase(fundRepository)

      const response = await useCase.execute({
        cnpj: "11222333000181",
        name: "Fundo Master",
        bankId: "bank-1",
      })

      expect(response.createdAt).toBe(
        getFixedDate().toISOString()
      )
      expect(response.updatedAt).toBe(
        getFixedDate().toISOString()
      )
    })

    it("should throw ValidationError when the cnpj is invalid", async () => {
      const useCase = new CreateFundUseCase(fundRepository)

      await expect(
        useCase.execute({
          cnpj: "11222333000199",
          name: "Fundo Master",
          bankId: "bank-1",
        })
      ).rejects.toThrow(ValidationError)
    })

    it("should throw ValidationError when the name is blank", async () => {
      const useCase = new CreateFundUseCase(fundRepository)

      await expect(
        useCase.execute({
          cnpj: "11222333000181",
          name: "  ",
          bankId: "bank-1",
        })
      ).rejects.toThrow(ValidationError)
    })

    it("should throw ValidationError when the bank id is blank", async () => {
      const useCase = new CreateFundUseCase(fundRepository)

      await expect(
        useCase.execute({
          cnpj: "11222333000181",
          name: "Fundo Master",
          bankId: " ",
        })
      ).rejects.toThrow(ValidationError)
    })

    it("should store nothing when the payload is rejected", async () => {
      const useCase = new CreateFundUseCase(fundRepository)

      await expect(
        useCase.execute({
          cnpj: "11222333000181",
          name: "",
          bankId: "bank-1",
        })
      ).rejects.toThrow(ValidationError)

      expect(await fundRepository.findAll({})).toStrictEqual([])
    })
  })
})
