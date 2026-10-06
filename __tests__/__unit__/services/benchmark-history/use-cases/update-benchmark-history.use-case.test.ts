import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { UpdateBenchmarkHistoryUseCase } from "@/services/benchmark-history/use-cases/update-benchmark-history.use-case"
import { NotFoundError } from "@errors/not-found.error"
import {
  createFakeBenchmarkHistoryRepository,
  createFakeBenchmarkRepository,
} from "__tests__/__setup__/_fakes.setup"
import {
  buildBenchmark,
  buildBenchmarkHistory,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

const ID = "00000000-0000-0000-0000-000000000001"
const OTHER_ID = "00000000-0000-0000-0000-000000000002"
const MISSING_ID = "00000000-0000-0000-0000-000000000009"
const DATE = new Date("2026-03-01T00:00:00.000Z")
const NEXT_DATE = new Date("2026-04-01T00:00:00.000Z")

describe("services/benchmark-history/use-cases/update-benchmark-history.use-case", () => {
  let benchmarkHistoryRepository: ReturnType<
    typeof createFakeBenchmarkHistoryRepository
  >
  let benchmarkRepository: ReturnType<
    typeof createFakeBenchmarkRepository
  >

  beforeEach(() => {
    useFixedClock()
    benchmarkHistoryRepository =
      createFakeBenchmarkHistoryRepository()
    benchmarkRepository = createFakeBenchmarkRepository()
    benchmarkRepository.save(
      buildBenchmark({ id: buildEntityId(ID) })
    )
    benchmarkRepository.save(
      buildBenchmark({ id: buildEntityId(OTHER_ID) })
    )
  })

  afterEach(() => {
    useRealClock()
  })

  /**
   * Stores an entry of the first index on `DATE`, which is the
   * entry every case below corrects.
   */
  async function SeedEntry() {
    return benchmarkHistoryRepository.save(
      buildBenchmarkHistory({
        benchmarkId: buildEntityId(ID),
        date: DATE,
      })
    )
  }

  describe("UpdateBenchmarkHistoryUseCase", () => {
    describe("execute", () => {
      it("should rewrite the rate of the entry", async () => {
        const ENTRY = await SeedEntry()
        const useCase = new UpdateBenchmarkHistoryUseCase(
          benchmarkHistoryRepository,
          benchmarkRepository
        )

        const response = await useCase.execute({
          benchmarkHistoryId: ENTRY.id as string,
          benchmarkId: ID,
          date: DATE.toISOString(),
          rate: "11.25",
        })

        expect(response.rate).toBe("11.25")
      })

      it("should rewrite the index and the month of the entry", async () => {
        const ENTRY = await SeedEntry()
        const useCase = new UpdateBenchmarkHistoryUseCase(
          benchmarkHistoryRepository,
          benchmarkRepository
        )

        const response = await useCase.execute({
          benchmarkHistoryId: ENTRY.id as string,
          benchmarkId: OTHER_ID,
          date: NEXT_DATE.toISOString(),
          rate: "10.75",
        })

        expect(response.benchmarkId).toBe(OTHER_ID)
        expect(response.date).toBe(NEXT_DATE.toISOString())
      })

      it("should persist the change on the same entry", async () => {
        const ENTRY = await SeedEntry()
        const useCase = new UpdateBenchmarkHistoryUseCase(
          benchmarkHistoryRepository,
          benchmarkRepository
        )

        const response = await useCase.execute({
          benchmarkHistoryId: ENTRY.id as string,
          benchmarkId: ID,
          date: DATE.toISOString(),
          rate: "11.25",
        })

        const stored = await benchmarkHistoryRepository.findById(
          buildEntityId(ENTRY.id as string)
        )

        expect(stored?.rate.value.toFixed(2)).toBe("11.25")
        expect(response.id).toBe(ENTRY.id)
      })

      it("should accept a negative rate", async () => {
        const ENTRY = await SeedEntry()
        const useCase = new UpdateBenchmarkHistoryUseCase(
          benchmarkHistoryRepository,
          benchmarkRepository
        )

        const response = await useCase.execute({
          benchmarkHistoryId: ENTRY.id as string,
          benchmarkId: ID,
          date: DATE.toISOString(),
          rate: "-1.88",
        })

        expect(response.rate).toBe("-1.88")
      })

      it("should throw NotFoundError when the entry does not exist", async () => {
        const useCase = new UpdateBenchmarkHistoryUseCase(
          benchmarkHistoryRepository,
          benchmarkRepository
        )

        await expect(
          useCase.execute({
            benchmarkHistoryId: MISSING_ID,
            benchmarkId: ID,
            date: DATE.toISOString(),
            rate: "11.25",
          })
        ).rejects.toThrow(NotFoundError)
      })

      it("should throw NotFoundError when the target index does not exist", async () => {
        const ENTRY = await SeedEntry()
        const useCase = new UpdateBenchmarkHistoryUseCase(
          benchmarkHistoryRepository,
          benchmarkRepository
        )

        await expect(
          useCase.execute({
            benchmarkHistoryId: ENTRY.id as string,
            benchmarkId: MISSING_ID,
            date: DATE.toISOString(),
            rate: "11.25",
          })
        ).rejects.toThrow(NotFoundError)
      })
    })
  })
})
