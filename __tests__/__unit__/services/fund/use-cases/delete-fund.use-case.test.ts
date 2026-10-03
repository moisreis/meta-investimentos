import { describe, it, expect, beforeEach } from "vitest"

import { DeleteFundUseCase } from "@/services/fund/use-cases/delete-fund.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakeFundRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildFund,
  buildUniqueCnpj,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000033"

describe("services/fund/use-cases/delete-fund.use-case", () => {
  let fundRepository: ReturnType<typeof createFakeFundRepository>

  beforeEach(() => {
    fundRepository = createFakeFundRepository()
  })

  describe("execute", () => {
    it("should remove the row when the fund exists", async () => {
      const saved = await fundRepository.save(
        buildFund({ id: buildEntityId(ID) })
      )
      const useCase = new DeleteFundUseCase(fundRepository)

      await useCase.execute({ fundId: saved.id! })

      expect(await fundRepository.findById(saved.id!)).toBeNull()
    })

    it("should leave the other rows untouched when the fund exists", async () => {
      const target = await fundRepository.save(
        buildFund({
          id: buildEntityId(ID),
          cnpj: buildUniqueCnpj("111111111111"),
        })
      )
      const other = await fundRepository.save(
        buildFund({
          id: buildEntityId("fund-other"),
          cnpj: buildUniqueCnpj("222222222222"),
        })
      )
      const useCase = new DeleteFundUseCase(fundRepository)

      await useCase.execute({ fundId: target.id! })

      expect(
        await fundRepository.findById(other.id!)
      ).not.toBeNull()
      expect(await fundRepository.findAll({})).toHaveLength(1)
    })

    it("should resolve without a payload when the fund exists", async () => {
      const saved = await fundRepository.save(
        buildFund({ id: buildEntityId(ID) })
      )
      const useCase = new DeleteFundUseCase(fundRepository)

      const response = await useCase.execute({
        fundId: saved.id!,
      })

      expect(response).toBeUndefined()
    })

    it("should throw NotFoundError when the fund does not exist", async () => {
      const useCase = new DeleteFundUseCase(fundRepository)

      await expect(
        useCase.execute({ fundId: ID })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw ValidationError when the fund id is blank", async () => {
      const useCase = new DeleteFundUseCase(fundRepository)

      await expect(
        useCase.execute({ fundId: "   " })
      ).rejects.toThrow(ValidationError)
    })
  })
})
