import { ID } from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import { Benchmark } from "@/business/entities/benchmark/benchmark.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { benchmark } from "@/infrastructure/database/schemas";
import { BenchmarkRepository } from "@/infrastructure/repositories";

/**
 * Represents the default benchmark ID used in tests.
 */
export const BENCHMARK_ID = ID.BENCHMARK.DEFAULT;

/**
 * Represents an alternative benchmark ID used in tests.
 */
export const OTHER_BENCHMARK_ID = ID.BENCHMARK.OTHER;

/**
 * Represents the default benchmark fixture used in tests.
 *
 * The fixture represents the Ibovespa benchmark with
 * acronym `IBOV`.
 */
export const BENCHMARK = Benchmark.create(
  { acronym: "IBOV", name: "Ibovespa" },
  ID.BENCHMARK.DEFAULT,
);

/**
 * Represents an alternative benchmark fixture for tests.
 *
 * The fixture represents the CDI benchmark with
 * acronym `CDI`.
 */
export const OTHER_BENCHMARK = Benchmark.create(
  { acronym: "CDI", name: "CDI" },
  ID.BENCHMARK.OTHER,
);

/**
 * Represents a benchmark fixture without a predefined ID.
 *
 * The fixture represents the IPCA+ benchmark with
 * acronym `IPCA`.
 */
export const FRESH_BENCHMARK = Benchmark.create({
  acronym: "IPCA",
  name: "IPCA+",
});

/**
 * Represents an updated version of the default benchmark fixture.
 *
 * The fixture reuses the default benchmark ID but updates
 * the name to `Ibovespa B3`.
 */
export const UPDATED_BENCHMARK = Benchmark.create(
  { acronym: BENCHMARK.acronym, name: "Ibovespa B3" },
  ID.BENCHMARK.DEFAULT,
);

/**
 * Seeds a benchmark into the test database by ID.
 *
 * The function checks if the benchmark already exists. If
 * it does, the existing record is returned. Otherwise, the
 * appropriate fixture is inserted.
 *
 * @param id - The benchmark ID to seed.
 * @returns A promise that resolves to the seeded
 *          `Benchmark` fixture.
 */
export async function seedBenchmarkById(id: string): Promise<Benchmark> {
  const REPOSITORY = new BenchmarkRepository(db);
  const EXISTING = await REPOSITORY.findById(EntityId.create(id));
  if (EXISTING) return EXISTING;

  const FIXTURE = id === BENCHMARK_ID ? BENCHMARK : OTHER_BENCHMARK;

  await db.insert(benchmark).values({
    id: FIXTURE.id,
    acronym: FIXTURE.acronym,
    name: FIXTURE.name,
    createdAt: FIXTURE.createdAt,
  });

  return FIXTURE;
}

/**
 * Seeds the default benchmarks into the test database.
 *
 * The function calls `seedBenchmarkById` for each default
 * benchmark ID.
 *
 * @returns A promise that resolves to an array containing
 *          the seeded `Benchmark` fixtures.
 */
export async function seedBenchmarks(): Promise<Benchmark[]> {
  return [
    await seedBenchmarkById(BENCHMARK_ID),
    await seedBenchmarkById(OTHER_BENCHMARK_ID),
  ];
}
