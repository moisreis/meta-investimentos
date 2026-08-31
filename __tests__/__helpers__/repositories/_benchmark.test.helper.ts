import { db } from "@/__tests__/__setup__/_database.setup";
import {
  BenchmarkHistoryRepository,
  BenchmarkRepository,
} from "@/infrastructure/repositories";

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

export function newBenchmarkRepository(): BenchmarkRepository {
  return new BenchmarkRepository(db);
}

export function newBenchmarkHistoryRepository(): BenchmarkHistoryRepository {
  return new BenchmarkHistoryRepository(db);
}
