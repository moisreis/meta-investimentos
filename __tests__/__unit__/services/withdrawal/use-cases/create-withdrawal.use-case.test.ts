import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { CreateWithdrawalUseCase } from "@/services/withdrawal/use-cases/create-withdrawal.use-case"
import { NotFoundError } from "@errors/not-found.error"
import {
  createFakePositionRepository,
  createFakeWithdrawalRepository,
} from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPosition,
} from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  useRealClock,
  getFixedDate,
} from "__tests__/__setup__/_clock.setup"

const POSITION_ID = "position-1"
const DATE = "2026-02-15T00:00:00.000Z"

describe("services/withdrawal/use-cases/create-withdrawal.use-case", () => {
  let withdrawalRepository: ReturnType<
    typeof createFakeWithdrawalRepository
  >
  let positionRepository: ReturnType<
    typeof createFakePositionRepository
  >

  beforeEach(() => {
    useFixedClock()
    withdrawalRepository = createFakeWithdrawalRepository()
    positionRepository = createFakePositionRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  describe("execute", () => {
    it("should persist one row built from the payload when the position exists", async () => {
      await positionRepository.save(
        buildPosition({ id: buildEntityId(POSITION_ID) })
      )
      const useCase = new CreateWithdrawalUseCase(
        withdrawalRepository,
        positionRepository
      )

      const response = await useCase.execute({
        positionId: POSITION_ID,
        date: DATE,
        amount: "500.00",
        quotas: "40.00",
      })

      const stored =
        await withdrawalRepository.findAllByPositionId(
          buildEntityId(POSITION_ID)
        )

      expect(stored.length).toBe(1)
      expect(response.positionId).toBe(POSITION_ID)
      expect(response.amount).toBe("500")
      expect(response.quotas).toBe("40")
      expect(response.date).toBe(DATE)
    })

    it("should expose an assigned id and empty reversal fields when creating a withdrawal", async () => {
      await positionRepository.save(
        buildPosition({ id: buildEntityId(POSITION_ID) })
      )
      const useCase = new CreateWithdrawalUseCase(
        withdrawalRepository,
        positionRepository
      )

      const response = await useCase.execute({
        positionId: POSITION_ID,
        date: DATE,
        amount: "500.00",
        quotas: "40.00",
      })

      expect(response.id).toBeDefined()
      expect(response.reversedAt).toBeNull()
      expect(response.reversedByUserId).toBeNull()
      expect(response.createdAt).toBe(
        getFixedDate().toISOString()
      )
    })

    it("should throw NotFoundError when the position does not exist", async () => {
      const useCase = new CreateWithdrawalUseCase(
        withdrawalRepository,
        positionRepository
      )

      await expect(
        useCase.execute({
          positionId: POSITION_ID,
          date: DATE,
          amount: "500.00",
          quotas: "40.00",
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should not persist any withdrawal when the position does not exist", async () => {
      const useCase = new CreateWithdrawalUseCase(
        withdrawalRepository,
        positionRepository
      )

      await expect(
        useCase.execute({
          positionId: POSITION_ID,
          date: DATE,
          amount: "500.00",
          quotas: "40.00",
        })
      ).rejects.toThrow(NotFoundError)

      const stored =
        await withdrawalRepository.findAllByPositionId(
          buildEntityId(POSITION_ID)
        )

      expect(stored.length).toBe(0)
    })
  })
})
