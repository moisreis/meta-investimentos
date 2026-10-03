import { describe, it, expect, beforeEach } from "vitest"

import { ListWithdrawalsUseCase } from "@/services/withdrawal/use-cases/list-withdrawals.use-case"
import { createFakeWithdrawalRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPositiveMoney,
  buildWithdrawal,
} from "__tests__/__setup__/_factories.setup"

describe("services/withdrawal/use-cases/list-withdrawals.use-case", () => {
  let withdrawalRepository: ReturnType<
    typeof createFakeWithdrawalRepository
  >

  beforeEach(() => {
    withdrawalRepository = createFakeWithdrawalRepository()
  })

  describe("execute", () => {
    it("should return the withdrawals of the position sorted by date", async () => {
      await withdrawalRepository.save(
        buildWithdrawal({
          id: buildEntityId("withdrawal-2"),
          positionId: buildEntityId("position-1"),
          date: new Date("2026-03-15"),
        })
      )
      await withdrawalRepository.save(
        buildWithdrawal({
          id: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
          date: new Date("2026-02-15"),
        })
      )
      const useCase = new ListWithdrawalsUseCase(
        withdrawalRepository
      )

      const response = await useCase.execute({
        positionId: "position-1",
      })

      expect(response.map((row) => row.id)).toEqual([
        "withdrawal-1",
        "withdrawal-2",
      ])
    })

    it("should serialize every withdrawal of the position", async () => {
      await withdrawalRepository.save(
        buildWithdrawal({
          id: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
          amount: buildPositiveMoney("750.25"),
        })
      )
      const useCase = new ListWithdrawalsUseCase(
        withdrawalRepository
      )

      const response = await useCase.execute({
        positionId: "position-1",
      })

      expect(response.length).toBe(1)
      expect(response[0].amount).toBe("750.25")
      expect(response[0].positionId).toBe("position-1")
    })

    it("should ignore the withdrawals of another position", async () => {
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
      const useCase = new ListWithdrawalsUseCase(
        withdrawalRepository
      )

      const response = await useCase.execute({
        positionId: "position-1",
      })

      expect(response.length).toBe(1)
      expect(response[0].positionId).toBe("position-1")
    })

    it("should return an empty array when the position has no withdrawal", async () => {
      await withdrawalRepository.save(
        buildWithdrawal({
          id: buildEntityId("withdrawal-2"),
          positionId: buildEntityId("position-9"),
        })
      )
      const useCase = new ListWithdrawalsUseCase(
        withdrawalRepository
      )

      const response = await useCase.execute({
        positionId: "position-1",
      })

      expect(response).toEqual([])
      expect(response.length).toBe(0)
    })
  })
})
