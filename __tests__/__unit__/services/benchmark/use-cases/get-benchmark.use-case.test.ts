import { describe, it, expect, beforeEach } from "vitest"

import { GetBenchmarkUseCase } from "@/services/benchmark/use-cases/get-benchmark.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { createFakeBenchmarkRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildBenchmark,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"
const OTHER_ID = "00000000-0000-0000-0000-000000000002"
const CREATED_AT = new Date("2026-01-01T00:00:00.000Z")

describe("services/benchmark/use-cases/get-benchmark.use-case", () => {
  let benchmarkRepository: ReturnType<
    typeof createFakeBenchmarkRepository
  >

  beforeEach(() => {
    benchmarkRepository = createFakeBenchmarkRepository()
  })

  describe("GetBenchmarkUseCase", () => {
    describe("execute", () => {
      it("should return the full response when the benchmark exists", async () => {
        await benchmarkRepository.save(
          buildBenchmark({
            acronym: "IBOV",
            name: "Ibovespa",
            createdAt: CREATED_AT,
            id: buildEntityId(ID),
          })
        )
        const useCase = new GetBenchmarkUseCase(
          benchmarkRepository
        )

        const response = await useCase.execute({
          benchmarkId: ID,
        })

        expect(response).toStrictEqual({
          id: ID,
          acronym: "IBOV",
          name: "Ibovespa",
          createdAt: CREATED_AT.toISOString(),
        })
      })

      it("should return only the requested benchmark when several benchmarks exist", async () => {
        await benchmarkRepository.save(
          buildBenchmark({
            acronym: "IBOV",
            name: "Ibovespa",
            id: buildEntityId(ID),
          })
        )
        await benchmarkRepository.save(
          buildBenchmark({
            acronym: "CDI",
            name: "Interbancario",
            id: buildEntityId(OTHER_ID),
          })
        )
        const useCase = new GetBenchmarkUseCase(
          benchmarkRepository
        )

        const response = await useCase.execute({
          benchmarkId: OTHER_ID,
        })

        expect(response.id).toBe(OTHER_ID)
        expect(response.acronym).toBe("CDI")
        expect(response.name).toBe("Interbancario")
      })

      it("should throw NotFoundError when the benchmark does not exist", async () => {
        await benchmarkRepository.save(
          buildBenchmark({ id: buildEntityId(OTHER_ID) })
        )
        const useCase = new GetBenchmarkUseCase(
          benchmarkRepository
        )

        await expect(
          useCase.execute({ benchmarkId: ID })
        ).rejects.toThrow(NotFoundError)
      })
    })
  })
})
