import { describe, it, expect, beforeEach, vi } from "vitest"

import { ListAllWithdrawalsUseCase } from "@/services/withdrawal/use-cases/list-all-withdrawals.use-case"
import { createFakeWithdrawalRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildWithdrawal,
} from "__tests__/__setup__/_factories.setup"

describe("services/withdrawal/use-cases/list-all-withdrawals.use-case", () => {
  let withdrawalRepository: ReturnType<
    typeof createFakeWithdrawalRepository
  >

  beforeEach(() => {
    withdrawalRepository = createFakeWithdrawalRepository()
  })

  describe("execute", () => {
    it("should return an empty array when no position id is provided", async () => {
      await withdrawalRepository.save(
        buildWithdrawal({
          id: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
        })
      )
      const useCase = new ListAllWithdrawalsUseCase(
        withdrawalRepository
      )

      const response = await useCase.execute({
        positionIds: [],
      })

      expect(response).toEqual([])
    })

    it("should skip the repository lookup when no position id is provided", async () => {
      const spy = vi.spyOn(
        withdrawalRepository,
        "findAllByPositionIds"
      )
      const useCase = new ListAllWithdrawalsUseCase(
        withdrawalRepository
      )

      await useCase.execute({ positionIds: [] })

      expect(spy).not.toHaveBeenCalled()
    })

    it("should return the withdrawals of every provided position", async () => {
      await withdrawalRepository.save(
        buildWithdrawal({
          id: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
        })
      )
      await withdrawalRepository.save(
        buildWithdrawal({
          id: buildEntityId("withdrawal-2"),
          positionId: buildEntityId("position-2"),
        })
      )
      const useCase = new ListAllWithdrawalsUseCase(
        withdrawalRepository
      )

      const response = await useCase.execute({
        positionIds: ["position-1", "position-2"],
      })

      expect(response.length).toBe(2)
      expect(response.map((row) => row.id)).toEqual([
        "withdrawal-1",
        "withdrawal-2",
      ])
    })

    it("should ignore the withdrawals of positions outside the list", async () => {
      await withdrawalRepository.save(
        buildWithdrawal({
          id: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
        })
      )
      await withdrawalRepository.save(
        buildWithdrawal({
          id: buildEntityId("withdrawal-2"),
          positionId: buildEntityId("position-9"),
        })
      )
      const useCase = new ListAllWithdrawalsUseCase(
        withdrawalRepository
      )

      const response = await useCase.execute({
        positionIds: ["position-1"],
      })

      expect(response.length).toBe(1)
      expect(response[0].positionId).toBe("position-1")
    })

    it("should return an empty array when no withdrawal matches", async () => {
      const useCase = new ListAllWithdrawalsUseCase(
        withdrawalRepository
      )

      const response = await useCase.execute({
        positionIds: ["position-1"],
      })

      expect(response).toEqual([])
    })
  })
})
