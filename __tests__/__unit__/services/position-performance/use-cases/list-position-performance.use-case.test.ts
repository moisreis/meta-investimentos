import { describe, it, expect, beforeEach } from "vitest"

import { ListPositionPerformanceUseCase } from "@/services/position-performance/use-cases/list-position-performance.use-case"
import { ValidationError } from "@errors/validation.error"
import { createFakePositionPerformanceRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPositionPerformance,
} from "__tests__/__setup__/_factories.setup"

const POSITION_ID = "00000000-0000-0000-0000-0000000000b1"
const OTHER_POSITION = "00000000-0000-0000-0000-0000000000b2"

describe("services/position-performance/use-cases/list-position-performance.use-case", () => {
  let positionPerformanceRepository: ReturnType<
    typeof createFakePositionPerformanceRepository
  >

  beforeEach(() => {
    positionPerformanceRepository =
      createFakePositionPerformanceRepository()
  })

  describe("execute", () => {
    it("should return every snapshot of the position ordered by date ascending", async () => {
      await positionPerformanceRepository.save(
        buildPositionPerformance({
          positionId: buildEntityId(POSITION_ID),
          date: new Date("2026-02-28T00:00:00.000Z"),
        })
      )
      await positionPerformanceRepository.save(
        buildPositionPerformance({
          positionId: buildEntityId(POSITION_ID),
          date: new Date("2026-01-31T00:00:00.000Z"),
        })
      )
      const useCase = new ListPositionPerformanceUseCase(
        positionPerformanceRepository
      )

      const response = await useCase.execute({
        positionId: POSITION_ID,
      })

      expect(
        response.map((performance) => performance.date)
      ).toEqual([
        "2026-01-31T00:00:00.000Z",
        "2026-02-28T00:00:00.000Z",
      ])
    })

    it("should skip the snapshots of the other positions", async () => {
      await positionPerformanceRepository.save(
        buildPositionPerformance({
          positionId: buildEntityId(POSITION_ID),
          date: new Date("2026-01-31T00:00:00.000Z"),
        })
      )
      await positionPerformanceRepository.save(
        buildPositionPerformance({
          positionId: buildEntityId(OTHER_POSITION),
          date: new Date("2026-01-31T00:00:00.000Z"),
        })
      )
      const useCase = new ListPositionPerformanceUseCase(
        positionPerformanceRepository
      )

      const response = await useCase.execute({
        positionId: POSITION_ID,
      })

      expect(response.length).toBe(1)
      expect(response[0].positionId).toBe(POSITION_ID)
    })

    it("should map every snapshot to the response payload when listing performances", async () => {
      const saved = await positionPerformanceRepository.save(
        buildPositionPerformance({
          positionId: buildEntityId(POSITION_ID),
          date: new Date("2026-01-31T00:00:00.000Z"),
        })
      )
      const useCase = new ListPositionPerformanceUseCase(
        positionPerformanceRepository
      )

      const response = await useCase.execute({
        positionId: POSITION_ID,
      })

      expect(response[0]).toEqual({
        id: saved.id as string,
        positionId: POSITION_ID,
        date: "2026-01-31T00:00:00.000Z",
        quotasHeld: "1000",
        patrimony: "50000",
        applicationTotal: "10000",
        redemptionTotal: "5000",
        cashFlowNet: "5000",
        earnings: "1000",
        returnDaily: "0.5",
        returnMonthly: null,
        returnYearly: null,
        returnLast12m: null,
        allocation: "50",
        createdAt: saved.createdAt.toISOString(),
      })
    })

    it("should return an empty collection when the position holds no snapshot", async () => {
      const useCase = new ListPositionPerformanceUseCase(
        positionPerformanceRepository
      )

      const response = await useCase.execute({
        positionId: POSITION_ID,
      })

      expect(response).toEqual([])
    })

    it("should throw ValidationError when the position id is blank", async () => {
      const useCase = new ListPositionPerformanceUseCase(
        positionPerformanceRepository
      )

      await expect(
        useCase.execute({ positionId: "  " })
      ).rejects.toThrow(ValidationError)
    })
  })
})
