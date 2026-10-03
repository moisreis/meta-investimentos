import { describe, it, expect, beforeEach } from "vitest"

import { ListApplicationsUseCase } from "@/services/application/use-cases/list-applications.use-case"
import { createFakeApplicationRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildApplication,
  buildEntityId,
  buildPositiveMoney,
} from "__tests__/__setup__/_factories.setup"

describe("services/application/use-cases/list-applications.use-case", () => {
  let applicationRepository: ReturnType<
    typeof createFakeApplicationRepository
  >

  beforeEach(() => {
    applicationRepository = createFakeApplicationRepository()
  })

  describe("execute", () => {
    it("should return the applications of the position sorted by date", async () => {
      await applicationRepository.save(
        buildApplication({
          id: buildEntityId("application-2"),
          positionId: buildEntityId("position-1"),
          date: new Date("2026-02-15"),
        })
      )
      await applicationRepository.save(
        buildApplication({
          id: buildEntityId("application-1"),
          positionId: buildEntityId("position-1"),
          date: new Date("2026-01-15"),
        })
      )
      const useCase = new ListApplicationsUseCase(
        applicationRepository
      )

      const response = await useCase.execute({
        positionId: "position-1",
      })

      expect(response.map((row) => row.id)).toEqual([
        "application-1",
        "application-2",
      ])
    })

    it("should serialize every application of the position", async () => {
      await applicationRepository.save(
        buildApplication({
          id: buildEntityId("application-1"),
          positionId: buildEntityId("position-1"),
          amount: buildPositiveMoney("2500.75"),
        })
      )
      const useCase = new ListApplicationsUseCase(
        applicationRepository
      )

      const response = await useCase.execute({
        positionId: "position-1",
      })

      expect(response.length).toBe(1)
      expect(response[0].amount).toBe("2500.75")
      expect(response[0].positionId).toBe("position-1")
    })

    it("should ignore the applications of another position", async () => {
      await applicationRepository.save(
        buildApplication({
          id: buildEntityId("application-1"),
          positionId: buildEntityId("position-1"),
        })
      )
      await applicationRepository.save(
        buildApplication({
          id: buildEntityId("application-2"),
          positionId: buildEntityId("position-9"),
        })
      )
      const useCase = new ListApplicationsUseCase(
        applicationRepository
      )

      const response = await useCase.execute({
        positionId: "position-1",
      })

      expect(response.length).toBe(1)
      expect(response[0].positionId).toBe("position-1")
    })

    it("should return an empty array when the position has no application", async () => {
      await applicationRepository.save(
        buildApplication({
          id: buildEntityId("application-2"),
          positionId: buildEntityId("position-9"),
        })
      )
      const useCase = new ListApplicationsUseCase(
        applicationRepository
      )

      const response = await useCase.execute({
        positionId: "position-1",
      })

      expect(response).toEqual([])
      expect(response.length).toBe(0)
    })
  })
})
