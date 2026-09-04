import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import { requireManager } from "../shared/require-manager";

/**
 * Input for {@link deleteNorm}.
 */
export interface DeleteNormInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the norm to delete.
   */
  normId: string;
}

/**
 * Deletes a regulatory norm.
 *
 * Reference and administration mutations are restricted to managers.
 * The deletion runs inside one `UnitOfWork` transaction so the removal
 * and its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The delete input.
 *
 * @throws {NotFoundError} When the actor is not a manager or the norm
 *   does not exist.
 */
export async function deleteNorm(
  unitOfWork: UnitOfWork,
  input: DeleteNormInput,
): Promise<void> {
  await unitOfWork.run(
    async (tx) => {
      await requireManager(tx, input.actorId);

      const existing = await tx.norms.findById(EntityId.create(input.normId));

      if (existing === null) {
        throw new NotFoundError(`Norm with id ${input.normId} was not found.`);
      }

      await tx.norms.delete(EntityId.create(input.normId));
    },
    { userId: EntityId.create(input.actorId) },
  );
}
