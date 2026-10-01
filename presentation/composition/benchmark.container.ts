import { db } from "@/clients/database.client"
import { BenchmarkRepository } from "@/infrastructure/benchmark/repositories/benchmark.repository"
import { CreateBenchmarkUseCase } from "@/services/benchmark/use-cases/create-benchmark.use-case"
import { GetBenchmarkUseCase } from "@/services/benchmark/use-cases/get-benchmark.use-case"
import { ListBenchmarksUseCase } from "@/services/benchmark/use-cases/list-benchmarks.use-case"
import { UpdateBenchmarkUseCase } from "@/services/benchmark/use-cases/update-benchmark.use-case"

// The benchmark use cases, already wired to the repository.
interface BenchmarkUseCases {
  create: CreateBenchmarkUseCase
  get: GetBenchmarkUseCase
  list: ListBenchmarksUseCase
  update: UpdateBenchmarkUseCase
}

/**
 * @summary
 * Wires the benchmark use cases to the benchmark repository.
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
 * benchmark use case.
 *
 * @returns The wired benchmark use cases.
 *
 * @example
 * const { create: CREATE_BENCHMARK } = BenchmarkContainer();
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function BenchmarkContainer(): BenchmarkUseCases {
  const REPOSITORY = new BenchmarkRepository(db)

  return {
    create: new CreateBenchmarkUseCase(REPOSITORY),
    get: new GetBenchmarkUseCase(REPOSITORY),
    list: new ListBenchmarksUseCase(REPOSITORY),
    update: new UpdateBenchmarkUseCase(REPOSITORY),
  }
}

export { BenchmarkContainer, type BenchmarkUseCases }
