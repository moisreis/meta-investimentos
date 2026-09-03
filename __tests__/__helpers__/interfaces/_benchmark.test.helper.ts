import { ID } from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import { Benchmark } from "@/business/entities/benchmark/benchmark.entity";
import type { IBenchmark } from "@/business/interfaces/benchmark/benchmark.interface";

/**
 * Represents the default benchmark identifier for tests.
 */
export const BENCHMARK_ID = ID.BENCHMARK.DEFAULT;

/**
 * Represents the secondary benchmark identifier for tests.
 */
export const OTHER_BENCHMARK_ID = ID.BENCHMARK.OTHER;

/**
 * Represents a default benchmark entity with Ibovespa
 * acronym and name.
 */
export const BENCHMARK = Benchmark.create(
  { acronym: "IBOV", name: "Ibovespa" },
  ID.BENCHMARK.DEFAULT,
);

/**
 * Represents a secondary benchmark entity with CDI acronym
 * and name.
 */
export const OTHER_BENCHMARK = Benchmark.create(
  { acronym: "CDI", name: "CDI" },
  ID.BENCHMARK.OTHER,
);

/**
 * Represents a benchmark entity without a predefined
 * identifier. Use this fixture to test insert operations.
 */
export const FRESH_BENCHMARK = Benchmark.create({
  acronym: "IPCA",
  name: "IPCA+",
});

/**
 * Represents a benchmark entity with a modified display
 * name. Reuses the default benchmark identifier.
 */
export const UPDATED_BENCHMARK = Benchmark.create(
  { acronym: BENCHMARK.acronym, name: "Ibovespa B3" },
  ID.BENCHMARK.DEFAULT,
);

/**
 * Creates an in-memory repository that implements
 * {@link IBenchmark}.
 *
 * The repository stores {@link Benchmark} entities in
 * memory and supports find, save, and delete operations.
 *
 * @returns A new in-memory `IBenchmark` repository instance.
 */
export function createInMemoryBenchmarkRepository(): IBenchmark {
  const BASE = createInMemoryRepository<
    Awaited<ReturnType<IBenchmark["save"]>>
  >({ extractId: (b) => b.id });

  return {
    findById: (id) => BASE.findById(id),
    async findByAcronym(acronym) {
      return BASE.findOne((b) => b.acronym === acronym);
    },
    save: (benchmark) => BASE.save(benchmark),
    delete: (id) => BASE.delete(id),
  };
}
