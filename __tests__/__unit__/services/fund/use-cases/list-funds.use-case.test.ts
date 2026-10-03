import { describe, it, expect, beforeEach } from "vitest"

import { ListFundsUseCase } from "@/services/fund/use-cases/list-funds.use-case"
import { createFakeFundRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildFund,
  buildUniqueCnpj,
} from "__tests__/__setup__/_factories.setup"

describe("services/fund/use-cases/list-funds.use-case", () => {
  let fundRepository: ReturnType<typeof createFakeFundRepository>

  beforeEach(() => {
    fundRepository = createFakeFundRepository()
  })

  describe("execute", () => {
    it("should return every fund when the input has no pagination", async () => {
      await fundRepository.save(
        buildFund({
          id: buildEntityId("fund-1"),
          name: "Fundo Alfa",
          cnpj: buildUniqueCnpj("111111111111"),
        })
      )
      await fundRepository.save(
        buildFund({
          id: buildEntityId("fund-2"),
          name: "Fundo Beta",
          cnpj: buildUniqueCnpj("222222222222"),
        })
      )
      const useCase = new ListFundsUseCase(fundRepository)

      const response = await useCase.execute({})

      expect(response.map((fund) => fund.name)).toStrictEqual([
        "Fundo Alfa",
        "Fundo Beta",
      ])
    })

    it("should return an empty array when no fund is registered", async () => {
      const useCase = new ListFundsUseCase(fundRepository)

      const response = await useCase.execute({})

      expect(response).toStrictEqual([])
    })

    it("should truncate the page when the input provides a limit", async () => {
      await fundRepository.save(
        buildFund({
          id: buildEntityId("fund-1"),
          name: "Fundo Alfa",
          cnpj: buildUniqueCnpj("111111111111"),
        })
      )
      await fundRepository.save(
        buildFund({
          id: buildEntityId("fund-2"),
          name: "Fundo Beta",
          cnpj: buildUniqueCnpj("222222222222"),
        })
      )
      await fundRepository.save(
        buildFund({
          id: buildEntityId("fund-3"),
          name: "Fundo Gama",
          cnpj: buildUniqueCnpj("333333333333"),
        })
      )
      const useCase = new ListFundsUseCase(fundRepository)

      const response = await useCase.execute({ limit: 2 })

      expect(response.map((fund) => fund.name)).toStrictEqual([
        "Fundo Alfa",
        "Fundo Beta",
      ])
    })

    it("should skip the leading rows when the input provides an offset", async () => {
      await fundRepository.save(
        buildFund({
          id: buildEntityId("fund-1"),
          name: "Fundo Alfa",
          cnpj: buildUniqueCnpj("111111111111"),
        })
      )
      await fundRepository.save(
        buildFund({
          id: buildEntityId("fund-2"),
          name: "Fundo Beta",
          cnpj: buildUniqueCnpj("222222222222"),
        })
      )
      await fundRepository.save(
        buildFund({
          id: buildEntityId("fund-3"),
          name: "Fundo Gama",
          cnpj: buildUniqueCnpj("333333333333"),
        })
      )
      const useCase = new ListFundsUseCase(fundRepository)

      const response = await useCase.execute({
        limit: 1,
        offset: 1,
      })

      expect(response.map((fund) => fund.name)).toStrictEqual([
        "Fundo Beta",
      ])
    })

    it("should map every row to the response DTO when listing funds", async () => {
      await fundRepository.save(
        buildFund({
          id: buildEntityId("fund-1"),
          name: "Fundo Alfa",
          cnpj: buildUniqueCnpj("111111111111"),
          createdAt: new Date("2026-05-01T00:00:00.000Z"),
          updatedAt: new Date("2026-05-02T00:00:00.000Z"),
        })
      )
      const useCase = new ListFundsUseCase(fundRepository)

      const response = await useCase.execute({})

      expect(response[0].createdAt).toBe(
        "2026-05-01T00:00:00.000Z"
      )
      expect(response[0].updatedAt).toBe(
        "2026-05-02T00:00:00.000Z"
      )
      expect(response[0].id).toBe("fund-1")
    })
  })
})
