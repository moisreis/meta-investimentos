import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

/**
 * Input for {@link deleteUser}.
 */
export interface DeleteUserInput {
  /**
   * The id of the acting user required to authorize the deletion.
   */
  actorId: string;

  /**
   * The id of the user to delete.
   */
  userId: string;
}

/**
 * Deletes a user.
 *
 * A user may only delete their own account. The deletion is performed
 * inside one `UnitOfWork` transaction so the removal and its audit log
 * commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The actor and the user id to delete.
 *
 * @throws {NotFoundError} When the target user does not exist or the
 *   actor is not authorized to delete it.
 */
export async function deleteUser(
  unitOfWork: UnitOfWork,
  input: DeleteUserInput,
): Promise<void> {
  if (input.actorId !== input.userId) {
    throw new NotFoundError(`User with id ${input.userId} was not found.`);
  }

  await unitOfWork.run(
    async (tx) => {
      const existing = await tx.users.findById(EntityId.create(input.userId));

      if (existing === null) {
        throw new NotFoundError(`User with id ${input.userId} was not found.`);
      }

      await tx.users.delete(EntityId.create(input.userId));
    },
    { userId: EntityId.create(input.actorId) },
  );
}
