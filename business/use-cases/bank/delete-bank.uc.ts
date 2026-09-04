import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import { requireManager } from "../shared/require-manager";

/**
 * Input for {@link deleteBank}.
 */
export interface DeleteBankInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the bank to delete.
   */
  bankId: string;
}

/**
 * Deletes a bank.
 *
 * Reference and administration mutations are restricted to managers.
 * The deletion runs inside one `UnitOfWork` transaction so the removal
 * and its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The delete input.
 *
 * @throws {NotFoundError} When the actor is not a manager or the bank
 *   does not exist.
 */
export async function deleteBank(
  unitOfWork: UnitOfWork,
  input: DeleteBankInput,
): Promise<void> {
  await unitOfWork.run(
    async (tx) => {
      await requireManager(tx, input.actorId);

      const existing = await tx.banks.findById(EntityId.create(input.bankId));

      if (existing === null) {
        throw new NotFoundError(`Bank with id ${input.bankId} was not found.`);
      }

      await tx.banks.delete(EntityId.create(input.bankId));
    },
    { userId: EntityId.create(input.actorId) },
  );
}
