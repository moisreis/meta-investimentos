import { describe, it, expect, beforeEach } from "vitest"

import { DeleteApplicationUseCase } from "@/services/application/use-cases/delete-application.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { createFakeApplicationRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildApplication,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"

describe("services/application/use-cases/delete-application.use-case", () => {
  let applicationRepository: ReturnType<
    typeof createFakeApplicationRepository
  >

  beforeEach(() => {
    applicationRepository = createFakeApplicationRepository()
  })

  describe("execute", () => {
    it("should remove the row when the application exists", async () => {
      const saved = await applicationRepository.save(
        buildApplication({ id: buildEntityId(ID) })
      )
      const useCase = new DeleteApplicationUseCase(
        applicationRepository
      )

      await useCase.execute({ applicationId: saved.id! })

      expect(
        await applicationRepository.findById(saved.id!)
      ).toBeNull()
    })

    it("should throw NotFoundError when the application does not exist", async () => {
      const useCase = new DeleteApplicationUseCase(
        applicationRepository
      )

      await expect(
        useCase.execute({ applicationId: ID })
      ).rejects.toThrow(NotFoundError)
    })

    it("should leave the other rows untouched when the application exists", async () => {
      const target = await applicationRepository.save(
        buildApplication({ id: buildEntityId(ID) })
      )
      const other = await applicationRepository.save(
        buildApplication({
          id: buildEntityId(
            "00000000-0000-0000-0000-000000000002"
          ),
        })
      )
      const useCase = new DeleteApplicationUseCase(
        applicationRepository
      )

      await useCase.execute({ applicationId: target.id! })

      expect(
        await applicationRepository.findById(other.id!)
      ).not.toBeNull()
    })
  })
})
