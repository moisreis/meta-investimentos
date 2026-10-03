import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { UpdatePositionUseCase } from "@/services/position/use-cases/update-position.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakePositionRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPosition,
} from "__tests__/__setup__/_factories.setup"
import {
  getFixedDate,
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

const ID = "00000000-0000-0000-0000-000000000001"

describe("services/position/use-cases/update-position.use-case", () => {
  let positionRepository: ReturnType<
    typeof createFakePositionRepository
  >

  beforeEach(() => {
    useFixedClock()
    positionRepository = createFakePositionRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  describe("execute", () => {
    it("should return the updated balance when the position exists", async () => {
      const saved = await positionRepository.save(
        buildPosition({
          id: buildEntityId(ID),
          fundId: buildEntityId("fund-1"),
        })
      )
      const useCase = new UpdatePositionUseCase(
        positionRepository
      )

      const response = await useCase.execute({
        positionId: saved.id!,
        initialBalance: "1500.005",
        initialBalanceDate: "2026-02-01T00:00:00.000Z",
      })

      expect(response.id).toBe(ID)
      expect(response.initialBalance).toBe("1500.01")
      expect(response.initialBalanceDate).toBe(
        "2026-02-01T00:00:00.000Z"
      )
      expect(response.updatedAt).toBe(
        getFixedDate().toISOString()
      )
    })

    it("should persist the new balance under the same row when the position exists", async () => {
      const saved = await positionRepository.save(
        buildPosition({
          id: buildEntityId(ID),
          fundId: buildEntityId("fund-1"),
        })
      )
      const useCase = new UpdatePositionUseCase(
        positionRepository
      )

      await useCase.execute({
        positionId: saved.id!,
        initialBalance: "2500.00",
        initialBalanceDate: "2026-02-01T00:00:00.000Z",
      })

      const stored = await positionRepository.findById(saved.id!)

      expect(stored?.initialBalance?.value.toString()).toBe(
        "2500"
      )
      expect(stored?.allocation.value.toString()).toBe("100")
    })

    it("should throw NotFoundError when the position does not exist", async () => {
      const useCase = new UpdatePositionUseCase(
        positionRepository
      )

      await expect(
        useCase.execute({
          positionId: ID,
          initialBalance: "1500.00",
          initialBalanceDate: "2026-02-01T00:00:00.000Z",
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should leave the stored row untouched when the position does not exist", async () => {
      const other = await positionRepository.save(
        buildPosition({ fundId: buildEntityId("fund-2") })
      )
      const useCase = new UpdatePositionUseCase(
        positionRepository
      )

      await expect(
        useCase.execute({
          positionId: ID,
          initialBalance: "1500.00",
          initialBalanceDate: "2026-02-01T00:00:00.000Z",
        })
      ).rejects.toThrow(NotFoundError)

      const stored = await positionRepository.findById(other.id!)

      expect(stored?.initialBalance?.value.toString()).toBe(
        "10000"
      )
    })

    it("should throw ValidationError when the initial balance is negative", async () => {
      const saved = await positionRepository.save(
        buildPosition({
          id: buildEntityId(ID),
          fundId: buildEntityId("fund-1"),
        })
      )
      const useCase = new UpdatePositionUseCase(
        positionRepository
      )

      await expect(
        useCase.execute({
          positionId: saved.id!,
          initialBalance: "-10.00",
          initialBalanceDate: "2026-02-01T00:00:00.000Z",
        })
      ).rejects.toThrow(ValidationError)
    })

    it("should throw ValidationError when the position id is blank", async () => {
      const useCase = new UpdatePositionUseCase(
        positionRepository
      )

      await expect(
        useCase.execute({
          positionId: "   ",
          initialBalance: "1500.00",
          initialBalanceDate: "2026-02-01T00:00:00.000Z",
        })
      ).rejects.toThrow(ValidationError)
    })
  })
})
