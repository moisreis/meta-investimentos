import {
  BENCHMARK_HISTORY,
  BENCHMARK_HISTORY_ID,
  BENCHMARK_ID,
  EXTERNAL_BENCHMARK_HISTORY,
  EXTERNAL_BENCHMARK_HISTORY_ID,
  FEBRUARY_HISTORY_DATE,
  FRESH_BENCHMARK_HISTORY,
  HISTORY_DATE,
  HISTORY_DUPLICATE_DATE,
  OTHER_BENCHMARK_HISTORY,
  OTHER_BENCHMARK_HISTORY_ID,
  OTHER_BENCHMARK_ID,
  PERIOD_OUTSIDE_BENCHMARK_HISTORY,
  PERIOD_OUTSIDE_BENCHMARK_HISTORY_ID,
  UPDATED_BENCHMARK_HISTORY,
} from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { IBenchmarkHistory } from "@/business/interfaces/benchmark/benchmark-history.interface";

export {
  BENCHMARK_HISTORY_ID,
  OTHER_BENCHMARK_HISTORY_ID,
  EXTERNAL_BENCHMARK_HISTORY_ID,
  PERIOD_OUTSIDE_BENCHMARK_HISTORY_ID,
  BENCHMARK_ID,
  OTHER_BENCHMARK_ID,
  HISTORY_DATE,
  HISTORY_DUPLICATE_DATE,
  FEBRUARY_HISTORY_DATE,
  BENCHMARK_HISTORY,
  OTHER_BENCHMARK_HISTORY,
  EXTERNAL_BENCHMARK_HISTORY,
  PERIOD_OUTSIDE_BENCHMARK_HISTORY,
  UPDATED_BENCHMARK_HISTORY,
  FRESH_BENCHMARK_HISTORY,
};

export const HISTORY_ID = BENCHMARK_HISTORY_ID;
export const HISTORY = BENCHMARK_HISTORY;

export function createInMemoryBenchmarkHistoryRepository(): IBenchmarkHistory {
  const BASE = createInMemoryRepository<
    Awaited<ReturnType<IBenchmarkHistory["save"]>>
  >({ extractId: (bh) => bh.id });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByBenchmarkId(benchmarkId) {
      return BASE.match((bh) => bh.benchmarkId === benchmarkId);
    },
    async findByBenchmarkIdAndDate(benchmarkId, date) {
      return BASE.findOne(
        (bh) =>
          bh.benchmarkId === benchmarkId &&
          bh.date.getTime() === date.getTime(),
      );
    },
    save: (benchmarkHistory) => BASE.save(benchmarkHistory),
    delete: (id) => BASE.delete(id),
  };
}
