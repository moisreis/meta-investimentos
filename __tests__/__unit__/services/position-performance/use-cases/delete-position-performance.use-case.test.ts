import { describe, it, expect, beforeEach } from "vitest"

import { DeletePositionPerformanceUseCase } from "@/services/position-performance/use-cases/delete-position-performance.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakePositionPerformanceRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPositionPerformance,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"

describe("services/position-performance/use-cases/delete-position-performance.use-case", () => {
  let positionPerformanceRepository: ReturnType<
    typeof createFakePositionPerformanceRepository
  >

  beforeEach(() => {
    positionPerformanceRepository =
      createFakePositionPerformanceRepository()
  })

  describe("execute", () => {
    it("should remove the row when the performance exists", async () => {
      const saved = await positionPerformanceRepository.save(
        buildPositionPerformance({ id: buildEntityId(ID) })
      )
      const useCase = new DeletePositionPerformanceUseCase(
        positionPerformanceRepository
      )

      await useCase.execute({ performanceId: saved.id! })

      expect(
        await positionPerformanceRepository.findById(saved.id!)
      ).toBeNull()
    })

    it("should throw NotFoundError when the performance does not exist", async () => {
      const useCase = new DeletePositionPerformanceUseCase(
        positionPerformanceRepository
      )

      await expect(
        useCase.execute({ performanceId: ID })
      ).rejects.toThrow(NotFoundError)
    })

    it("should leave the other rows untouched when the performance exists", async () => {
      const target = await positionPerformanceRepository.save(
        buildPositionPerformance({
          id: buildEntityId(ID),
          date: new Date("2026-01-31T00:00:00.000Z"),
        })
      )
      const other = await positionPerformanceRepository.save(
        buildPositionPerformance({
          date: new Date("2026-02-28T00:00:00.000Z"),
        })
      )
      const useCase = new DeletePositionPerformanceUseCase(
        positionPerformanceRepository
      )

      await useCase.execute({ performanceId: target.id! })

      expect(
        await positionPerformanceRepository.findById(other.id!)
      ).not.toBeNull()
    })

    it("should keep every row when the performance does not exist", async () => {
      const other = await positionPerformanceRepository.save(
        buildPositionPerformance()
      )
      const useCase = new DeletePositionPerformanceUseCase(
        positionPerformanceRepository
      )

      await expect(
        useCase.execute({ performanceId: ID })
      ).rejects.toThrow(NotFoundError)

      expect(
        await positionPerformanceRepository.findById(other.id!)
      ).not.toBeNull()
    })

    it("should throw ValidationError when the performance id is blank", async () => {
      const useCase = new DeletePositionPerformanceUseCase(
        positionPerformanceRepository
      )

      await expect(
        useCase.execute({ performanceId: "   " })
      ).rejects.toThrow(ValidationError)
    })
  })
})
