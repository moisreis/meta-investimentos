import { Category } from "@/business/entities/fund/category.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { ValidationError } from "@/shared/errors";

import type { CategoryDto } from "./fund.dtos";
import { toCategoryDto } from "./fund.dtos";

/**
 * Input for {@link createCategory}.
 */
export interface CreateCategoryInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The name of the category.
   */
  name: string;
}

/**
 * Creates a fund category.
 *
 * The category is created inside one `UnitOfWork` transaction so the
 * insertion and its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The category properties.
 * @returns The created {@link CategoryDto}.
 *
 * @throws {ValidationError} When a category with the same name already
 *   exists.
 */
export async function createCategory(
  unitOfWork: UnitOfWork,
  input: CreateCategoryInput,
): Promise<CategoryDto> {
  return unitOfWork.run(
    async (tx) => {
      const existing = await tx.categories.findByName(input.name);

      if (existing !== null) {
        throw new ValidationError(
          `Category with name ${input.name} already exists.`,
        );
      }

      const category = Category.create({ name: input.name });

      const saved = await tx.categories.save(category);

      return toCategoryDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
