import { describe, it, expect, beforeEach } from "vitest"

import { GetPositionPerformanceUseCase } from "@/services/position-performance/use-cases/get-position-performance.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakePositionPerformanceRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPositionPerformance,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"

describe("services/position-performance/use-cases/get-position-performance.use-case", () => {
  let positionPerformanceRepository: ReturnType<
    typeof createFakePositionPerformanceRepository
  >

  beforeEach(() => {
    positionPerformanceRepository =
      createFakePositionPerformanceRepository()
  })

  describe("execute", () => {
    it("should return the mapped performance when it exists", async () => {
      const saved = await positionPerformanceRepository.save(
        buildPositionPerformance({
          id: buildEntityId(ID),
          positionId: buildEntityId("position-1"),
          date: new Date("2026-01-31T00:00:00.000Z"),
        })
      )
      const useCase = new GetPositionPerformanceUseCase(
        positionPerformanceRepository
      )

      const response = await useCase.execute({ id: saved.id! })

      expect(response.id).toBe(ID)
      expect(response.positionId).toBe("position-1")
      expect(response.date).toBe("2026-01-31T00:00:00.000Z")
      expect(response.quotasHeld).toBe("1000")
      expect(response.patrimony).toBe("50000")
      expect(response.allocation).toBe("50")
    })

    it("should map the trailing returns to null when the performance has none", async () => {
      const saved = await positionPerformanceRepository.save(
        buildPositionPerformance({
          id: buildEntityId(ID),
          returnMonthly: null,
          returnYearly: null,
          returnLast12m: null,
        })
      )
      const useCase = new GetPositionPerformanceUseCase(
        positionPerformanceRepository
      )

      const response = await useCase.execute({ id: saved.id! })

      expect(response.returnMonthly).toBeNull()
      expect(response.returnYearly).toBeNull()
      expect(response.returnLast12m).toBeNull()
    })

    it("should map the trailing returns to strings when the performance has them", async () => {
      const saved = await positionPerformanceRepository.save(
        buildPositionPerformance({
          id: buildEntityId(ID),
          returnMonthly: buildSignedPercentage("3.25"),
          returnYearly: buildSignedPercentage("12.50"),
          returnLast12m: buildSignedPercentage("-1.5"),
        })
      )
      const useCase = new GetPositionPerformanceUseCase(
        positionPerformanceRepository
      )

      const response = await useCase.execute({ id: saved.id! })

      expect(response.returnMonthly).toBe("3.25")
      expect(response.returnYearly).toBe("12.5")
      expect(response.returnLast12m).toBe("-1.5")
    })

    it("should throw NotFoundError when the performance does not exist", async () => {
      const useCase = new GetPositionPerformanceUseCase(
        positionPerformanceRepository
      )

      await expect(useCase.execute({ id: ID })).rejects.toThrow(
        NotFoundError
      )
    })

    it("should throw ValidationError when the id is blank", async () => {
      const useCase = new GetPositionPerformanceUseCase(
        positionPerformanceRepository
      )

      await expect(useCase.execute({ id: " " })).rejects.toThrow(
        ValidationError
      )
    })
  })
})
