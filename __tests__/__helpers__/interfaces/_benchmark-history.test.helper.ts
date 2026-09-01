import { BenchmarkHistory } from "@/business/entities/benchmark/benchmark-history.entity";
import type { IBenchmarkHistory } from "@/business/interfaces/benchmark/benchmark-history.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

export const HISTORY_ID = "f8c1b1a7-3f92-4c58-b6e1-2b47c1b21d78";
export const BENCHMARK_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";
export const OTHER_BENCHMARK_ID = "c47d54e2-4a03-4f71-9c0d-3a58d2c33e90";
export const HISTORY_DATE = new Date("2026-01-01T00:00:00.000Z");

export const HISTORY = BenchmarkHistory.create(
  {
    benchmarkId: EntityId.create(BENCHMARK_ID),
    date: HISTORY_DATE,
    rate: SignedPercentage.create("12.345"),
  },
  HISTORY_ID,
);

export function createInMemoryBenchmarkHistoryRepository(): IBenchmarkHistory {
  const ROWS = new Map<string, BenchmarkHistory>();

  return {
    async findById(id: string): Promise<BenchmarkHistory | null> {
      return ROWS.get(id) ?? null;
    },

    async findAllByBenchmarkId(
      benchmarkId: string,
    ): Promise<BenchmarkHistory[]> {
      const MATCHES: BenchmarkHistory[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.benchmarkId === benchmarkId) MATCHES.push(ROW);
      }

      return MATCHES;
    },

    async findByBenchmarkIdAndDate(
      benchmarkId: string,
      date: Date,
    ): Promise<BenchmarkHistory | null> {
      for (const ROW of ROWS.values()) {
        if (
          ROW.benchmarkId === benchmarkId &&
          ROW.date.getTime() === date.getTime()
        ) {
          return ROW;
        }
      }

      return null;
    },

    async save(benchmarkHistory: BenchmarkHistory): Promise<BenchmarkHistory> {
      ROWS.set(benchmarkHistory.id ?? "generated-id", benchmarkHistory);

      return benchmarkHistory;
    },

    async delete(id: string): Promise<void> {
      ROWS.delete(id);
    },
  };
}
