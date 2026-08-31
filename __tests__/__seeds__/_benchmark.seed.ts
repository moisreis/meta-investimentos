import { db } from "@/__tests__/__setup__/_database.setup";
import { Benchmark } from "@/business/entities";
import { benchmark } from "@/infrastructure/database/schemas";
import { BenchmarkRepository } from "@/infrastructure/repositories";

export const BENCHMARK_ID = "4e5f6a7b-8c9d-4e0f-8a1b-2c3d4e5f6a7b";
export const OTHER_BENCHMARK_ID = "5f6a7b8c-9d0e-4f1a-9b2c-3d4e5f6a7b8c";

export const BENCHMARK = Benchmark.create(
  { acronym: "IBOV", name: "Ibovespa" },
  BENCHMARK_ID,
);

export const OTHER_BENCHMARK = Benchmark.create(
  { acronym: "CDI", name: "CDI" },
  OTHER_BENCHMARK_ID,
);

export const FRESH_BENCHMARK = Benchmark.create({
  acronym: "IPCA",
  name: "IPCA+",
});

export const UPDATED_BENCHMARK = Benchmark.create(
  { acronym: BENCHMARK.acronym, name: "Ibovespa B3" },
  BENCHMARK_ID,
);

export async function seedBenchmarkById(id: string): Promise<Benchmark> {
  const REPOSITORY = new BenchmarkRepository(db);
  const EXISTING = await REPOSITORY.findById(id);
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

export async function seedBenchmarks(): Promise<Benchmark[]> {
  return [
    await seedBenchmarkById(BENCHMARK_ID),
    await seedBenchmarkById(OTHER_BENCHMARK_ID),
  ];
}
