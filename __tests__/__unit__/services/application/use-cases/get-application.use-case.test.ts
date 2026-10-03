import { describe, it, expect, beforeEach } from "vitest"

import { GetApplicationUseCase } from "@/services/application/use-cases/get-application.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { createFakeApplicationRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildApplication,
  buildEntityId,
  buildPositiveMoney,
  buildQuotaQuantity,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"

describe("services/application/use-cases/get-application.use-case", () => {
  let applicationRepository: ReturnType<
    typeof createFakeApplicationRepository
  >

  beforeEach(() => {
    applicationRepository = createFakeApplicationRepository()
  })

  describe("execute", () => {
    it("should return the stored application when the id matches", async () => {
      await applicationRepository.save(
        buildApplication({
          id: buildEntityId(ID),
          positionId: buildEntityId("position-42"),
          date: new Date("2026-01-15T09:30:00.000Z"),
          amount: buildPositiveMoney("2500.75"),
          quotas: buildQuotaQuantity("120.75"),
        })
      )
      const useCase = new GetApplicationUseCase(
        applicationRepository
      )

      const response = await useCase.execute({
        applicationId: ID,
      })

      expect(response.id).toBe(ID)
      expect(response.positionId).toBe("position-42")
      expect(response.date).toBe("2026-01-15T09:30:00.000Z")
      expect(response.amount).toBe("2500.75")
      expect(response.quotas).toBe("120.75")
    })

    it("should expose null reversal fields when the application was not reversed", async () => {
      await applicationRepository.save(
        buildApplication({
          id: buildEntityId(ID),
          reversedAt: null,
          reversedByUserId: null,
        })
      )
      const useCase = new GetApplicationUseCase(
        applicationRepository
      )

      const response = await useCase.execute({
        applicationId: ID,
      })

      expect(response.reversedAt).toBeNull()
      expect(response.reversedByUserId).toBeNull()
    })

    it("should throw NotFoundError when the application does not exist", async () => {
      const useCase = new GetApplicationUseCase(
        applicationRepository
      )

      await expect(
        useCase.execute({ applicationId: ID })
      ).rejects.toThrow(NotFoundError)
    })
  })
})
