import { describe, it, expect, beforeEach } from "vitest"

import { ListAllPositionPerformancesUseCase } from "@/services/position-performance/use-cases/list-all-position-performances.use-case"
import { createFakePositionPerformanceRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPositionPerformance,
} from "__tests__/__setup__/_factories.setup"

const FIRST_POSITION = "00000000-0000-0000-0000-0000000000b1"
const SECOND_POSITION = "00000000-0000-0000-0000-0000000000b2"
const OTHER_POSITION = "00000000-0000-0000-0000-0000000000b3"

describe("services/position-performance/use-cases/list-all-position-performances.use-case", () => {
  let positionPerformanceRepository: ReturnType<
    typeof createFakePositionPerformanceRepository
  >

  beforeEach(() => {
    positionPerformanceRepository =
      createFakePositionPerformanceRepository()
  })

  describe("execute", () => {
    it("should return an empty collection when no position is provided", async () => {
      await positionPerformanceRepository.save(
        buildPositionPerformance({
          positionId: buildEntityId(FIRST_POSITION),
        })
      )
      const useCase = new ListAllPositionPerformancesUseCase(
        positionPerformanceRepository
      )

      const response = await useCase.execute({ positionIds: [] })

      expect(response).toEqual([])
    })

    it("should return the performances of every provided position", async () => {
      const first = await positionPerformanceRepository.save(
        buildPositionPerformance({
          positionId: buildEntityId(FIRST_POSITION),
          date: new Date("2026-01-31T00:00:00.000Z"),
        })
      )
      const second = await positionPerformanceRepository.save(
        buildPositionPerformance({
          positionId: buildEntityId(SECOND_POSITION),
          date: new Date("2026-01-31T00:00:00.000Z"),
        })
      )
      const useCase = new ListAllPositionPerformancesUseCase(
        positionPerformanceRepository
      )

      const response = await useCase.execute({
        positionIds: [FIRST_POSITION, SECOND_POSITION],
      })

      expect(response.length).toBe(2)
      expect(
        response.map((performance) => performance.id).sort()
      ).toEqual([first.id, second.id].sort())
    })

    it("should skip the performances of the positions left out", async () => {
      await positionPerformanceRepository.save(
        buildPositionPerformance({
          positionId: buildEntityId(FIRST_POSITION),
          date: new Date("2026-01-31T00:00:00.000Z"),
        })
      )
      await positionPerformanceRepository.save(
        buildPositionPerformance({
          positionId: buildEntityId(OTHER_POSITION),
          date: new Date("2026-01-31T00:00:00.000Z"),
        })
      )
      const useCase = new ListAllPositionPerformancesUseCase(
        positionPerformanceRepository
      )

      const response = await useCase.execute({
        positionIds: [FIRST_POSITION],
      })

      expect(response.length).toBe(1)
      expect(response[0].positionId).toBe(FIRST_POSITION)
    })

    it("should return every snapshot of a position ordered by date ascending", async () => {
      await positionPerformanceRepository.save(
        buildPositionPerformance({
          positionId: buildEntityId(FIRST_POSITION),
          date: new Date("2026-03-31T00:00:00.000Z"),
        })
      )
      await positionPerformanceRepository.save(
        buildPositionPerformance({
          positionId: buildEntityId(FIRST_POSITION),
          date: new Date("2026-01-31T00:00:00.000Z"),
        })
      )
      await positionPerformanceRepository.save(
        buildPositionPerformance({
          positionId: buildEntityId(FIRST_POSITION),
          date: new Date("2026-02-28T00:00:00.000Z"),
        })
      )
      const useCase = new ListAllPositionPerformancesUseCase(
        positionPerformanceRepository
      )

      const response = await useCase.execute({
        positionIds: [FIRST_POSITION],
      })

      expect(
        response.map((performance) => performance.date)
      ).toEqual([
        "2026-01-31T00:00:00.000Z",
        "2026-02-28T00:00:00.000Z",
        "2026-03-31T00:00:00.000Z",
      ])
    })

    it("should return an empty collection when the positions hold no performance", async () => {
      const useCase = new ListAllPositionPerformancesUseCase(
        positionPerformanceRepository
      )

      const response = await useCase.execute({
        positionIds: [FIRST_POSITION],
      })

      expect(response).toEqual([])
    })
  })
})
