import { describe, it, expect, beforeEach } from "vitest"

import { ListTransactionAllocationsUseCase } from "@/services/transaction-allocation/use-cases/list-transaction-allocations.use-case"
import { createFakeTransactionAllocationRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildQuotaQuantity,
  buildTransactionAllocation,
} from "__tests__/__setup__/_factories.setup"

describe("services/transaction-allocation/use-cases/list-transaction-allocations.use-case", () => {
  let transactionAllocationRepository: ReturnType<
    typeof createFakeTransactionAllocationRepository
  >

  beforeEach(() => {
    transactionAllocationRepository =
      createFakeTransactionAllocationRepository()
  })

  describe("execute", () => {
    it("should return the allocations of the withdrawal", async () => {
      await transactionAllocationRepository.save(
        buildTransactionAllocation({
          id: buildEntityId("allocation-1"),
          applicationId: buildEntityId("application-1"),
          withdrawId: buildEntityId("withdrawal-1"),
        })
      )
      await transactionAllocationRepository.save(
        buildTransactionAllocation({
          id: buildEntityId("allocation-2"),
          applicationId: buildEntityId("application-2"),
          withdrawId: buildEntityId("withdrawal-1"),
          quotasConsumed: buildQuotaQuantity("75.50"),
        })
      )
      const useCase = new ListTransactionAllocationsUseCase(
        transactionAllocationRepository
      )

      const response = await useCase.execute({
        withdrawalId: "withdrawal-1",
      })

      expect(response.length).toBe(2)
      expect(response.map((row) => row.id)).toEqual([
        "allocation-1",
        "allocation-2",
      ])
      expect(response[1].quotasConsumed).toBe("75.5")
    })

    it("should ignore the allocations of another withdrawal", async () => {
      await transactionAllocationRepository.save(
        buildTransactionAllocation({
          id: buildEntityId("allocation-1"),
          applicationId: buildEntityId("application-1"),
          withdrawId: buildEntityId("withdrawal-1"),
        })
      )
      await transactionAllocationRepository.save(
        buildTransactionAllocation({
          id: buildEntityId("allocation-2"),
          applicationId: buildEntityId("application-2"),
          withdrawId: buildEntityId("withdrawal-9"),
        })
      )
      const useCase = new ListTransactionAllocationsUseCase(
        transactionAllocationRepository
      )

      const response = await useCase.execute({
        withdrawalId: "withdrawal-1",
      })

      expect(response.length).toBe(1)
      expect(response[0].withdrawId).toBe("withdrawal-1")
    })

    it("should return an empty array when the withdrawal has no allocation", async () => {
      const useCase = new ListTransactionAllocationsUseCase(
        transactionAllocationRepository
      )

      const response = await useCase.execute({
        withdrawalId: "withdrawal-1",
      })

      expect(response).toEqual([])
      expect(response.length).toBe(0)
    })
  })
})
