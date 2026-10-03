import { describe, it, expect, beforeEach, vi } from "vitest"

import { ListAllApplicationsUseCase } from "@/services/application/use-cases/list-all-applications.use-case"
import { createFakeApplicationRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildApplication,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

describe("services/application/use-cases/list-all-applications.use-case", () => {
  let applicationRepository: ReturnType<
    typeof createFakeApplicationRepository
  >

  beforeEach(() => {
    applicationRepository = createFakeApplicationRepository()
  })

  describe("execute", () => {
    it("should return an empty array when no position id is provided", async () => {
      await applicationRepository.save(
        buildApplication({
          id: buildEntityId("application-1"),
          positionId: buildEntityId("position-1"),
        })
      )
      const useCase = new ListAllApplicationsUseCase(
        applicationRepository
      )

      const response = await useCase.execute({
        positionIds: [],
      })

      expect(response).toEqual([])
    })

    it("should skip the repository lookup when no position id is provided", async () => {
      const spy = vi.spyOn(
        applicationRepository,
        "findAllByPositionIds"
      )
      const useCase = new ListAllApplicationsUseCase(
        applicationRepository
      )

      await useCase.execute({ positionIds: [] })

      expect(spy).not.toHaveBeenCalled()
    })

    it("should return the applications of every provided position", async () => {
      await applicationRepository.save(
        buildApplication({
          id: buildEntityId("application-1"),
          positionId: buildEntityId("position-1"),
        })
      )
      await applicationRepository.save(
        buildApplication({
          id: buildEntityId("application-2"),
          positionId: buildEntityId("position-2"),
        })
      )
      const useCase = new ListAllApplicationsUseCase(
        applicationRepository
      )

      const response = await useCase.execute({
        positionIds: ["position-1", "position-2"],
      })

      expect(response.length).toBe(2)
      expect(response.map((row) => row.id)).toEqual([
        "application-1",
        "application-2",
      ])
    })

    it("should ignore the applications of positions outside the list", async () => {
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
      const useCase = new ListAllApplicationsUseCase(
        applicationRepository
      )

      const response = await useCase.execute({
        positionIds: ["position-1"],
      })

      expect(response.length).toBe(1)
      expect(response[0].positionId).toBe("position-1")
    })

    it("should return an empty array when no application matches", async () => {
      const useCase = new ListAllApplicationsUseCase(
        applicationRepository
      )

      const response = await useCase.execute({
        positionIds: ["position-1"],
      })

      expect(response).toEqual([])
    })
  })
})
