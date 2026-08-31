import { db } from "@/__tests__/__setup__/_database.setup";
import { BenchmarkHistory } from "@/business/entities";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";
import { benchmarkHistory } from "@/infrastructure/database/schemas";
import {
  BENCHMARK_ID,
  OTHER_BENCHMARK_ID,
  seedBenchmarkById,
} from "./_benchmark.seed";

export const BENCHMARK_HISTORY_ID = "89012abc-def0-4afe-9012-3abcdef0123a";
export const OTHER_BENCHMARK_HISTORY_ID =
  "9a01bcde-f012-4afe-1234-bcdef01234ab";
export const EXTERNAL_BENCHMARK_HISTORY_ID =
  "ab01cdef-0123-4afe-3456-cdef012345ab";
export const PERIOD_OUTSIDE_HISTORY_ID = "bc12def0-1234-4afe-5678-def0123456bc";

export const HISTORY_DATE = new Date("2026-01-05T00:00:00.000Z");
export const HISTORY_DUPLICATE_DATE = new Date("2026-01-15T00:00:00.000Z");
export const FEBRUARY_HISTORY_DATE = new Date("2026-02-05T00:00:00.000Z");

export const BENCHMARK_HISTORY = BenchmarkHistory.create(
  {
    benchmarkId: BENCHMARK_ID,
    date: HISTORY_DATE,
    rate: SignedPercentage.create("1.25"),
  },
  BENCHMARK_HISTORY_ID,
);

export const OTHER_BENCHMARK_HISTORY = BenchmarkHistory.create(
  {
    benchmarkId: OTHER_BENCHMARK_ID,
    date: FEBRUARY_HISTORY_DATE,
    rate: SignedPercentage.create("-0.5"),
  },
  OTHER_BENCHMARK_HISTORY_ID,
);

export const EXTERNAL_BENCHMARK_HISTORY = BenchmarkHistory.create(
  {
    benchmarkId: BENCHMARK_ID,
    date: HISTORY_DUPLICATE_DATE,
    rate: SignedPercentage.create("0.75"),
  },
  EXTERNAL_BENCHMARK_HISTORY_ID,
);

export const PERIOD_OUTSIDE_HISTORY = BenchmarkHistory.create(
  {
    benchmarkId: BENCHMARK_ID,
    date: new Date("2026-03-01T00:00:00.000Z"),
    rate: SignedPercentage.create("2.0"),
  },
  PERIOD_OUTSIDE_HISTORY_ID,
);

export const UPDATED_BENCHMARK_HISTORY = BenchmarkHistory.create(
  {
    benchmarkId: BENCHMARK_ID,
    date: HISTORY_DATE,
    rate: SignedPercentage.create("1.5"),
  },
  BENCHMARK_HISTORY_ID,
);

export const FRESH_BENCHMARK_HISTORY = BenchmarkHistory.create({
  benchmarkId: BENCHMARK_ID,
  date: new Date("2026-04-05T00:00:00.000Z"),
  rate: SignedPercentage.create("1.1"),
});

function toBenchmarkHistoryRow(
  entity: BenchmarkHistory,
): typeof benchmarkHistory.$inferInsert {
  return {
    benchmarkId: entity.benchmarkId,
    date: entity.date,
    rate: entity.rate.value.toString(),
    createdAt: entity.createdAt,
  };
}

export async function seedBenchmarkHistories(): Promise<BenchmarkHistory[]> {
  await seedBenchmarkById(BENCHMARK_ID);
  await seedBenchmarkById(OTHER_BENCHMARK_ID);

  for (const fixture of [BENCHMARK_HISTORY, OTHER_BENCHMARK_HISTORY]) {
    await db
      .insert(benchmarkHistory)
      .values({ ...toBenchmarkHistoryRow(fixture), id: fixture.id });
  }

  return [BENCHMARK_HISTORY, OTHER_BENCHMARK_HISTORY];
}

export async function seedAllBenchmarkHistories(): Promise<BenchmarkHistory[]> {
  await seedBenchmarkById(BENCHMARK_ID);
  await seedBenchmarkById(OTHER_BENCHMARK_ID);

  for (const fixture of [
    BENCHMARK_HISTORY,
    EXTERNAL_BENCHMARK_HISTORY,
    PERIOD_OUTSIDE_HISTORY,
    OTHER_BENCHMARK_HISTORY,
  ]) {
    await db
      .insert(benchmarkHistory)
      .values({ ...toBenchmarkHistoryRow(fixture), id: fixture.id });
  }

  return [
    BENCHMARK_HISTORY,
    EXTERNAL_BENCHMARK_HISTORY,
    PERIOD_OUTSIDE_HISTORY,
    OTHER_BENCHMARK_HISTORY,
  ];
}
