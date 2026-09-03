import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

import type { NormDto } from "./norm.dtos";
import { toNormDto } from "./norm.dtos";

/**
 * Input for {@link listNormsByCategory}.
 */
export interface ListNormsByCategoryInput {
  /**
   * The id of the category to list norms for.
   */
  categoryId: string;
}

/**
 * Lists the norms of a fund category.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The category id.
 * @returns The {@link NormDto}s of the category.
 */
export async function listNormsByCategory(
  ctx: Pick<UnitOfWorkContext, "norms">,
  input: ListNormsByCategoryInput,
): Promise<NormDto[]> {
  const norms = await ctx.norms.findAllByCategoryId(
    EntityId.create(input.categoryId),
  );

  return norms.map(toNormDto);
}
