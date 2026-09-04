import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import { requireManager } from "../shared/require-manager";
import type { BenchmarkHistoryDto } from "./benchmark.dtos";
import { toBenchmarkHistoryDto } from "./benchmark.dtos";

/**
 * Input for {@link updateBenchmarkHistory}.
 */
export interface UpdateBenchmarkHistoryInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the benchmark history entry to update.
   */
  benchmarkHistoryId: string;

  /**
   * The new rate of the benchmark history entry, as a decimal string.
   */
  rate?: string;
}

/**
 * Updates the rate of a benchmark history entry.
 *
 * Reference and administration mutations are restricted to managers.
 * The update runs inside one `UnitOfWork` transaction so the change and
 * its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The update input.
 * @returns The updated {@link BenchmarkHistoryDto}.
 *
 * @throws {NotFoundError} When the actor is not a manager or the
 *   benchmark history entry does not exist.
 */
export async function updateBenchmarkHistory(
  unitOfWork: UnitOfWork,
  input: UpdateBenchmarkHistoryInput,
): Promise<BenchmarkHistoryDto> {
  return unitOfWork.run(
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

      const updated =
        input.rate !== undefined
          ? existing.updateRate(SignedPercentage.create(input.rate))
          : existing;

      const saved = await tx.benchmarkHistories.save(updated);

      return toBenchmarkHistoryDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
