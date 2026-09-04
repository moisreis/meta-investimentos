import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError, ValidationError } from "@/shared/errors";

import { requireManager } from "../shared/require-manager";
import type { CategoryDto } from "./fund.dtos";
import { toCategoryDto } from "./fund.dtos";

/**
 * Input for {@link updateCategory}.
 */
export interface UpdateCategoryInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the category to update.
   */
  categoryId: string;

  /**
   * The new name of the category.
   */
  name?: string;
}

/**
 * Updates a fund category.
 *
 * Reference and administration mutations are restricted to managers.
 * The update runs inside one `UnitOfWork` transaction so the change and
 * its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The update input.
 * @returns The updated {@link CategoryDto}.
 *
 * @throws {NotFoundError} When the actor is not a manager or the
 *   category does not exist.
 * @throws {ValidationError} When the new name collides with an existing
 *   category.
 */
export async function updateCategory(
  unitOfWork: UnitOfWork,
  input: UpdateCategoryInput,
): Promise<CategoryDto> {
  return unitOfWork.run(
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

      if (input.name !== undefined && input.name !== existing.name) {
        const collision = await tx.categories.findByName(input.name);

        if (collision !== null) {
          throw new ValidationError(
            `Category with name ${input.name} already exists.`,
          );
        }
      }

      const updated =
        input.name !== undefined ? existing.rename(input.name) : existing;

      const saved = await tx.categories.save(updated);

      return toCategoryDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
