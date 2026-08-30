import { Benchmark } from "@/business/entities/benchmark/benchmark.entity";
import type { IBenchmark } from "@/business/interfaces/benchmark/benchmark.interface";

export const BENCHMARK_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

export const BENCHMARK = Benchmark.create(
  { acronym: "IBOV", name: "Ibovespa" },
  BENCHMARK_ID,
);

export function createInMemoryBenchmarkRepository(): IBenchmark {
  const ROWS = new Map<string, Benchmark>();

  return {
    async findById(id: string): Promise<Benchmark | null> {
      return ROWS.get(id) ?? null;
    },

    async findByAcronym(acronym: string): Promise<Benchmark | null> {
      for (const ROW of ROWS.values()) {
        if (ROW.acronym === acronym) return ROW;
      }

      return null;
    },

    async save(benchmark: Benchmark): Promise<Benchmark> {
      ROWS.set(benchmark.id ?? "generated-id", benchmark);

      return benchmark;
    },

    async delete(id: string): Promise<void> {
      ROWS.delete(id);
    },
  };
}
