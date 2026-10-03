import { describe, it, expect, beforeEach } from "vitest"

import { DeleteBankUseCase } from "@/services/bank/use-cases/delete-bank.use-case"
import { NotFoundError } from "@/errors/not-found.error"
import { createFakeBankRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildBank,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"

describe("services/bank/use-cases/delete-bank.use-case", () => {
  let bankRepository: ReturnType<typeof createFakeBankRepository>

  beforeEach(() => {
    bankRepository = createFakeBankRepository()
  })

  describe("execute", () => {
    it("should remove the row when the bank exists", async () => {
      const saved = await bankRepository.save(
        buildBank({ id: buildEntityId(ID) })
      )
      const useCase = new DeleteBankUseCase(bankRepository)

      await useCase.execute({ bankId: saved.id! })

      expect(await bankRepository.findById(saved.id!)).toBeNull()
    })

    it("should throw NotFoundError when the bank does not exist", async () => {
      const useCase = new DeleteBankUseCase(bankRepository)

      await expect(
        useCase.execute({ bankId: ID })
      ).rejects.toThrow(NotFoundError)
    })

    it("should leave the other rows untouched when the bank exists", async () => {
      const target = await bankRepository.save(
        buildBank({ id: buildEntityId(ID) })
      )
      const other = await bankRepository.save(buildBank())
      const useCase = new DeleteBankUseCase(bankRepository)

      await useCase.execute({ bankId: target.id! })

      expect(
        await bankRepository.findById(other.id!)
      ).not.toBeNull()
    })
  })
})
