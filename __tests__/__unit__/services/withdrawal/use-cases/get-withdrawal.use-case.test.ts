import { describe, it, expect, beforeEach } from "vitest"

import { GetWithdrawalUseCase } from "@/services/withdrawal/use-cases/get-withdrawal.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { createFakeWithdrawalRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPositiveMoney,
  buildQuotaQuantity,
  buildWithdrawal,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"

describe("services/withdrawal/use-cases/get-withdrawal.use-case", () => {
  let withdrawalRepository: ReturnType<
    typeof createFakeWithdrawalRepository
  >

  beforeEach(() => {
    withdrawalRepository = createFakeWithdrawalRepository()
  })

  describe("execute", () => {
    it("should return the stored withdrawal when the id matches", async () => {
      await withdrawalRepository.save(
        buildWithdrawal({
          id: buildEntityId(ID),
          positionId: buildEntityId("position-42"),
          date: new Date("2026-02-15T09:30:00.000Z"),
          amount: buildPositiveMoney("750.25"),
          quotas: buildQuotaQuantity("60.50"),
        })
      )
      const useCase = new GetWithdrawalUseCase(
        withdrawalRepository
      )

      const response = await useCase.execute({
        withdrawalId: ID,
      })

      expect(response.id).toBe(ID)
      expect(response.positionId).toBe("position-42")
      expect(response.date).toBe("2026-02-15T09:30:00.000Z")
      expect(response.amount).toBe("750.25")
      expect(response.quotas).toBe("60.5")
    })

    it("should expose null reversal fields when the withdrawal was not reversed", async () => {
      await withdrawalRepository.save(
        buildWithdrawal({
          id: buildEntityId(ID),
          reversedAt: null,
          reversedByUserId: null,
        })
      )
      const useCase = new GetWithdrawalUseCase(
        withdrawalRepository
      )

      const response = await useCase.execute({
        withdrawalId: ID,
      })

      expect(response.reversedAt).toBeNull()
      expect(response.reversedByUserId).toBeNull()
    })

    it("should throw NotFoundError when the withdrawal does not exist", async () => {
      const useCase = new GetWithdrawalUseCase(
        withdrawalRepository
      )

      await expect(
        useCase.execute({ withdrawalId: ID })
      ).rejects.toThrow(NotFoundError)
    })
  })
})
