import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import { requireManager } from "../shared/require-manager";

/**
 * Input for {@link deleteCategory}.
 */
export interface DeleteCategoryInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the category to delete.
   */
  categoryId: string;
}

/**
 * Deletes a fund category.
 *
 * Reference and administration mutations are restricted to managers.
 * The deletion runs inside one `UnitOfWork` transaction so the removal
 * and its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The delete input.
 *
 * @throws {NotFoundError} When the actor is not a manager or the
 *   category does not exist.
 */
export async function deleteCategory(
  unitOfWork: UnitOfWork,
  input: DeleteCategoryInput,
): Promise<void> {
  await unitOfWork.run(
    async (tx) => {
      await requireManager(tx, input.actorId);

      const existing = await tx.categories.findById(
        EntityId.create(input.categoryId),
      );

      if (existing === null) {
        throw new NotFoundError(
          `Category with id ${input.categoryId} was not found.`,
        );
      }

      await tx.categories.delete(EntityId.create(input.categoryId));
    },
    { userId: EntityId.create(input.actorId) },
  );
}
