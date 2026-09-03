import { ID } from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import { BenchmarkHistory } from "@/business/entities/benchmark/benchmark-history.entity";
import type { IBenchmarkHistory } from "@/business/interfaces/benchmark/benchmark-history.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

/**
 * Represents the January benchmark history date
 * used as the primary test date.
 */
export const HISTORY_DATE = new Date("2026-01-05T00:00:00.000Z");

/**
 * Represents a January date that shares the same month
 * as {@link HISTORY_DATE} but a different day.
 */
export const HISTORY_DUPLICATE_DATE = new Date(
  "2026-01-15T00:00:00.000Z",
);

/**
 * Represents the February benchmark history date.
 */
export const FEBRUARY_HISTORY_DATE = new Date(
  "2026-02-05T00:00:00.000Z",
);

/**
 * Represents the default benchmark identifier for tests.
 */
export const BENCHMARK_ID = ID.BENCHMARK.DEFAULT;

/**
 * Represents the secondary benchmark identifier for tests.
 */
export const OTHER_BENCHMARK_ID = ID.BENCHMARK.OTHER;

/**
 * Represents the default benchmark history identifier
 * for tests.
 */
export const BENCHMARK_HISTORY_ID =
  ID.BENCHMARK_HISTORY.DEFAULT;

/**
 * Represents the secondary benchmark history identifier
 * for tests.
 */
export const OTHER_BENCHMARK_HISTORY_ID =
  ID.BENCHMARK_HISTORY.OTHER;

/**
 * Represents the external benchmark history identifier
 * for tests.
 */
export const EXTERNAL_BENCHMARK_HISTORY_ID =
  ID.BENCHMARK_HISTORY.EXTERNAL;

/**
 * Represents the period-outside benchmark history
 * identifier for tests.
 */
export const PERIOD_OUTSIDE_BENCHMARK_HISTORY_ID =
  ID.BENCHMARK_HISTORY.PERIOD_OUTSIDE;

/**
 * Represents a default benchmark history entity with a
 * positive rate in January 2026.
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
 * Represents a secondary benchmark history entity with a
 * negative rate in February 2026.
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
 * Represents an external benchmark history entity that
 * shares the default benchmark and January month.
 */
export const EXTERNAL_BENCHMARK_HISTORY =
  BenchmarkHistory.create(
    {
      benchmarkId: EntityId.create(ID.BENCHMARK.DEFAULT),
      date: HISTORY_DUPLICATE_DATE,
      rate: SignedPercentage.create("0.75"),
    },
    ID.BENCHMARK_HISTORY.EXTERNAL,
  );

/**
 * Represents a benchmark history entity dated outside the
 * default test period. The date is March 2026.
 */
export const PERIOD_OUTSIDE_BENCHMARK_HISTORY =
  BenchmarkHistory.create(
    {
      benchmarkId: EntityId.create(ID.BENCHMARK.DEFAULT),
      date: new Date("2026-03-01T00:00:00.000Z"),
      rate: SignedPercentage.create("2.0"),
    },
    ID.BENCHMARK_HISTORY.PERIOD_OUTSIDE,
  );

/**
 * Represents a benchmark history entity with an updated
 * rate. Reuses the default benchmark history identifier.
 */
export const UPDATED_BENCHMARK_HISTORY =
  BenchmarkHistory.create(
    {
      benchmarkId: EntityId.create(ID.BENCHMARK.DEFAULT),
      date: HISTORY_DATE,
      rate: SignedPercentage.create("1.5"),
    },
    ID.BENCHMARK_HISTORY.DEFAULT,
  );

/**
 * Represents a benchmark history entity without a
 * predefined identifier. The date is April 2026.
 */
export const FRESH_BENCHMARK_HISTORY =
  BenchmarkHistory.create({
    benchmarkId: EntityId.create(ID.BENCHMARK.DEFAULT),
    date: new Date("2026-04-05T00:00:00.000Z"),
    rate: SignedPercentage.create("1.1"),
  });

/**
 * Represents an alias for the default benchmark history
 * identifier.
 */
export const HISTORY_ID = BENCHMARK_HISTORY_ID;

/**
 * Represents an alias for the default benchmark history
 * entity.
 */
export const HISTORY = BENCHMARK_HISTORY;

/**
 * Creates an in-memory repository that implements
 * {@link IBenchmarkHistory}.
 *
 * The repository stores {@link BenchmarkHistory} entities
 * in memory and supports find, save, and delete operations.
 *
 * @returns A new in-memory `IBenchmarkHistory` repository
 *          instance.
 */
export function createInMemoryBenchmarkHistoryRepository(): IBenchmarkHistory {
  const BASE = createInMemoryRepository<
    Awaited<ReturnType<IBenchmarkHistory["save"]>>
  >({ extractId: (bh) => bh.id });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByBenchmarkId(benchmarkId) {
      return BASE.match(
        (bh) => bh.benchmarkId === benchmarkId,
      );
    },
    async findByBenchmarkIdAndDate(benchmarkId, date) {
      return BASE.findOne(
        (bh) =>
          bh.benchmarkId === benchmarkId &&
          bh.date.getTime() === date.getTime(),
      );
    },
    save: (benchmarkHistory) =>
      BASE.save(benchmarkHistory),
    delete: (id) => BASE.delete(id),
  };
}
