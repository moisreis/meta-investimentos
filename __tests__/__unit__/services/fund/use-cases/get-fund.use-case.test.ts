import { describe, it, expect, beforeEach } from "vitest"

import { GetFundUseCase } from "@/services/fund/use-cases/get-fund.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakeFundRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildFund,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000031"

describe("services/fund/use-cases/get-fund.use-case", () => {
  let fundRepository: ReturnType<typeof createFakeFundRepository>

  beforeEach(() => {
    fundRepository = createFakeFundRepository()
  })

  describe("execute", () => {
    it("should return the fund when it exists", async () => {
      const saved = await fundRepository.save(
        buildFund({
          id: buildEntityId(ID),
          name: "Fundo Master",
        })
      )
      const useCase = new GetFundUseCase(fundRepository)

      const response = await useCase.execute({
        fundId: saved.id!,
      })

      expect(response.id).toBe(ID)
      expect(response.name).toBe("Fundo Master")
    })

    it("should expose every field when the fund exists", async () => {
      const saved = await fundRepository.save(
        buildFund({
          id: buildEntityId(ID),
          name: "Fundo Completo",
          administrationFee: buildSignedPercentage("1.50"),
          performanceFee: buildSignedPercentage("20.00"),
          bankId: buildEntityId("bank-7"),
          benchmarkId: buildEntityId("benchmark-7"),
          categoryId: buildEntityId("category-7"),
          createdAt: new Date("2026-03-01T00:00:00.000Z"),
          updatedAt: new Date("2026-03-02T00:00:00.000Z"),
        })
      )
      const useCase = new GetFundUseCase(fundRepository)

      const response = await useCase.execute({
        fundId: saved.id!,
      })

      expect(response).toStrictEqual({
        id: ID,
        cnpj: "11222333000181",
        name: "Fundo Completo",
        administrationFee: "1.5",
        performanceFee: "20",
        bankId: "bank-7",
        benchmarkId: "benchmark-7",
        categoryId: "category-7",
        createdAt: "2026-03-01T00:00:00.000Z",
        updatedAt: "2026-03-02T00:00:00.000Z",
      })
    })

    it("should expose the null fields when the fund is sparse", async () => {
      const saved = await fundRepository.save(
        buildFund({
          id: buildEntityId(ID),
          name: "Fundo Enxuto",
          administrationFee: null,
          performanceFee: null,
          benchmarkId: null,
          categoryId: null,
        })
      )
      const useCase = new GetFundUseCase(fundRepository)

      const response = await useCase.execute({
        fundId: saved.id!,
      })

      expect(response.administrationFee).toBeNull()
      expect(response.performanceFee).toBeNull()
      expect(response.benchmarkId).toBeNull()
      expect(response.categoryId).toBeNull()
    })

    it("should throw NotFoundError when the fund does not exist", async () => {
      const useCase = new GetFundUseCase(fundRepository)

      await expect(
        useCase.execute({ fundId: ID })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw ValidationError when the fund id is blank", async () => {
      const useCase = new GetFundUseCase(fundRepository)

      await expect(
        useCase.execute({ fundId: "   " })
      ).rejects.toThrow(ValidationError)
    })
  })
})
