import { describe, it, expect, beforeEach } from "vitest"

import { DeletePositionUseCase } from "@/services/position/use-cases/delete-position.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakePositionRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPosition,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"

describe("services/position/use-cases/delete-position.use-case", () => {
  let positionRepository: ReturnType<
    typeof createFakePositionRepository
  >

  beforeEach(() => {
    positionRepository = createFakePositionRepository()
  })

  describe("execute", () => {
    it("should remove the row when the position exists", async () => {
      const saved = await positionRepository.save(
        buildPosition({
          id: buildEntityId(ID),
          fundId: buildEntityId("fund-1"),
        })
      )
      const useCase = new DeletePositionUseCase(
        positionRepository
      )

      await useCase.execute({ positionId: saved.id! })

      expect(
        await positionRepository.findById(saved.id!)
      ).toBeNull()
    })

    it("should throw NotFoundError when the position does not exist", async () => {
      const useCase = new DeletePositionUseCase(
        positionRepository
      )

      await expect(
        useCase.execute({ positionId: ID })
      ).rejects.toThrow(NotFoundError)
    })

    it("should leave the other rows untouched when the position exists", async () => {
      const target = await positionRepository.save(
        buildPosition({
          id: buildEntityId(ID),
          fundId: buildEntityId("fund-1"),
        })
      )
      const other = await positionRepository.save(
        buildPosition({ fundId: buildEntityId("fund-2") })
      )
      const useCase = new DeletePositionUseCase(
        positionRepository
      )

      await useCase.execute({ positionId: target.id! })

      expect(
        await positionRepository.findById(other.id!)
      ).not.toBeNull()
    })

    it("should keep every row when the position does not exist", async () => {
      const other = await positionRepository.save(
        buildPosition({ fundId: buildEntityId("fund-2") })
      )
      const useCase = new DeletePositionUseCase(
        positionRepository
      )

      await expect(
        useCase.execute({ positionId: ID })
      ).rejects.toThrow(NotFoundError)

      expect(
        await positionRepository.findById(other.id!)
      ).not.toBeNull()
    })

    it("should throw ValidationError when the position id is blank", async () => {
      const useCase = new DeletePositionUseCase(
        positionRepository
      )

      await expect(
        useCase.execute({ positionId: "  " })
      ).rejects.toThrow(ValidationError)
    })
  })
})
