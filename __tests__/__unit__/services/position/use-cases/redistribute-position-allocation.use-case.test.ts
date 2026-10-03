import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { RedistributePositionAllocationUseCase } from "@/services/position/use-cases/redistribute-position-allocation.use-case"
import { createFakePositionRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildPosition,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"
import {
  getFixedDate,
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

const PORTFOLIO_ID = "00000000-0000-0000-0000-0000000000a1"
const OTHER_PORTFOLIO = "00000000-0000-0000-0000-0000000000a2"
const STORED_AT = new Date("2026-01-01T00:00:00.000Z")

describe("services/position/use-cases/redistribute-position-allocation.use-case", () => {
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
    it("should return an empty collection when the portfolio holds no position", async () => {
      const useCase = new RedistributePositionAllocationUseCase(
        positionRepository
      )

      const response = await useCase.execute({
        portfolioId: PORTFOLIO_ID,
      })

      expect(response).toEqual([])
    })

    it("should keep the full share when the portfolio holds one position", async () => {
      await positionRepository.save(
        buildPosition({
          id: buildEntityId(
            "00000000-0000-0000-0000-0000000000b1"
          ),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          fundId: buildEntityId("fund-1"),
          allocation: buildSignedPercentage("100"),
          updatedAt: STORED_AT,
        })
      )
      const useCase = new RedistributePositionAllocationUseCase(
        positionRepository
      )

      const response = await useCase.execute({
        portfolioId: PORTFOLIO_ID,
      })

      expect(response.length).toBe(1)
      expect(response[0].allocation).toBe("100")
    })

    it("should split the portfolio evenly when the allocation changed", async () => {
      const first = await positionRepository.save(
        buildPosition({
          id: buildEntityId(
            "00000000-0000-0000-0000-0000000000b1"
          ),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          fundId: buildEntityId("fund-1"),
          allocation: buildSignedPercentage("100"),
          updatedAt: STORED_AT,
        })
      )
      await positionRepository.save(
        buildPosition({
          id: buildEntityId(
            "00000000-0000-0000-0000-0000000000b2"
          ),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          fundId: buildEntityId("fund-2"),
          allocation: buildSignedPercentage("100"),
          updatedAt: STORED_AT,
        })
      )
      const useCase = new RedistributePositionAllocationUseCase(
        positionRepository
      )

      const response = await useCase.execute({
        portfolioId: PORTFOLIO_ID,
      })

      expect(response.length).toBe(2)
      expect(
        response.map((position) => position.allocation)
      ).toEqual(["50", "50"])
      expect(response[0].updatedAt).toBe(
        getFixedDate().toISOString()
      )

      const stored = await positionRepository.findById(first.id!)

      expect(stored?.allocation.value.toString()).toBe("50")
    })

    it("should skip the write when the allocation already equals the even split", async () => {
      await positionRepository.save(
        buildPosition({
          id: buildEntityId(
            "00000000-0000-0000-0000-0000000000b1"
          ),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          fundId: buildEntityId("fund-1"),
          allocation: buildSignedPercentage("50"),
          updatedAt: STORED_AT,
        })
      )
      await positionRepository.save(
        buildPosition({
          id: buildEntityId(
            "00000000-0000-0000-0000-0000000000b2"
          ),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          fundId: buildEntityId("fund-2"),
          allocation: buildSignedPercentage("50"),
          updatedAt: STORED_AT,
        })
      )
      const useCase = new RedistributePositionAllocationUseCase(
        positionRepository
      )

      const response = await useCase.execute({
        portfolioId: PORTFOLIO_ID,
      })

      expect(
        response.map((position) => position.allocation)
      ).toEqual(["50", "50"])
      expect(
        response.map((position) => position.updatedAt)
      ).toEqual([
        STORED_AT.toISOString(),
        STORED_AT.toISOString(),
      ])
    })

    it("should leave the positions of the other portfolios untouched", async () => {
      await positionRepository.save(
        buildPosition({
          id: buildEntityId(
            "00000000-0000-0000-0000-0000000000b1"
          ),
          portfolioId: buildEntityId(PORTFOLIO_ID),
          fundId: buildEntityId("fund-1"),
          allocation: buildSignedPercentage("100"),
          updatedAt: STORED_AT,
        })
      )
      const other = await positionRepository.save(
        buildPosition({
          id: buildEntityId(
            "00000000-0000-0000-0000-0000000000b3"
          ),
          portfolioId: buildEntityId(OTHER_PORTFOLIO),
          fundId: buildEntityId("fund-3"),
          allocation: buildSignedPercentage("100"),
          updatedAt: STORED_AT,
        })
      )
      const useCase = new RedistributePositionAllocationUseCase(
        positionRepository
      )

      await useCase.execute({ portfolioId: PORTFOLIO_ID })

      const stored = await positionRepository.findById(other.id!)

      expect(stored?.allocation.value.toString()).toBe("100")
      expect(stored?.updatedAt.toISOString()).toBe(
        STORED_AT.toISOString()
      )
    })
  })
})
