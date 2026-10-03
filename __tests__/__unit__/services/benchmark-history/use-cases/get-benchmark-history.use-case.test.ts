import { describe, it, expect, beforeEach } from "vitest"

import { GetBenchmarkHistoryUseCase } from "@/services/benchmark-history/use-cases/get-benchmark-history.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { createFakeBenchmarkHistoryRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildBenchmarkHistory,
  buildEntityId,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"
const OTHER_ID = "00000000-0000-0000-0000-000000000002"
const BENCHMARK_ID = "00000000-0000-0000-0000-000000000010"
const CREATED_AT = new Date("2026-01-01T00:00:00.000Z")

describe("services/benchmark-history/use-cases/get-benchmark-history.use-case", () => {
  let benchmarkHistoryRepository: ReturnType<
    typeof createFakeBenchmarkHistoryRepository
  >

  beforeEach(() => {
    benchmarkHistoryRepository =
      createFakeBenchmarkHistoryRepository()
  })

  describe("GetBenchmarkHistoryUseCase", () => {
    describe("execute", () => {
      it("should return the full response when the entry exists", async () => {
        await benchmarkHistoryRepository.save(
          buildBenchmarkHistory({
            benchmarkId: buildEntityId(BENCHMARK_ID),
            date: new Date("2026-03-01T00:00:00.000Z"),
            rate: buildSignedPercentage("13.65"),
            createdAt: CREATED_AT,
            id: buildEntityId(ID),
          })
        )
        const useCase = new GetBenchmarkHistoryUseCase(
          benchmarkHistoryRepository
        )

        const response = await useCase.execute({
          benchmarkHistoryId: ID,
        })

        expect(response).toStrictEqual({
          id: ID,
          benchmarkId: BENCHMARK_ID,
          date: "2026-03-01T00:00:00.000Z",
          rate: "13.65",
          createdAt: CREATED_AT.toISOString(),
        })
      })

      it("should return only the requested entry when several entries exist", async () => {
        await benchmarkHistoryRepository.save(
          buildBenchmarkHistory({
            benchmarkId: buildEntityId(BENCHMARK_ID),
            date: new Date("2026-03-01T00:00:00.000Z"),
            rate: buildSignedPercentage("13.65"),
            id: buildEntityId(ID),
          })
        )
        await benchmarkHistoryRepository.save(
          buildBenchmarkHistory({
            benchmarkId: buildEntityId(BENCHMARK_ID),
            date: new Date("2026-03-02T00:00:00.000Z"),
            rate: buildSignedPercentage("13.66"),
            id: buildEntityId(OTHER_ID),
          })
        )
        const useCase = new GetBenchmarkHistoryUseCase(
          benchmarkHistoryRepository
        )

        const response = await useCase.execute({
          benchmarkHistoryId: OTHER_ID,
        })

        expect(response.id).toBe(OTHER_ID)
        expect(response.date).toBe("2026-03-02T00:00:00.000Z")
        expect(response.rate).toBe("13.66")
      })

      it("should throw NotFoundError when the entry does not exist", async () => {
        await benchmarkHistoryRepository.save(
          buildBenchmarkHistory({ id: buildEntityId(OTHER_ID) })
        )
        const useCase = new GetBenchmarkHistoryUseCase(
          benchmarkHistoryRepository
        )

        await expect(
          useCase.execute({ benchmarkHistoryId: ID })
        ).rejects.toThrow(NotFoundError)
      })
    })
  })
})
