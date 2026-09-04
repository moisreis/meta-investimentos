import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import { requireManager } from "../shared/require-manager";

/**
 * Input for {@link deleteBenchmark}.
 */
export interface DeleteBenchmarkInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the benchmark to delete.
   */
  benchmarkId: string;
}

/**
 * Deletes a benchmark.
 *
 * Reference and administration mutations are restricted to managers.
 * The deletion runs inside one `UnitOfWork` transaction so the removal
 * and its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The delete input.
 *
 * @throws {NotFoundError} When the actor is not a manager or the
 *   benchmark does not exist.
 */
export async function deleteBenchmark(
  unitOfWork: UnitOfWork,
  input: DeleteBenchmarkInput,
): Promise<void> {
  await unitOfWork.run(
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

      await tx.benchmarks.delete(EntityId.create(input.benchmarkId));
    },
    { userId: EntityId.create(input.actorId) },
  );
}
