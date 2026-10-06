import { describe, it, expect, beforeEach } from "vitest"

import { DeleteBenchmarkHistoryUseCase } from "@/services/benchmark-history/use-cases/delete-benchmark-history.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { createFakeBenchmarkHistoryRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildBenchmarkHistory,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"
const MISSING_ID = "00000000-0000-0000-0000-000000000009"

describe("services/benchmark-history/use-cases/delete-benchmark-history.use-case", () => {
  let benchmarkHistoryRepository: ReturnType<
    typeof createFakeBenchmarkHistoryRepository
  >

  beforeEach(() => {
    benchmarkHistoryRepository =
      createFakeBenchmarkHistoryRepository()
  })

  describe("DeleteBenchmarkHistoryUseCase", () => {
    describe("execute", () => {
      it("should remove the entry when it exists", async () => {
        const ENTRY = await benchmarkHistoryRepository.save(
          buildBenchmarkHistory({ id: buildEntityId(ID) })
        )
        const useCase = new DeleteBenchmarkHistoryUseCase(
          benchmarkHistoryRepository
        )

        await useCase.execute({
          benchmarkHistoryId: ENTRY.id as string,
        })

        const stored = await benchmarkHistoryRepository.findById(
          buildEntityId(ID)
        )

        expect(stored).toBeNull()
      })

      it("should leave the other entries untouched", async () => {
        const ENTRY = await benchmarkHistoryRepository.save(
          buildBenchmarkHistory({
            id: buildEntityId(ID),
            date: new Date("2026-01-01T00:00:00.000Z"),
          })
        )
        await benchmarkHistoryRepository.save(
          buildBenchmarkHistory({
            date: new Date("2026-02-01T00:00:00.000Z"),
          })
        )
        const useCase = new DeleteBenchmarkHistoryUseCase(
          benchmarkHistoryRepository
        )

        await useCase.execute({
          benchmarkHistoryId: ENTRY.id as string,
        })

        const stored = await benchmarkHistoryRepository.findById(
          buildEntityId(ENTRY.id as string)
        )

        expect(stored).toBeNull()
        expect(
          await benchmarkHistoryRepository.findAllByBenchmarkIds(
            [buildEntityId("benchmark-1")]
          )
        ).toHaveLength(1)
      })

      it("should throw NotFoundError when the entry does not exist", async () => {
        const useCase = new DeleteBenchmarkHistoryUseCase(
          benchmarkHistoryRepository
        )

        await expect(
          useCase.execute({ benchmarkHistoryId: MISSING_ID })
        ).rejects.toThrow(NotFoundError)
      })
    })
  })
})
