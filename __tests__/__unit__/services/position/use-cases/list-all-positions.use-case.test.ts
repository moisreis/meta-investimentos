import { describe, it, expect, beforeEach } from "vitest"

import { ListAllPositionsUseCase } from "@/services/position/use-cases/list-all-positions.use-case"
import { createFakePositionRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPosition,
} from "__tests__/__setup__/_factories.setup"

const FIRST_PORTFOLIO = "00000000-0000-0000-0000-0000000000a1"
const SECOND_PORTFOLIO = "00000000-0000-0000-0000-0000000000a2"
const OTHER_PORTFOLIO = "00000000-0000-0000-0000-0000000000a3"

describe("services/position/use-cases/list-all-positions.use-case", () => {
  let positionRepository: ReturnType<
    typeof createFakePositionRepository
  >

  beforeEach(() => {
    positionRepository = createFakePositionRepository()
  })

  describe("execute", () => {
    it("should return an empty collection when no portfolio is provided", async () => {
      const useCase = new ListAllPositionsUseCase(
        positionRepository
      )

      const response = await useCase.execute({
        portfolioIds: [],
      })

      expect(response).toEqual([])
    })

    it("should return the positions of every provided portfolio", async () => {
      const first = await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId(FIRST_PORTFOLIO),
          fundId: buildEntityId("fund-1"),
        })
      )
      const second = await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId(SECOND_PORTFOLIO),
          fundId: buildEntityId("fund-2"),
        })
      )
      const useCase = new ListAllPositionsUseCase(
        positionRepository
      )

      const response = await useCase.execute({
        portfolioIds: [FIRST_PORTFOLIO, SECOND_PORTFOLIO],
      })

      expect(response.length).toBe(2)
      expect(response.map((position) => position.id)).toEqual([
        first.id,
        second.id,
      ])
    })

    it("should skip the positions of the portfolios left out", async () => {
      await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId(FIRST_PORTFOLIO),
          fundId: buildEntityId("fund-1"),
        })
      )
      await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId(OTHER_PORTFOLIO),
          fundId: buildEntityId("fund-3"),
        })
      )
      const useCase = new ListAllPositionsUseCase(
        positionRepository
      )

      const response = await useCase.execute({
        portfolioIds: [FIRST_PORTFOLIO],
      })

      expect(response.length).toBe(1)
      expect(response[0].portfolioId).toBe(FIRST_PORTFOLIO)
    })

    it("should return an empty collection when the portfolios hold no position", async () => {
      const useCase = new ListAllPositionsUseCase(
        positionRepository
      )

      const response = await useCase.execute({
        portfolioIds: [FIRST_PORTFOLIO],
      })

      expect(response).toEqual([])
    })

    it("should map every row to the response payload when listing positions", async () => {
      const saved = await positionRepository.save(
        buildPosition({
          portfolioId: buildEntityId(FIRST_PORTFOLIO),
          fundId: buildEntityId("fund-1"),
        })
      )
      const useCase = new ListAllPositionsUseCase(
        positionRepository
      )

      const response = await useCase.execute({
        portfolioIds: [FIRST_PORTFOLIO],
      })

      expect(response[0]).toEqual({
        id: saved.id as string,
        portfolioId: FIRST_PORTFOLIO,
        fundId: "fund-1",
        initialBalance: "10000",
        initialBalanceDate: "2026-01-01T00:00:00.000Z",
        allocation: "100",
        version: 0,
        createdAt: saved.createdAt.toISOString(),
        updatedAt: saved.updatedAt.toISOString(),
      })
    })
  })
})
