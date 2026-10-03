import { describe, it, expect, beforeEach } from "vitest"

import { GetTransactionAllocationUseCase } from "@/services/transaction-allocation/use-cases/get-transaction-allocation.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { createFakeTransactionAllocationRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildQuotaQuantity,
  buildTransactionAllocation,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"

describe("services/transaction-allocation/use-cases/get-transaction-allocation.use-case", () => {
  let transactionAllocationRepository: ReturnType<
    typeof createFakeTransactionAllocationRepository
  >

  beforeEach(() => {
    transactionAllocationRepository =
      createFakeTransactionAllocationRepository()
  })

  describe("execute", () => {
    it("should return the stored allocation when the id matches", async () => {
      await transactionAllocationRepository.save(
        buildTransactionAllocation({
          id: buildEntityId(ID),
          applicationId: buildEntityId("application-42"),
          withdrawId: buildEntityId("withdrawal-42"),
          quotasConsumed: buildQuotaQuantity("250.25"),
          createdAt: new Date("2026-01-20T10:00:00.000Z"),
        })
      )
      const useCase = new GetTransactionAllocationUseCase(
        transactionAllocationRepository
      )

      const response = await useCase.execute({
        transactionAllocationId: ID,
      })

      expect(response.id).toBe(ID)
      expect(response.applicationId).toBe("application-42")
      expect(response.withdrawId).toBe("withdrawal-42")
      expect(response.quotasConsumed).toBe("250.25")
      expect(response.createdAt).toBe("2026-01-20T10:00:00.000Z")
    })

    it("should throw NotFoundError when the allocation does not exist", async () => {
      const useCase = new GetTransactionAllocationUseCase(
        transactionAllocationRepository
      )

      await expect(
        useCase.execute({ transactionAllocationId: ID })
      ).rejects.toThrow(NotFoundError)
    })
  })
})
