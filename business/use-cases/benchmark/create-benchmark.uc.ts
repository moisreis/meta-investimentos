import { Benchmark } from "@/business/entities/benchmark/benchmark.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { ValidationError } from "@/shared/errors";

import type { BenchmarkDto } from "./benchmark.dtos";
import { toBenchmarkDto } from "./benchmark.dtos";

/**
 * Input for {@link createBenchmark}.
 */
export interface CreateBenchmarkInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The acronym of the benchmark.
   */
  acronym: string;

  /**
   * The name of the benchmark.
   */
  name: string;
}

/**
 * Creates a benchmark.
 *
 * The benchmark is created inside one `UnitOfWork` transaction so the
 * insertion and its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The benchmark properties.
 * @returns The created {@link BenchmarkDto}.
 *
 * @throws {ValidationError} When a benchmark with the same acronym
 *   already exists.
 */
export async function createBenchmark(
  unitOfWork: UnitOfWork,
  input: CreateBenchmarkInput,
): Promise<BenchmarkDto> {
  return unitOfWork.run(
    async (tx) => {
      const existing = await tx.benchmarks.findByAcronym(input.acronym);

      if (existing !== null) {
        throw new ValidationError(
          `Benchmark with acronym ${input.acronym} already exists.`,
        );
      }

      const benchmark = Benchmark.create({
        acronym: input.acronym,
        name: input.name,
      });

      const saved = await tx.benchmarks.save(benchmark);

      return toBenchmarkDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
