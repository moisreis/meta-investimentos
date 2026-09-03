import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { CategoryDto } from "./fund.dtos";
import { toCategoryDto } from "./fund.dtos";

/**
 * Input for {@link getCategory}.
 */
export interface GetCategoryInput {
  /**
   * The id of the category to retrieve.
   */
  categoryId: string;
}

/**
 * Retrieves a single category by id.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The category id.
 * @returns The {@link CategoryDto}.
 *
 * @throws {NotFoundError} When the category does not exist.
 */
export async function getCategory(
  ctx: Pick<UnitOfWorkContext, "categories">,
  input: GetCategoryInput,
): Promise<CategoryDto> {
  const category = await ctx.categories.findById(
    EntityId.create(input.categoryId),
  );

  if (category === null) {
    throw new NotFoundError(
      `Category with id ${input.categoryId} was not found.`,
    );
  }

  return toCategoryDto(category);
}
