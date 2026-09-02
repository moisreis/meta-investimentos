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
import { db } from "@/__tests__/__setup__/_database.setup";
import type { BenchmarkHistory } from "@/business/entities";
import { benchmarkHistory } from "@/infrastructure/database/schemas";
import { seedBenchmarkById } from "./_benchmark.seed";

const PERIOD_OUTSIDE_HISTORY_ID = PERIOD_OUTSIDE_BENCHMARK_HISTORY_ID;
const PERIOD_OUTSIDE_HISTORY = PERIOD_OUTSIDE_BENCHMARK_HISTORY;

export {
  BENCHMARK_HISTORY_ID,
  OTHER_BENCHMARK_HISTORY_ID,
  EXTERNAL_BENCHMARK_HISTORY_ID,
  HISTORY_DATE,
  HISTORY_DUPLICATE_DATE,
  FEBRUARY_HISTORY_DATE,
  BENCHMARK_HISTORY,
  OTHER_BENCHMARK_HISTORY,
  EXTERNAL_BENCHMARK_HISTORY,
  UPDATED_BENCHMARK_HISTORY,
  FRESH_BENCHMARK_HISTORY,
};

export { PERIOD_OUTSIDE_HISTORY_ID, PERIOD_OUTSIDE_HISTORY };

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
