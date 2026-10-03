import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { CreateNormUseCase } from "@/services/norm/use-cases/create-norm.use-case"
import { ValidationError } from "@errors/validation.error"
import { createFakeNormRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildEntityId,
  buildNorm,
} from "__tests__/__setup__/_factories.setup"
import {
  getFixedDate,
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

describe("services/norm/use-cases/create-norm.use-case", () => {
  let normRepository: ReturnType<typeof createFakeNormRepository>

  beforeEach(() => {
    useFixedClock()
    normRepository = createFakeNormRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  describe("execute", () => {
    it("should persist a norm built from the payload when creating a norm", async () => {
      const useCase = new CreateNormUseCase(normRepository)

      const response = await useCase.execute({
        articleNumber: "10.1",
        name: "Limite de Concentração",
        categoryId: "category-1",
        minAllocation: "5.25",
        maxAllocation: "40.75",
        targetAllocation: "12.50",
      })

      expect(response.id).toBeDefined()
      expect(response.articleNumber).toBe("10.1")
      expect(response.name).toBe("Limite de Concentração")
      expect(response.categoryId).toBe("category-1")
      expect(response.minAllocation).toBe("5.25")
      expect(response.maxAllocation).toBe("40.75")
      expect(response.targetAllocation).toBe("12.5")
    })

    it("should store exactly one row when creating a norm", async () => {
      const useCase = new CreateNormUseCase(normRepository)

      await useCase.execute({
        articleNumber: "Art. 1",
        name: "Reserva de Caixa",
        categoryId: "category-1",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      expect(
        await normRepository.findAllByCategoryId(
          buildEntityId("category-1")
        )
      ).toHaveLength(1)
    })

    it("should keep the previous rows when creating a norm", async () => {
      await normRepository.save(
        buildNorm({
          id: buildEntityId("norm-existing"),
          articleNumber: "Art. 1",
        })
      )
      const useCase = new CreateNormUseCase(normRepository)

      await useCase.execute({
        articleNumber: "Art. 2",
        name: "Limite Global",
        categoryId: "category-2",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      const stored = await normRepository.findAllByCategoryId(
        buildEntityId("category-2")
      )

      expect(stored).toHaveLength(1)
      expect(
        await normRepository.findById(
          buildEntityId("norm-existing")
        )
      ).not.toBeNull()
    })

    it("should expose the current clock as creation timestamp when creating a norm", async () => {
      const useCase = new CreateNormUseCase(normRepository)

      const response = await useCase.execute({
        articleNumber: "Art. 1",
        name: "Reserva de Caixa",
        categoryId: "category-1",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      })

      expect(response.createdAt).toBe(
        getFixedDate().toISOString()
      )
      expect(response.updatedAt).toBe(
        getFixedDate().toISOString()
      )
    })

    it("should throw ValidationError when the article number is blank", async () => {
      const useCase = new CreateNormUseCase(normRepository)

      await expect(
        useCase.execute({
          articleNumber: "   ",
          name: "Reserva de Caixa",
          categoryId: "category-1",
          minAllocation: "5",
          maxAllocation: "20",
          targetAllocation: "12",
        })
      ).rejects.toThrow(ValidationError)
    })

    it("should throw ValidationError when the minimum allocation exceeds the target allocation", async () => {
      const useCase = new CreateNormUseCase(normRepository)

      await expect(
        useCase.execute({
          articleNumber: "Art. 1",
          name: "Reserva de Caixa",
          categoryId: "category-1",
          minAllocation: "30",
          maxAllocation: "40",
          targetAllocation: "12",
        })
      ).rejects.toThrow(ValidationError)
    })

    it("should throw ValidationError when the target allocation exceeds the maximum allocation", async () => {
      const useCase = new CreateNormUseCase(normRepository)

      await expect(
        useCase.execute({
          articleNumber: "Art. 1",
          name: "Reserva de Caixa",
          categoryId: "category-1",
          minAllocation: "5",
          maxAllocation: "20",
          targetAllocation: "35",
        })
      ).rejects.toThrow(ValidationError)
    })

    it("should store nothing when the payload is rejected", async () => {
      const useCase = new CreateNormUseCase(normRepository)

      await expect(
        useCase.execute({
          articleNumber: "Art. 1",
          name: "",
          categoryId: "category-1",
          minAllocation: "5",
          maxAllocation: "20",
          targetAllocation: "12",
        })
      ).rejects.toThrow(ValidationError)

      expect(
        await normRepository.findAllByCategoryId(
          buildEntityId("category-1")
        )
      ).toStrictEqual([])
    })
  })
})
