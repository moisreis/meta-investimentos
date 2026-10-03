import { describe, it, expect, beforeEach } from "vitest"

import { GetPositionUseCase } from "@/services/position/use-cases/get-position.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakePositionRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPosition,
  buildPositiveMoney,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"

describe("services/position/use-cases/get-position.use-case", () => {
  let positionRepository: ReturnType<
    typeof createFakePositionRepository
  >

  beforeEach(() => {
    positionRepository = createFakePositionRepository()
  })

  describe("execute", () => {
    it("should return the mapped position when it exists", async () => {
      const saved = await positionRepository.save(
        buildPosition({
          id: buildEntityId(ID),
          fundId: buildEntityId("fund-1"),
          initialBalance: buildPositiveMoney("12345.678"),
          initialBalanceDate: new Date(
            "2026-01-01T00:00:00.000Z"
          ),
          allocation: buildSignedPercentage("40"),
        })
      )
      const useCase = new GetPositionUseCase(positionRepository)

      const response = await useCase.execute({
        positionId: saved.id!,
      })

      expect(response.id).toBe(ID)
      expect(response.initialBalance).toBe("12345.68")
      expect(response.initialBalanceDate).toBe(
        "2026-01-01T00:00:00.000Z"
      )
      expect(response.allocation).toBe("40")
    })

    it("should map the initial balance to null when the position has none", async () => {
      const saved = await positionRepository.save(
        buildPosition({
          id: buildEntityId(ID),
          fundId: buildEntityId("fund-1"),
          initialBalance: null,
          initialBalanceDate: null,
        })
      )
      const useCase = new GetPositionUseCase(positionRepository)

      const response = await useCase.execute({
        positionId: saved.id!,
      })

      expect(response.initialBalance).toBeNull()
      expect(response.initialBalanceDate).toBeNull()
    })

    it("should throw NotFoundError when the position does not exist", async () => {
      const useCase = new GetPositionUseCase(positionRepository)

      await expect(
        useCase.execute({ positionId: ID })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw ValidationError when the position id is blank", async () => {
      const useCase = new GetPositionUseCase(positionRepository)

      await expect(
        useCase.execute({ positionId: " " })
      ).rejects.toThrow(ValidationError)
    })
  })
})
