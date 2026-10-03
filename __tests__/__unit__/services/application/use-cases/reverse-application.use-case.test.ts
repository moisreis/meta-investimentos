import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { ReverseApplicationUseCase } from "@/services/application/use-cases/reverse-application.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakeApplicationRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildApplication,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  useRealClock,
  getFixedDate,
} from "__tests__/__setup__/_clock.setup"

const ID = "00000000-0000-0000-0000-000000000001"
const USER_ID = "user-1"

describe("services/application/use-cases/reverse-application.use-case", () => {
  let applicationRepository: ReturnType<
    typeof createFakeApplicationRepository
  >

  beforeEach(() => {
    useFixedClock()
    applicationRepository = createFakeApplicationRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  describe("execute", () => {
    it("should stamp the reversal date and user when the application exists", async () => {
      await applicationRepository.save(
        buildApplication({
          id: buildEntityId(ID),
          reversedAt: null,
          reversedByUserId: null,
        })
      )
      const useCase = new ReverseApplicationUseCase(
        applicationRepository
      )

      const response = await useCase.execute({
        applicationId: ID,
        reversedByUserId: USER_ID,
      })

      expect(response.reversedAt).toBe(
        getFixedDate().toISOString()
      )
      expect(response.reversedByUserId).toBe(USER_ID)
    })

    it("should persist the reversed application under the same id", async () => {
      await applicationRepository.save(
        buildApplication({
          id: buildEntityId(ID),
          reversedAt: null,
          reversedByUserId: null,
        })
      )
      const useCase = new ReverseApplicationUseCase(
        applicationRepository
      )

      const response = await useCase.execute({
        applicationId: ID,
        reversedByUserId: USER_ID,
      })

      const stored = await applicationRepository.findById(
        buildEntityId(ID)
      )

      expect(response.id).toBe(ID)
      expect(stored?.reversedByUserId).toBe(USER_ID)
      expect(stored?.reversedAt).not.toBeNull()
    })

    it("should throw NotFoundError when the application does not exist", async () => {
      const useCase = new ReverseApplicationUseCase(
        applicationRepository
      )

      await expect(
        useCase.execute({
          applicationId: ID,
          reversedByUserId: USER_ID,
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw ValidationError when the application is already reversed", async () => {
      await applicationRepository.save(
        buildApplication({
          id: buildEntityId(ID),
          reversedAt: new Date("2026-02-20T18:00:00.000Z"),
          reversedByUserId: buildEntityId("user-9"),
        })
      )
      const useCase = new ReverseApplicationUseCase(
        applicationRepository
      )

      await expect(
        useCase.execute({
          applicationId: ID,
          reversedByUserId: USER_ID,
        })
      ).rejects.toThrow(ValidationError)
    })
  })
})
