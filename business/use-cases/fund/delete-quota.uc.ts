import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";
import { recalculatePerformanceForFunds } from "../performance/recalculate-performance-triggers";
import { requireManager } from "../shared/require-manager";

/**
 * Input for {@link deleteQuota}.
 */
export interface DeleteQuotaInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the quota to delete.
   */
  quotaId: string;
}

/**
 * Deletes a quota.
 *
 * Reference and administration mutations are restricted to managers.
 * The deletion runs inside one `UnitOfWork` transaction so the removal
 * and its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The delete input.
 *
 * @throws {NotFoundError} When the actor is not a manager or the quota
 *   does not exist.
 */
export async function deleteQuota(
  unitOfWork: UnitOfWork,
  input: DeleteQuotaInput,
): Promise<void> {
  const { fundId, date } = await unitOfWork.run(
    async (tx) => {
      await requireManager(tx, input.actorId);

      const existing = await tx.quotas.findById(EntityId.create(input.quotaId));

      if (existing === null) {
        throw new NotFoundError(
          `Quota with id ${input.quotaId} was not found.`,
        );
      }

      await tx.quotas.delete(EntityId.create(input.quotaId));

      return {
        fundId: existing.fundId as string,
        date: existing.date,
      };
    },
    { userId: EntityId.create(input.actorId) },
  );

  await recalculatePerformanceForFunds(unitOfWork, {
    fundIds: [fundId],
    startDate: date,
    endDate: new Date(),
    actorId: input.actorId,
  });
}
