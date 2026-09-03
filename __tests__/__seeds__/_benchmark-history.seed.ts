import { ID } from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import { BenchmarkHistory } from "@/business/entities/benchmark/benchmark-history.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import { benchmarkHistory } from "@/infrastructure/database/schemas";
import { seedBenchmarkById } from "./_benchmark.seed";

/**
 * Represents January 5, 2026 for benchmark history testing.
 */
export const HISTORY_DATE = new Date("2026-01-05T00:00:00.000Z");

/**
 * Represents January 15, 2026 for duplicate date testing.
 */
export const HISTORY_DUPLICATE_DATE = new Date("2026-01-15T00:00:00.000Z");

/**
 * Represents February 5, 2026 for benchmark history testing.
 */
export const FEBRUARY_HISTORY_DATE = new Date("2026-02-05T00:00:00.000Z");

/**
 * Represents the default benchmark history ID used in tests.
 */
export const BENCHMARK_HISTORY_ID = ID.BENCHMARK_HISTORY.DEFAULT;

/**
 * Represents an alternative benchmark history ID used in tests.
 */
export const OTHER_BENCHMARK_HISTORY_ID = ID.BENCHMARK_HISTORY.OTHER;

/**
 * Represents an external benchmark history ID used in tests.
 */
export const EXTERNAL_BENCHMARK_HISTORY_ID = ID.BENCHMARK_HISTORY.EXTERNAL;

/**
 * Represents a benchmark history ID outside the standard period.
 */
export const PERIOD_OUTSIDE_BENCHMARK_HISTORY_ID =
  ID.BENCHMARK_HISTORY.PERIOD_OUTSIDE;

/**
 * Represents the default benchmark history fixture for tests.
 *
 * The fixture uses the default benchmark, January date,
 * and a rate of `1.25%`.
 */
export const BENCHMARK_HISTORY = BenchmarkHistory.create(
  {
    benchmarkId: EntityId.create(ID.BENCHMARK.DEFAULT),
    date: HISTORY_DATE,
    rate: SignedPercentage.create("1.25"),
  },
  ID.BENCHMARK_HISTORY.DEFAULT,
);

/**
 * Represents an alternative benchmark history fixture for tests.
 *
 * The fixture uses the other benchmark, February date,
 * and a negative rate of `-0.5%`.
 */
export const OTHER_BENCHMARK_HISTORY = BenchmarkHistory.create(
  {
    benchmarkId: EntityId.create(ID.BENCHMARK.OTHER),
    date: FEBRUARY_HISTORY_DATE,
    rate: SignedPercentage.create("-0.5"),
  },
  ID.BENCHMARK_HISTORY.OTHER,
);

/**
 * Represents an external benchmark history fixture for tests.
 *
 * The fixture uses the default benchmark, the January
 * duplicate date, and a rate of `0.75%`.
 */
export const EXTERNAL_BENCHMARK_HISTORY = BenchmarkHistory.create(
  {
    benchmarkId: EntityId.create(ID.BENCHMARK.DEFAULT),
    date: HISTORY_DUPLICATE_DATE,
    rate: SignedPercentage.create("0.75"),
  },
  ID.BENCHMARK_HISTORY.EXTERNAL,
);

/**
 * Represents a benchmark history fixture outside the standard period.
 *
 * The fixture uses the default benchmark, a March date,
 * and a rate of `2.0%`.
 */
export const PERIOD_OUTSIDE_BENCHMARK_HISTORY = BenchmarkHistory.create(
  {
    benchmarkId: EntityId.create(ID.BENCHMARK.DEFAULT),
    date: new Date("2026-03-01T00:00:00.000Z"),
    rate: SignedPercentage.create("2.0"),
  },
  ID.BENCHMARK_HISTORY.PERIOD_OUTSIDE,
);

/**
 * Represents an updated version of the default benchmark history fixture.
 *
 * The fixture reuses the default benchmark history ID but
 * changes the rate to `1.5%`.
 */
export const UPDATED_BENCHMARK_HISTORY = BenchmarkHistory.create(
  {
    benchmarkId: EntityId.create(ID.BENCHMARK.DEFAULT),
    date: HISTORY_DATE,
    rate: SignedPercentage.create("1.5"),
  },
  ID.BENCHMARK_HISTORY.DEFAULT,
);

/**
 * Represents a benchmark history fixture without a predefined ID.
 *
 * The fixture uses the default benchmark, an April date,
 * and a rate of `1.1%`.
 */
export const FRESH_BENCHMARK_HISTORY = BenchmarkHistory.create({
  benchmarkId: EntityId.create(ID.BENCHMARK.DEFAULT),
  date: new Date("2026-04-05T00:00:00.000Z"),
  rate: SignedPercentage.create("1.1"),
});

const PERIOD_OUTSIDE_HISTORY_ID = PERIOD_OUTSIDE_BENCHMARK_HISTORY_ID;
const PERIOD_OUTSIDE_HISTORY = PERIOD_OUTSIDE_BENCHMARK_HISTORY;

/**
 * Represents the ID for the period outside benchmark history.
 */
export { PERIOD_OUTSIDE_HISTORY_ID };

/**
 * Represents the period outside benchmark history fixture.
 */
export { PERIOD_OUTSIDE_HISTORY };

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

/**
 * Seeds the default benchmark histories into the test database.
 *
 * The function ensures that both the default and the other
 * benchmark records exist. It then inserts the
 * `BENCHMARK_HISTORY` and `OTHER_BENCHMARK_HISTORY`
 * fixtures.
 *
 * @returns A promise that resolves to an array containing
 *          the seeded `BenchmarkHistory` fixtures.
 */
export async function seedBenchmarkHistories(): Promise<BenchmarkHistory[]> {
  await seedBenchmarkById(ID.BENCHMARK.DEFAULT);
  await seedBenchmarkById(ID.BENCHMARK.OTHER);

  for (const fixture of [BENCHMARK_HISTORY, OTHER_BENCHMARK_HISTORY]) {
    await db
      .insert(benchmarkHistory)
      .values({ ...toBenchmarkHistoryRow(fixture), id: fixture.id });
  }

  return [BENCHMARK_HISTORY, OTHER_BENCHMARK_HISTORY];
}

/**
 * Seeds all benchmark histories into the test database.
 *
 * The function ensures that the required benchmark records
 * exist. It then inserts all benchmark history fixtures
 * including the external and period outside fixtures.
 *
 * @returns A promise that resolves to an array containing
 *          all seeded `BenchmarkHistory` fixtures.
 */
export async function seedAllBenchmarkHistories(): Promise<BenchmarkHistory[]> {
  await seedBenchmarkById(ID.BENCHMARK.DEFAULT);
  await seedBenchmarkById(ID.BENCHMARK.OTHER);

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
