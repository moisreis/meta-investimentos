import { db } from "@/__tests__/__setup__/_database.setup";
import {
  BenchmarkHistoryRepository,
  BenchmarkRepository,
} from "@/infrastructure/repositories";

/**
 * Re-exports the benchmark seed fixtures and functions
 * used by benchmark repository tests.
 */
export {
  BENCHMARK,
  BENCHMARK_ID,
  FRESH_BENCHMARK,
  OTHER_BENCHMARK,
  OTHER_BENCHMARK_ID,
  seedBenchmarkById,
  seedBenchmarks,
  UPDATED_BENCHMARK,
} from "@/__tests__/__seeds__/_benchmark.seed";

/**
 * Re-exports the benchmark history seed fixtures and
 * functions used by benchmark history repository tests.
 */
export {
  BENCHMARK_HISTORY,
  BENCHMARK_HISTORY_ID,
  EXTERNAL_BENCHMARK_HISTORY,
  EXTERNAL_BENCHMARK_HISTORY_ID,
  FEBRUARY_HISTORY_DATE,
  FRESH_BENCHMARK_HISTORY,
  HISTORY_DATE,
  HISTORY_DUPLICATE_DATE,
  OTHER_BENCHMARK_HISTORY,
  OTHER_BENCHMARK_HISTORY_ID,
  PERIOD_OUTSIDE_HISTORY,
  PERIOD_OUTSIDE_HISTORY_ID,
  seedAllBenchmarkHistories,
  seedBenchmarkHistories,
  UPDATED_BENCHMARK_HISTORY,
} from "@/__tests__/__seeds__/_benchmark-history.seed";

/**
 * Creates a new `BenchmarkRepository` bound to the
 * shared test database.
 *
 * @returns A new `BenchmarkRepository` instance.
 */
export function newBenchmarkRepository(): BenchmarkRepository {
  return new BenchmarkRepository(db);
}

/**
 * Creates a new `BenchmarkHistoryRepository` bound to
 * the shared test database.
 *
 * @returns A new `BenchmarkHistoryRepository` instance.
 */
export function newBenchmarkHistoryRepository(): BenchmarkHistoryRepository {
  return new BenchmarkHistoryRepository(db);
}
