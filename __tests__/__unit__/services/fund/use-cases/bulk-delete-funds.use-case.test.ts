import { describe, it, expect, beforeEach } from "vitest"

import { BulkDeleteFundsUseCase } from "@/services/fund/use-cases/bulk-delete-funds.use-case"
import { createFakeFundRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildFund,
  buildUniqueCnpj,
} from "__tests__/__setup__/_factories.setup"

const FIRST = "00000000-0000-0000-0000-000000000041"
const SECOND = "00000000-0000-0000-0000-000000000042"
const MISSING = "00000000-0000-0000-0000-000000000099"

describe("services/fund/use-cases/bulk-delete-funds.use-case", () => {
  let fundRepository: ReturnType<typeof createFakeFundRepository>

  beforeEach(() => {
    fundRepository = createFakeFundRepository()
  })

  describe("execute", () => {
    it("should remove every matching row when all ids exist", async () => {
      const first = await fundRepository.save(
        buildFund({
          id: buildEntityId(FIRST),
          cnpj: buildUniqueCnpj("111111111111"),
        })
      )
      const second = await fundRepository.save(
        buildFund({
          id: buildEntityId(SECOND),
          cnpj: buildUniqueCnpj("222222222222"),
        })
      )
      const useCase = new BulkDeleteFundsUseCase(fundRepository)

      await useCase.execute({
        fundIds: [first.id!, second.id!],
      })

      expect(await fundRepository.findAll({})).toStrictEqual([])
    })

    it("should delete only the existing rows when the id list mixes found and missing ids", async () => {
      const first = await fundRepository.save(
        buildFund({
          id: buildEntityId(FIRST),
          cnpj: buildUniqueCnpj("111111111111"),
        })
      )
      const second = await fundRepository.save(
        buildFund({
          id: buildEntityId(SECOND),
          cnpj: buildUniqueCnpj("222222222222"),
        })
      )
      const useCase = new BulkDeleteFundsUseCase(fundRepository)

      await useCase.execute({
        fundIds: [first.id!, MISSING, second.id!],
      })

      expect(await fundRepository.findAll({})).toStrictEqual([])
    })

    it("should keep the untouched rows when the id list mixes found and missing ids", async () => {
      const target = await fundRepository.save(
        buildFund({
          id: buildEntityId(FIRST),
          cnpj: buildUniqueCnpj("111111111111"),
        })
      )
      const other = await fundRepository.save(
        buildFund({
          id: buildEntityId(SECOND),
          cnpj: buildUniqueCnpj("222222222222"),
        })
      )
      const useCase = new BulkDeleteFundsUseCase(fundRepository)

      await useCase.execute({
        fundIds: [target.id!, MISSING],
      })

      expect(
        await fundRepository.findById(other.id!)
      ).not.toBeNull()
    })

    it("should keep every row when the id list is empty", async () => {
      const saved = await fundRepository.save(
        buildFund({
          id: buildEntityId(FIRST),
          cnpj: buildUniqueCnpj("111111111111"),
        })
      )
      const useCase = new BulkDeleteFundsUseCase(fundRepository)

      await useCase.execute({ fundIds: [] })

      expect(
        await fundRepository.findById(saved.id!)
      ).not.toBeNull()
    })

    it("should keep every row when no id matches", async () => {
      const saved = await fundRepository.save(
        buildFund({
          id: buildEntityId(FIRST),
          cnpj: buildUniqueCnpj("111111111111"),
        })
      )
      const useCase = new BulkDeleteFundsUseCase(fundRepository)

      await useCase.execute({ fundIds: [MISSING] })

      expect(
        await fundRepository.findById(saved.id!)
      ).not.toBeNull()
    })

    it("should resolve without a payload when the id list is empty", async () => {
      const useCase = new BulkDeleteFundsUseCase(fundRepository)

      const response = await useCase.execute({ fundIds: [] })

      expect(response).toBeUndefined()
    })
  })
})
