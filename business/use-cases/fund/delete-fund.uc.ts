import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import { requireManager } from "../shared/require-manager";

/**
 * Input for {@link deleteFund}.
 */
export interface DeleteFundInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the fund to delete.
   */
  fundId: string;
}

/**
 * Deletes a fund.
 *
 * Reference and administration mutations are restricted to managers.
 * The deletion runs inside one `UnitOfWork` transaction so the removal
 * and its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The delete input.
 *
 * @throws {NotFoundError} When the actor is not a manager or the fund
 *   does not exist.
 */
export async function deleteFund(
  unitOfWork: UnitOfWork,
  input: DeleteFundInput,
): Promise<void> {
  await unitOfWork.run(
    async (tx) => {
      await requireManager(tx, input.actorId);

      const existing = await tx.funds.findById(EntityId.create(input.fundId));

      if (existing === null) {
        throw new NotFoundError(`Fund with id ${input.fundId} was not found.`);
      }

      await tx.funds.delete(EntityId.create(input.fundId));
    },
    { userId: EntityId.create(input.actorId) },
  );
}
