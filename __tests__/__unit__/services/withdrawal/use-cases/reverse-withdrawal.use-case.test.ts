import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { ReverseWithdrawalUseCase } from "@/services/withdrawal/use-cases/reverse-withdrawal.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakeWithdrawalRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildWithdrawal,
} from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  useRealClock,
  getFixedDate,
} from "__tests__/__setup__/_clock.setup"

const ID = "00000000-0000-0000-0000-000000000001"
const USER_ID = "user-1"

describe("services/withdrawal/use-cases/reverse-withdrawal.use-case", () => {
  let withdrawalRepository: ReturnType<
    typeof createFakeWithdrawalRepository
  >

  beforeEach(() => {
    useFixedClock()
    withdrawalRepository = createFakeWithdrawalRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  describe("execute", () => {
    it("should stamp the reversal date and user when the withdrawal exists", async () => {
      await withdrawalRepository.save(
        buildWithdrawal({
          id: buildEntityId(ID),
          reversedAt: null,
          reversedByUserId: null,
        })
      )
      const useCase = new ReverseWithdrawalUseCase(
        withdrawalRepository
      )

      const response = await useCase.execute({
        withdrawalId: ID,
        reversedByUserId: USER_ID,
      })

      expect(response.reversedAt).toBe(
        getFixedDate().toISOString()
      )
      expect(response.reversedByUserId).toBe(USER_ID)
    })

    it("should persist the reversed withdrawal under the same id", async () => {
      await withdrawalRepository.save(
        buildWithdrawal({
          id: buildEntityId(ID),
          reversedAt: null,
          reversedByUserId: null,
        })
      )
      const useCase = new ReverseWithdrawalUseCase(
        withdrawalRepository
      )

      const response = await useCase.execute({
        withdrawalId: ID,
        reversedByUserId: USER_ID,
      })

      const stored = await withdrawalRepository.findById(
        buildEntityId(ID)
      )

      expect(response.id).toBe(ID)
      expect(stored?.reversedByUserId).toBe(USER_ID)
      expect(stored?.reversedAt).not.toBeNull()
    })

    it("should throw NotFoundError when the withdrawal does not exist", async () => {
      const useCase = new ReverseWithdrawalUseCase(
        withdrawalRepository
      )

      await expect(
        useCase.execute({
          withdrawalId: ID,
          reversedByUserId: USER_ID,
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw ValidationError when the withdrawal is already reversed", async () => {
      await withdrawalRepository.save(
        buildWithdrawal({
          id: buildEntityId(ID),
          reversedAt: new Date("2026-03-20T18:00:00.000Z"),
          reversedByUserId: buildEntityId("user-9"),
        })
      )
      const useCase = new ReverseWithdrawalUseCase(
        withdrawalRepository
      )

      await expect(
        useCase.execute({
          withdrawalId: ID,
          reversedByUserId: USER_ID,
        })
      ).rejects.toThrow(ValidationError)
    })
  })
})
