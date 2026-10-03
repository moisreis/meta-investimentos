import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { CreateBenchmarkUseCase } from "@/services/benchmark/use-cases/create-benchmark.use-case"
import { ValidationError } from "@errors/validation.error"
import { createFakeBenchmarkRepository } from "__tests__/__setup__/_fakes.setup"
import {
  getFixedDate,
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

describe("services/benchmark/use-cases/create-benchmark.use-case", () => {
  let benchmarkRepository: ReturnType<
    typeof createFakeBenchmarkRepository
  >

  beforeEach(() => {
    useFixedClock()
    benchmarkRepository = createFakeBenchmarkRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  describe("CreateBenchmarkUseCase", () => {
    describe("execute", () => {
      it("should persist the benchmark built from the payload", async () => {
        const useCase = new CreateBenchmarkUseCase(
          benchmarkRepository
        )

        const response = await useCase.execute({
          acronym: "IBOV",
          name: "Ibovespa",
        })

        expect(response).toStrictEqual({
          id: "IBOV",
          acronym: "IBOV",
          name: "Ibovespa",
          createdAt: getFixedDate().toISOString(),
        })

        const stored =
          await benchmarkRepository.findByAcronym("IBOV")

        expect(stored).not.toBeNull()
        expect(stored?.name).toBe("Ibovespa")
        expect(
          await benchmarkRepository.findAll({})
        ).toHaveLength(1)
      })

      it("should throw ValidationError when the acronym is blank", async () => {
        const useCase = new CreateBenchmarkUseCase(
          benchmarkRepository
        )

        await expect(
          useCase.execute({
            acronym: "   ",
            name: "Ibovespa",
          })
        ).rejects.toThrow(ValidationError)

        expect(
          await benchmarkRepository.findAll({})
        ).toStrictEqual([])
      })

      it("should throw ValidationError when the name is blank", async () => {
        const useCase = new CreateBenchmarkUseCase(
          benchmarkRepository
        )

        await expect(
          useCase.execute({
            acronym: "IBOV",
            name: "   ",
          })
        ).rejects.toThrow(ValidationError)

        expect(
          await benchmarkRepository.findAll({})
        ).toStrictEqual([])
      })
    })
  })
})
