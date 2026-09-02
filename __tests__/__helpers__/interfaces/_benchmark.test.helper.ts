import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { IBenchmark } from "@/business/interfaces/benchmark/benchmark.interface";

export {
  BENCHMARK,
  BENCHMARK_ID,
  FRESH_BENCHMARK,
  OTHER_BENCHMARK,
  OTHER_BENCHMARK_ID,
  UPDATED_BENCHMARK,
} from "@/__tests__/__fixtures__";

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
