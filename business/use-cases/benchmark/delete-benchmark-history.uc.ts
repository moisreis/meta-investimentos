import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";
import { recalculatePerformanceForAllPortfolios } from "../performance/recalculate-performance-triggers";
import { requireManager } from "../shared/require-manager";

/**
 * Input for {@link deleteBenchmarkHistory}.
 */
export interface DeleteBenchmarkHistoryInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the benchmark history entry to delete.
   */
  benchmarkHistoryId: string;
}

/**
 * Deletes a benchmark history entry.
 *
 * Reference and administration mutations are restricted to managers.
 * The deletion runs inside one `UnitOfWork` transaction so the removal
 * and its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The delete input.
 *
 * @throws {NotFoundError} When the actor is not a manager or the
 *   benchmark history entry does not exist.
 */
export async function deleteBenchmarkHistory(
  unitOfWork: UnitOfWork,
  input: DeleteBenchmarkHistoryInput,
): Promise<void> {
  const date = await unitOfWork.run(
    async (tx) => {
      await requireManager(tx, input.actorId);

      const existing = await tx.benchmarkHistories.findById(
        EntityId.create(input.benchmarkHistoryId),
      );

      if (existing === null) {
        throw new NotFoundError(
          `BenchmarkHistory with id ${input.benchmarkHistoryId} was not found.`,
        );
      }

      await tx.benchmarkHistories.delete(
        EntityId.create(input.benchmarkHistoryId),
      );

      return existing.date;
    },
    { userId: EntityId.create(input.actorId) },
  );

  await recalculatePerformanceForAllPortfolios(unitOfWork, {
    startDate: date,
    endDate: new Date(),
    actorId: input.actorId,
  });
}
