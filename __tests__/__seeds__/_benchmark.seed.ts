import {
  BENCHMARK,
  BENCHMARK_ID,
  FRESH_BENCHMARK,
  OTHER_BENCHMARK,
  OTHER_BENCHMARK_ID,
  UPDATED_BENCHMARK,
} from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { Benchmark } from "@/business/entities";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { benchmark } from "@/infrastructure/database/schemas";
import { BenchmarkRepository } from "@/infrastructure/repositories";

export {
  BENCHMARK_ID,
  OTHER_BENCHMARK_ID,
  BENCHMARK,
  OTHER_BENCHMARK,
  FRESH_BENCHMARK,
  UPDATED_BENCHMARK,
};

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

export async function seedBenchmarks(): Promise<Benchmark[]> {
  return [
    await seedBenchmarkById(BENCHMARK_ID),
    await seedBenchmarkById(OTHER_BENCHMARK_ID),
  ];
}
