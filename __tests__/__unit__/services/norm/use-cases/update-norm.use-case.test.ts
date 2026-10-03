import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { UpdateNormUseCase } from "@/services/norm/use-cases/update-norm.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakeNormRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildNorm,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"
import {
  getFixedDate,
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

const ID = "00000000-0000-0000-0000-000000000052"
const CREATED_AT = new Date("2026-01-01T00:00:00.000Z")

describe("services/norm/use-cases/update-norm.use-case", () => {
  let normRepository: ReturnType<typeof createFakeNormRepository>

  beforeEach(() => {
    useFixedClock()
    normRepository = createFakeNormRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  describe("execute", () => {
    it("should persist every provided field when the norm exists", async () => {
      const saved = await normRepository.save(
        buildNorm({ id: buildEntityId(ID) })
      )
      const useCase = new UpdateNormUseCase(normRepository)

      const response = await useCase.execute({
        normId: saved.id!,
        articleNumber: "Art. 42",
        name: "Limite de Exposição",
        categoryId: "  category-9  ",
        minAllocation: "3.50",
        maxAllocation: "25.00",
        targetAllocation: "15.00",
      })

      expect(response.id).toBe(ID)
      expect(response.articleNumber).toBe("Art. 42")
      expect(response.name).toBe("Limite de Exposição")
      expect(response.categoryId).toBe("category-9")
      expect(response.minAllocation).toBe("3.5")
      expect(response.maxAllocation).toBe("25")
      expect(response.targetAllocation).toBe("15")

      const stored = await normRepository.findById(saved.id!)

      expect(stored?.articleNumber).toBe("Art. 42")
      expect(
        await normRepository.findById(buildEntityId(ID))
      ).not.toBeNull()
    })

    it("should keep the current fields when the payload omits them", async () => {
      const saved = await normRepository.save(
        buildNorm({
          id: buildEntityId(ID),
          articleNumber: "Art. 1",
          name: "Reserva de Caixa",
          categoryId: buildEntityId("category-1"),
          minAllocation: buildSignedPercentage("6.50"),
          maxAllocation: buildSignedPercentage("22.50"),
          targetAllocation: buildSignedPercentage("13.50"),
        })
      )
      const useCase = new UpdateNormUseCase(normRepository)

      const response = await useCase.execute({
        normId: saved.id!,
      })

      expect(response.articleNumber).toBe("Art. 1")
      expect(response.name).toBe("Reserva de Caixa")
      expect(response.categoryId).toBe("category-1")
      expect(response.minAllocation).toBe("6.5")
      expect(response.maxAllocation).toBe("22.5")
      expect(response.targetAllocation).toBe("13.5")
    })

    it("should keep the current fields when the payload sends blank strings", async () => {
      const saved = await normRepository.save(
        buildNorm({
          id: buildEntityId(ID),
          articleNumber: "Art. 1",
          name: "Reserva de Caixa",
        })
      )
      const useCase = new UpdateNormUseCase(normRepository)

      const response = await useCase.execute({
        normId: saved.id!,
        categoryId: "",
        minAllocation: "",
        maxAllocation: "",
        targetAllocation: "",
      })

      expect(response.categoryId).toBe("category-1")
      expect(response.minAllocation).toBe("5")
      expect(response.maxAllocation).toBe("20")
      expect(response.targetAllocation).toBe("12")
    })

    it("should keep the creation timestamp and refresh the update timestamp", async () => {
      const saved = await normRepository.save(
        buildNorm({
          id: buildEntityId(ID),
          createdAt: CREATED_AT,
          updatedAt: CREATED_AT,
        })
      )
      const useCase = new UpdateNormUseCase(normRepository)

      const response = await useCase.execute({
        normId: saved.id!,
        name: "Limite de Exposição",
      })

      expect(response.createdAt).toBe(CREATED_AT.toISOString())
      expect(response.updatedAt).toBe(
        getFixedDate().toISOString()
      )
    })

    it("should throw NotFoundError when the norm does not exist", async () => {
      const useCase = new UpdateNormUseCase(normRepository)

      await expect(
        useCase.execute({
          normId: ID,
          name: "Limite de Exposição",
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw ValidationError when the new target allocation exceeds the maximum allocation", async () => {
      const saved = await normRepository.save(
        buildNorm({ id: buildEntityId(ID) })
      )
      const useCase = new UpdateNormUseCase(normRepository)

      await expect(
        useCase.execute({
          normId: saved.id!,
          targetAllocation: "35",
        })
      ).rejects.toThrow(ValidationError)
    })

    it("should throw ValidationError when the new minimum allocation exceeds the target allocation", async () => {
      const saved = await normRepository.save(
        buildNorm({ id: buildEntityId(ID) })
      )
      const useCase = new UpdateNormUseCase(normRepository)

      await expect(
        useCase.execute({
          normId: saved.id!,
          minAllocation: "30",
        })
      ).rejects.toThrow(ValidationError)
    })

    it("should throw ValidationError when the new article number is blank", async () => {
      const saved = await normRepository.save(
        buildNorm({
          id: buildEntityId(ID),
          articleNumber: "Art. 1",
        })
      )
      const useCase = new UpdateNormUseCase(normRepository)

      await expect(
        useCase.execute({
          normId: saved.id!,
          articleNumber: "  ",
        })
      ).rejects.toThrow(ValidationError)
    })
  })
})
