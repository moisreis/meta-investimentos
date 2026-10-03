import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { CreateApplicationUseCase } from "@/services/application/use-cases/create-application.use-case"
import { NotFoundError } from "@errors/not-found.error"
import {
  createFakeApplicationRepository,
  createFakePositionRepository,
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
const DATE = "2026-01-15T00:00:00.000Z"

describe("services/application/use-cases/create-application.use-case", () => {
  let applicationRepository: ReturnType<
    typeof createFakeApplicationRepository
  >
  let positionRepository: ReturnType<
    typeof createFakePositionRepository
  >

  beforeEach(() => {
    useFixedClock()
    applicationRepository = createFakeApplicationRepository()
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
      const useCase = new CreateApplicationUseCase(
        applicationRepository,
        positionRepository
      )

      const response = await useCase.execute({
        positionId: POSITION_ID,
        date: DATE,
        amount: "2500.75",
        quotas: "120.75",
      })

      const stored =
        await applicationRepository.findAllByPositionId(
          buildEntityId(POSITION_ID)
        )

      expect(stored.length).toBe(1)
      expect(response.positionId).toBe(POSITION_ID)
      expect(response.amount).toBe("2500.75")
      expect(response.quotas).toBe("120.75")
      expect(response.date).toBe(DATE)
    })

    it("should expose an assigned id and empty reversal fields when creating an application", async () => {
      await positionRepository.save(
        buildPosition({ id: buildEntityId(POSITION_ID) })
      )
      const useCase = new CreateApplicationUseCase(
        applicationRepository,
        positionRepository
      )

      const response = await useCase.execute({
        positionId: POSITION_ID,
        date: DATE,
        amount: "2500.75",
        quotas: "120.75",
      })

      expect(response.id).toBeDefined()
      expect(response.reversedAt).toBeNull()
      expect(response.reversedByUserId).toBeNull()
      expect(response.createdAt).toBe(
        getFixedDate().toISOString()
      )
    })

    it("should throw NotFoundError when the position does not exist", async () => {
      const useCase = new CreateApplicationUseCase(
        applicationRepository,
        positionRepository
      )

      await expect(
        useCase.execute({
          positionId: POSITION_ID,
          date: DATE,
          amount: "2500.75",
          quotas: "120.75",
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should not persist any application when the position does not exist", async () => {
      const useCase = new CreateApplicationUseCase(
        applicationRepository,
        positionRepository
      )

      await expect(
        useCase.execute({
          positionId: POSITION_ID,
          date: DATE,
          amount: "2500.75",
          quotas: "120.75",
        })
      ).rejects.toThrow(NotFoundError)

      const stored =
        await applicationRepository.findAllByPositionId(
          buildEntityId(POSITION_ID)
        )

      expect(stored.length).toBe(0)
    })
  })
})
