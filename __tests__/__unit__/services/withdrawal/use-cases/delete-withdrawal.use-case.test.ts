import { describe, it, expect, beforeEach } from "vitest"

import { DeleteWithdrawalUseCase } from "@/services/withdrawal/use-cases/delete-withdrawal.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { createFakeWithdrawalRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildWithdrawal,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"

describe("services/withdrawal/use-cases/delete-withdrawal.use-case", () => {
  let withdrawalRepository: ReturnType<
    typeof createFakeWithdrawalRepository
  >

  beforeEach(() => {
    withdrawalRepository = createFakeWithdrawalRepository()
  })

  describe("execute", () => {
    it("should remove the row when the withdrawal exists", async () => {
      const saved = await withdrawalRepository.save(
        buildWithdrawal({ id: buildEntityId(ID) })
      )
      const useCase = new DeleteWithdrawalUseCase(
        withdrawalRepository
      )

      await useCase.execute({ withdrawalId: saved.id! })

      expect(
        await withdrawalRepository.findById(saved.id!)
      ).toBeNull()
    })

    it("should throw NotFoundError when the withdrawal does not exist", async () => {
      const useCase = new DeleteWithdrawalUseCase(
        withdrawalRepository
      )

      await expect(
        useCase.execute({ withdrawalId: ID })
      ).rejects.toThrow(NotFoundError)
    })

    it("should leave the other rows untouched when the withdrawal exists", async () => {
      const target = await withdrawalRepository.save(
        buildWithdrawal({ id: buildEntityId(ID) })
      )
      const other = await withdrawalRepository.save(
        buildWithdrawal({
          id: buildEntityId(
            "00000000-0000-0000-0000-000000000002"
          ),
        })
      )
      const useCase = new DeleteWithdrawalUseCase(
        withdrawalRepository
      )

      await useCase.execute({ withdrawalId: target.id! })

      expect(
        await withdrawalRepository.findById(other.id!)
      ).not.toBeNull()
    })
  })
})
