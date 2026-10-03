import { describe, it, expect, beforeEach } from "vitest"

import { ListBenchmarkHistoryUseCase } from "@/services/benchmark-history/use-cases/list-benchmark-history.use-case"
import { createFakeBenchmarkHistoryRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildBenchmarkHistory,
  buildEntityId,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"

const FIRST_ID = "00000000-0000-0000-0000-000000000001"
const SECOND_ID = "00000000-0000-0000-0000-000000000002"
const THIRD_ID = "00000000-0000-0000-0000-000000000003"
const FIRST_BENCHMARK_ID = "00000000-0000-0000-0000-000000000010"
const SECOND_BENCHMARK_ID =
  "00000000-0000-0000-0000-000000000011"
const CREATED_AT = new Date("2026-01-01T00:00:00.000Z")

describe("services/benchmark-history/use-cases/list-benchmark-history.use-case", () => {
  let benchmarkHistoryRepository: ReturnType<
    typeof createFakeBenchmarkHistoryRepository
  >

  beforeEach(() => {
    benchmarkHistoryRepository =
      createFakeBenchmarkHistoryRepository()
  })

  describe("ListBenchmarkHistoryUseCase", () => {
    describe("execute", () => {
      it("should return the entries oldest first when the benchmark has history", async () => {
        await benchmarkHistoryRepository.save(
          buildBenchmarkHistory({
            benchmarkId: buildEntityId(FIRST_BENCHMARK_ID),
            date: new Date("2026-03-03T00:00:00.000Z"),
            rate: buildSignedPercentage("13.67"),
            createdAt: CREATED_AT,
            id: buildEntityId(FIRST_ID),
          })
        )
        await benchmarkHistoryRepository.save(
          buildBenchmarkHistory({
            benchmarkId: buildEntityId(FIRST_BENCHMARK_ID),
            date: new Date("2026-03-01T00:00:00.000Z"),
            rate: buildSignedPercentage("13.65"),
            createdAt: CREATED_AT,
            id: buildEntityId(SECOND_ID),
          })
        )
        await benchmarkHistoryRepository.save(
          buildBenchmarkHistory({
            benchmarkId: buildEntityId(FIRST_BENCHMARK_ID),
            date: new Date("2026-03-02T00:00:00.000Z"),
            rate: buildSignedPercentage("13.66"),
            createdAt: CREATED_AT,
            id: buildEntityId(THIRD_ID),
          })
        )
        const useCase = new ListBenchmarkHistoryUseCase(
          benchmarkHistoryRepository
        )

        const response = await useCase.execute({
          benchmarkId: FIRST_BENCHMARK_ID,
        })

        expect(response).toStrictEqual([
          {
            id: SECOND_ID,
            benchmarkId: FIRST_BENCHMARK_ID,
            date: "2026-03-01T00:00:00.000Z",
            rate: "13.65",
            createdAt: CREATED_AT.toISOString(),
          },
          {
            id: THIRD_ID,
            benchmarkId: FIRST_BENCHMARK_ID,
            date: "2026-03-02T00:00:00.000Z",
            rate: "13.66",
            createdAt: CREATED_AT.toISOString(),
          },
          {
            id: FIRST_ID,
            benchmarkId: FIRST_BENCHMARK_ID,
            date: "2026-03-03T00:00:00.000Z",
            rate: "13.67",
            createdAt: CREATED_AT.toISOString(),
          },
        ])
      })

      it("should skip the entries of another benchmark when listing", async () => {
        await benchmarkHistoryRepository.save(
          buildBenchmarkHistory({
            benchmarkId: buildEntityId(FIRST_BENCHMARK_ID),
            date: new Date("2026-03-01T00:00:00.000Z"),
            rate: buildSignedPercentage("13.65"),
            id: buildEntityId(FIRST_ID),
          })
        )
        await benchmarkHistoryRepository.save(
          buildBenchmarkHistory({
            benchmarkId: buildEntityId(SECOND_BENCHMARK_ID),
            date: new Date("2026-03-01T00:00:00.000Z"),
            rate: buildSignedPercentage("13.65"),
            id: buildEntityId(SECOND_ID),
          })
        )
        const useCase = new ListBenchmarkHistoryUseCase(
          benchmarkHistoryRepository
        )

        const response = await useCase.execute({
          benchmarkId: FIRST_BENCHMARK_ID,
        })

        expect(response).toHaveLength(1)
        expect(response[0].id).toBe(FIRST_ID)
      })

      it("should return an empty list when the benchmark has no entries", async () => {
        await benchmarkHistoryRepository.save(
          buildBenchmarkHistory({
            benchmarkId: buildEntityId(SECOND_BENCHMARK_ID),
          })
        )
        const useCase = new ListBenchmarkHistoryUseCase(
          benchmarkHistoryRepository
        )

        const response = await useCase.execute({
          benchmarkId: FIRST_BENCHMARK_ID,
        })

        expect(response).toStrictEqual([])
      })
    })
  })
})
