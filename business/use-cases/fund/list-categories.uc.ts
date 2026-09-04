import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

import type { CategoryDto } from "./fund.dtos";
import { toCategoryDto } from "./fund.dtos";

/**
 * Input for {@link listCategories}.
 */
export interface ListCategoriesInput {
  /**
   * The maximum number of categories to return.
   */
  limit?: number;

  /**
   * The offset from which to start returning categories.
   */
  offset?: number;
}

/**
 * Retrieves a collection of fund categories.
 *
 * Reference data is readable by any authenticated actor.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The pagination options.
 * @returns The collection of {@link CategoryDto}.
 */
export async function listCategories(
  ctx: Pick<UnitOfWorkContext, "categories">,
  input: ListCategoriesInput = {},
): Promise<CategoryDto[]> {
  const categories = await ctx.categories.findAll({
    limit: input.limit,
    offset: input.offset,
  });

  return categories.map((category) => toCategoryDto(category));
}
