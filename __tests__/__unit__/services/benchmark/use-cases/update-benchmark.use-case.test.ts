import { describe, it, expect, beforeEach } from "vitest"

import { UpdateBenchmarkUseCase } from "@/services/benchmark/use-cases/update-benchmark.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import { createFakeBenchmarkRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildBenchmark,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"
const CREATED_AT = new Date("2026-01-01T00:00:00.000Z")

describe("services/benchmark/use-cases/update-benchmark.use-case", () => {
  let benchmarkRepository: ReturnType<
    typeof createFakeBenchmarkRepository
  >

  beforeEach(() => {
    benchmarkRepository = createFakeBenchmarkRepository()
  })

  describe("UpdateBenchmarkUseCase", () => {
    describe("execute", () => {
      it("should persist the new acronym and name when both are provided", async () => {
        await benchmarkRepository.save(
          buildBenchmark({
            acronym: "IBOV",
            name: "Ibovespa",
            createdAt: CREATED_AT,
            id: buildEntityId(ID),
          })
        )
        const useCase = new UpdateBenchmarkUseCase(
          benchmarkRepository
        )

        const response = await useCase.execute({
          benchmarkId: ID,
          acronym: "IBX",
          name: "Ibovespa Total Return",
        })

        expect(response).toStrictEqual({
          id: ID,
          acronym: "IBX",
          name: "Ibovespa Total Return",
          createdAt: CREATED_AT.toISOString(),
        })

        const stored = await benchmarkRepository.findById(
          buildEntityId(ID)
        )

        expect(stored?.acronym).toBe("IBX")
        expect(stored?.name).toBe("Ibovespa Total Return")
      })

      it("should keep the acronym when only the name is provided", async () => {
        await benchmarkRepository.save(
          buildBenchmark({
            acronym: "IBOV",
            name: "Ibovespa",
            id: buildEntityId(ID),
          })
        )
        const useCase = new UpdateBenchmarkUseCase(
          benchmarkRepository
        )

        const response = await useCase.execute({
          benchmarkId: ID,
          name: "Ibovespa Total Return",
        })

        expect(response.acronym).toBe("IBOV")
        expect(response.name).toBe("Ibovespa Total Return")
      })

      it("should keep the name when only the acronym is provided", async () => {
        await benchmarkRepository.save(
          buildBenchmark({
            acronym: "IBOV",
            name: "Ibovespa",
            id: buildEntityId(ID),
          })
        )
        const useCase = new UpdateBenchmarkUseCase(
          benchmarkRepository
        )

        const response = await useCase.execute({
          benchmarkId: ID,
          acronym: "IBX",
        })

        expect(response.acronym).toBe("IBX")
        expect(response.name).toBe("Ibovespa")
      })

      it("should persist the same values when no field is provided", async () => {
        await benchmarkRepository.save(
          buildBenchmark({
            acronym: "IBOV",
            name: "Ibovespa",
            id: buildEntityId(ID),
          })
        )
        const useCase = new UpdateBenchmarkUseCase(
          benchmarkRepository
        )

        const response = await useCase.execute({
          benchmarkId: ID,
        })

        expect(response.acronym).toBe("IBOV")
        expect(response.name).toBe("Ibovespa")
        expect(
          await benchmarkRepository.findById(buildEntityId(ID))
        ).not.toBeNull()
      })

      it("should throw NotFoundError when the benchmark does not exist", async () => {
        const useCase = new UpdateBenchmarkUseCase(
          benchmarkRepository
        )

        await expect(
          useCase.execute({
            benchmarkId: ID,
            name: "Ibovespa Total Return",
          })
        ).rejects.toThrow(NotFoundError)
      })

      it("should throw ValidationError when the new name is blank", async () => {
        await benchmarkRepository.save(
          buildBenchmark({
            acronym: "IBOV",
            name: "Ibovespa",
            id: buildEntityId(ID),
          })
        )
        const useCase = new UpdateBenchmarkUseCase(
          benchmarkRepository
        )

        await expect(
          useCase.execute({ benchmarkId: ID, name: "   " })
        ).rejects.toThrow(ValidationError)

        const stored = await benchmarkRepository.findById(
          buildEntityId(ID)
        )

        expect(stored?.name).toBe("Ibovespa")
      })

      it("should throw ValidationError when the new acronym is blank", async () => {
        await benchmarkRepository.save(
          buildBenchmark({
            acronym: "IBOV",
            name: "Ibovespa",
            id: buildEntityId(ID),
          })
        )
        const useCase = new UpdateBenchmarkUseCase(
          benchmarkRepository
        )

        await expect(
          useCase.execute({ benchmarkId: ID, acronym: "   " })
        ).rejects.toThrow(ValidationError)

        const stored = await benchmarkRepository.findById(
          buildEntityId(ID)
        )

        expect(stored?.acronym).toBe("IBOV")
      })
    })
  })
})
