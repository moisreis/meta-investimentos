import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { RecordBenchmarkHistoryUseCase } from "@/services/benchmark-history/use-cases/record-benchmark-history.use-case"
import { NotFoundError } from "@errors/not-found.error"
import { ValidationError } from "@errors/validation.error"
import {
  createFakeBenchmarkHistoryRepository,
  createFakeBenchmarkRepository,
} from "__tests__/__setup__/_fakes.setup"
import {
  buildBenchmark,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"
import {
  getFixedDate,
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

const ID = "00000000-0000-0000-0000-000000000001"
const MISSING_ID = "00000000-0000-0000-0000-000000000009"
const DATE = new Date("2026-03-01T00:00:00.000Z")
const ENTRY_ID = `${ID}-${DATE.getTime()}`

describe("services/benchmark-history/use-cases/record-benchmark-history.use-case", () => {
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
  })

  afterEach(() => {
    useRealClock()
  })

  describe("RecordBenchmarkHistoryUseCase", () => {
    describe("execute", () => {
      it("should persist the entry built from the payload", async () => {
        await benchmarkRepository.save(
          buildBenchmark({ id: buildEntityId(ID) })
        )
        const useCase = new RecordBenchmarkHistoryUseCase(
          benchmarkHistoryRepository,
          benchmarkRepository
        )

        const response = await useCase.execute({
          benchmarkId: ID,
          date: DATE.toISOString(),
          rate: "13.65",
        })

        expect(response).toStrictEqual({
          id: ENTRY_ID,
          benchmarkId: ID,
          date: "2026-03-01T00:00:00.000Z",
          rate: "13.65",
          createdAt: getFixedDate().toISOString(),
        })

        const stored =
          await benchmarkHistoryRepository.findByBenchmarkIdAndDate(
            buildEntityId(ID),
            DATE
          )

        expect(stored).not.toBeNull()
        expect(stored?.benchmarkId).toBe(ID)
      })

      it("should round the rate to two decimal places when the payload carries extra precision", async () => {
        await benchmarkRepository.save(
          buildBenchmark({ id: buildEntityId(ID) })
        )
        const useCase = new RecordBenchmarkHistoryUseCase(
          benchmarkHistoryRepository,
          benchmarkRepository
        )

        const response = await useCase.execute({
          benchmarkId: ID,
          date: DATE.toISOString(),
          rate: "13.657",
        })

        expect(response.rate).toBe("13.66")
      })

      it("should throw NotFoundError when the benchmark does not exist", async () => {
        const useCase = new RecordBenchmarkHistoryUseCase(
          benchmarkHistoryRepository,
          benchmarkRepository
        )

        await expect(
          useCase.execute({
            benchmarkId: MISSING_ID,
            date: DATE.toISOString(),
            rate: "13.65",
          })
        ).rejects.toThrow(NotFoundError)
      })

      it("should store nothing when the benchmark does not exist", async () => {
        const useCase = new RecordBenchmarkHistoryUseCase(
          benchmarkHistoryRepository,
          benchmarkRepository
        )

        await expect(
          useCase.execute({
            benchmarkId: MISSING_ID,
            date: DATE.toISOString(),
            rate: "13.65",
          })
        ).rejects.toThrow(NotFoundError)

        expect(
          await benchmarkHistoryRepository.findAllByBenchmarkId(
            buildEntityId(MISSING_ID)
          )
        ).toStrictEqual([])
      })

      it("should throw ValidationError when the rate is not a number", async () => {
        await benchmarkRepository.save(
          buildBenchmark({ id: buildEntityId(ID) })
        )
        const useCase = new RecordBenchmarkHistoryUseCase(
          benchmarkHistoryRepository,
          benchmarkRepository
        )

        await expect(
          useCase.execute({
            benchmarkId: ID,
            date: DATE.toISOString(),
            rate: "not-a-number",
          })
        ).rejects.toThrow(ValidationError)

        expect(
          await benchmarkHistoryRepository.findAllByBenchmarkId(
            buildEntityId(ID)
          )
        ).toStrictEqual([])
      })
    })
  })
})
