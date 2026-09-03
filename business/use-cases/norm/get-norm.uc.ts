import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { NormDto } from "./norm.dtos";
import { toNormDto } from "./norm.dtos";

/**
 * Input for {@link getNorm}.
 */
export interface GetNormInput {
  /**
   * The id of the norm to retrieve.
   */
  normId: string;
}

/**
 * Retrieves a single norm by id.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The norm id.
 * @returns The {@link NormDto}.
 *
 * @throws {NotFoundError} When the norm does not exist.
 */
export async function getNorm(
  ctx: Pick<UnitOfWorkContext, "norms">,
  input: GetNormInput,
): Promise<NormDto> {
  const norm = await ctx.norms.findById(EntityId.create(input.normId));

  if (norm === null) {
    throw new NotFoundError(`Norm with id ${input.normId} was not found.`);
  }

  return toNormDto(norm);
}
