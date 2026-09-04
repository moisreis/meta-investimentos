import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError, ValidationError } from "@/shared/errors";

import { requireManager } from "../shared/require-manager";
import type { BenchmarkDto } from "./benchmark.dtos";
import { toBenchmarkDto } from "./benchmark.dtos";

/**
 * Input for {@link updateBenchmark}.
 */
export interface UpdateBenchmarkInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the benchmark to update.
   */
  benchmarkId: string;

  /**
   * The new acronym of the benchmark.
   */
  acronym?: string;

  /**
   * The new name of the benchmark.
   */
  name?: string;
}

/**
 * Updates a benchmark.
 *
 * Reference and administration mutations are restricted to managers.
 * The update runs inside one `UnitOfWork` transaction so the change and
 * its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The update input.
 * @returns The updated {@link BenchmarkDto}.
 *
 * @throws {NotFoundError} When the actor is not a manager or the
 *   benchmark does not exist.
 * @throws {ValidationError} When the new acronym collides with an
 *   existing benchmark.
 */
export async function updateBenchmark(
  unitOfWork: UnitOfWork,
  input: UpdateBenchmarkInput,
): Promise<BenchmarkDto> {
  return unitOfWork.run(
    async (tx) => {
      await requireManager(tx, input.actorId);

      const existing = await tx.benchmarks.findById(
        EntityId.create(input.benchmarkId),
      );

      if (existing === null) {
        throw new NotFoundError(
          `Benchmark with id ${input.benchmarkId} was not found.`,
        );
      }

      if (input.acronym !== undefined && input.acronym !== existing.acronym) {
        const collision = await tx.benchmarks.findByAcronym(input.acronym);

        if (collision !== null) {
          throw new ValidationError(
            `Benchmark with acronym ${input.acronym} already exists.`,
          );
        }
      }

      let updated = existing;

      if (input.acronym !== undefined) {
        updated = updated.changeAcronym(input.acronym);
      }
      if (input.name !== undefined) {
        updated = updated.rename(input.name);
      }

      const saved = await tx.benchmarks.save(updated);

      return toBenchmarkDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
