import { describe, it, expect, beforeEach } from "vitest"

import { ListNormsUseCase } from "@/services/norm/use-cases/list-norms.use-case"
import { ValidationError } from "@errors/validation.error"
import { createFakeNormRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildNorm,
} from "__tests__/__setup__/_factories.setup"

const CATEGORY = "category-1"
const OTHER_CATEGORY = "category-2"

describe("services/norm/use-cases/list-norms.use-case", () => {
  let normRepository: ReturnType<typeof createFakeNormRepository>

  beforeEach(() => {
    normRepository = createFakeNormRepository()
  })

  describe("execute", () => {
    it("should return the norms of the requested category when listing norms", async () => {
      await normRepository.save(
        buildNorm({
          id: buildEntityId("norm-1"),
          articleNumber: "Art. 1",
          categoryId: buildEntityId(CATEGORY),
        })
      )
      await normRepository.save(
        buildNorm({
          id: buildEntityId("norm-2"),
          articleNumber: "Art. 2",
          categoryId: buildEntityId(CATEGORY),
        })
      )
      const useCase = new ListNormsUseCase(normRepository)

      const response = await useCase.execute({
        categoryId: CATEGORY,
      })

      expect(
        response.map((norm) => norm.articleNumber)
      ).toStrictEqual(["Art. 1", "Art. 2"])
    })

    it("should exclude the norms of other categories when listing norms", async () => {
      await normRepository.save(
        buildNorm({
          id: buildEntityId("norm-1"),
          articleNumber: "Art. 1",
          categoryId: buildEntityId(OTHER_CATEGORY),
        })
      )
      const useCase = new ListNormsUseCase(normRepository)

      const response = await useCase.execute({
        categoryId: CATEGORY,
      })

      expect(response).toStrictEqual([])
    })

    it("should return an empty array when the category has no norms", async () => {
      const useCase = new ListNormsUseCase(normRepository)

      const response = await useCase.execute({
        categoryId: CATEGORY,
      })

      expect(response).toStrictEqual([])
    })

    it("should map every row to the response DTO when listing norms", async () => {
      await normRepository.save(
        buildNorm({
          id: buildEntityId("norm-1"),
          articleNumber: "Art. 7",
          name: "Reserva de Caixa",
          categoryId: buildEntityId(CATEGORY),
          createdAt: new Date("2026-06-01T00:00:00.000Z"),
          updatedAt: new Date("2026-06-02T00:00:00.000Z"),
        })
      )
      const useCase = new ListNormsUseCase(normRepository)

      const response = await useCase.execute({
        categoryId: CATEGORY,
      })

      expect(response[0]).toStrictEqual({
        id: "norm-1",
        articleNumber: "Art. 7",
        name: "Reserva de Caixa",
        categoryId: CATEGORY,
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
        createdAt: "2026-06-01T00:00:00.000Z",
        updatedAt: "2026-06-02T00:00:00.000Z",
      })
    })

    it("should throw ValidationError when the category id is blank", async () => {
      const useCase = new ListNormsUseCase(normRepository)

      await expect(
        useCase.execute({ categoryId: "   " })
      ).rejects.toThrow(ValidationError)
    })
  })
})
