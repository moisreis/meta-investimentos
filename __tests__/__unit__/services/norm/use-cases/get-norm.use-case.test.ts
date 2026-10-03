import { describe, it, expect, beforeEach } from "vitest"

import { GetNormUseCase } from "@/services/norm/use-cases/get-norm.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakeNormRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildNorm,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000051"

describe("services/norm/use-cases/get-norm.use-case", () => {
  let normRepository: ReturnType<typeof createFakeNormRepository>

  beforeEach(() => {
    normRepository = createFakeNormRepository()
  })

  describe("execute", () => {
    it("should return the norm when it exists", async () => {
      const saved = await normRepository.save(
        buildNorm({
          id: buildEntityId(ID),
          name: "Limite de Concentração",
        })
      )
      const useCase = new GetNormUseCase(normRepository)

      const response = await useCase.execute({
        normId: saved.id!,
      })

      expect(response.id).toBe(ID)
      expect(response.name).toBe("Limite de Concentração")
    })

    it("should expose every field when the norm exists", async () => {
      const saved = await normRepository.save(
        buildNorm({
          id: buildEntityId(ID),
          articleNumber: "Art. 99",
          name: "Limite Global",
          categoryId: buildEntityId("category-4"),
          minAllocation: buildSignedPercentage("3.50"),
          maxAllocation: buildSignedPercentage("25.00"),
          targetAllocation: buildSignedPercentage("15.00"),
          createdAt: new Date("2026-05-01T00:00:00.000Z"),
          updatedAt: new Date("2026-05-02T00:00:00.000Z"),
        })
      )
      const useCase = new GetNormUseCase(normRepository)

      const response = await useCase.execute({
        normId: saved.id!,
      })

      expect(response).toStrictEqual({
        id: ID,
        articleNumber: "Art. 99",
        name: "Limite Global",
        categoryId: "category-4",
        minAllocation: "3.5",
        maxAllocation: "25",
        targetAllocation: "15",
        createdAt: "2026-05-01T00:00:00.000Z",
        updatedAt: "2026-05-02T00:00:00.000Z",
      })
    })

    it("should return the requested norm when several exist", async () => {
      await normRepository.save(
        buildNorm({ id: buildEntityId("norm-other") })
      )
      const target = await normRepository.save(
        buildNorm({
          id: buildEntityId(ID),
          articleNumber: "Art. 42",
        })
      )
      const useCase = new GetNormUseCase(normRepository)

      const response = await useCase.execute({
        normId: target.id!,
      })

      expect(response.articleNumber).toBe("Art. 42")
    })

    it("should throw NotFoundError when the norm does not exist", async () => {
      const useCase = new GetNormUseCase(normRepository)

      await expect(
        useCase.execute({ normId: ID })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw ValidationError when the norm id is blank", async () => {
      const useCase = new GetNormUseCase(normRepository)

      await expect(
        useCase.execute({ normId: "  " })
      ).rejects.toThrow(ValidationError)
    })
  })
})
