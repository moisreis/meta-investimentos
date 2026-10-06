import { db } from "@/clients/database.client"
import { BenchmarkRepository } from "@/infrastructure/benchmark/repositories/benchmark.repository"
import { BenchmarkHistoryRepository } from "@/infrastructure/benchmark-history/repositories/benchmark-history.repository"
import { DeleteBenchmarkHistoryUseCase } from "@/services/benchmark-history/use-cases/delete-benchmark-history.use-case"
import { GetBenchmarkHistoryUseCase } from "@/services/benchmark-history/use-cases/get-benchmark-history.use-case"
import { ListBenchmarkHistoryUseCase } from "@/services/benchmark-history/use-cases/list-benchmark-history.use-case"
import { RecordBenchmarkHistoryUseCase } from "@/services/benchmark-history/use-cases/record-benchmark-history.use-case"
import { UpdateBenchmarkHistoryUseCase } from "@/services/benchmark-history/use-cases/update-benchmark-history.use-case"

// The benchmark history use cases, already wired to the repositories.
interface BenchmarkHistoryUseCases {
  get: GetBenchmarkHistoryUseCase
  list: ListBenchmarkHistoryUseCase
  record: RecordBenchmarkHistoryUseCase
  update: UpdateBenchmarkHistoryUseCase
  delete: DeleteBenchmarkHistoryUseCase
}

/**
 * @summary
 * Wires the benchmark history use cases to the repositories.
 *
 * @remarks
 * This is the only place allowed to know that a use case
 * is built on a Drizzle repository. Actions and loaders ask
 * the container for the use case they need, so the delivery
 * layer never reaches into the infrastructure layer and the
 * wiring lives in a single spot.
 *
 * @explanation
 * Use this container from any server module that needs a
 * benchmark history use case.
 *
 * @returns The wired benchmark history use cases.
 *
 * @example
 * const { list: LIST_BENCHMARK_HISTORY } = BenchmarkHistoryContainer();
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function BenchmarkHistoryContainer(): BenchmarkHistoryUseCases {
  const BENCHMARK_REPOSITORY = new BenchmarkRepository(db)
  const HISTORY_REPOSITORY = new BenchmarkHistoryRepository(db)

  return {
    get: new GetBenchmarkHistoryUseCase(HISTORY_REPOSITORY),
    list: new ListBenchmarkHistoryUseCase(HISTORY_REPOSITORY),
    record: new RecordBenchmarkHistoryUseCase(
      HISTORY_REPOSITORY,
      BENCHMARK_REPOSITORY
    ),
    update: new UpdateBenchmarkHistoryUseCase(
      HISTORY_REPOSITORY,
      BENCHMARK_REPOSITORY
    ),
    delete: new DeleteBenchmarkHistoryUseCase(
      HISTORY_REPOSITORY
    ),
  }
}

export {
  BenchmarkHistoryContainer,
  type BenchmarkHistoryUseCases,
}
