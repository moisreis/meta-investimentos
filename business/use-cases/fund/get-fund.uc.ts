import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { FundDto } from "./fund.dtos";
import { toFundDto } from "./fund.dtos";

/**
 * Input for {@link getFund}.
 */
export interface GetFundInput {
  /**
   * The id of the fund to retrieve.
   */
  fundId: string;
}

/**
 * Retrieves a single fund by id.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The fund id.
 * @returns The {@link FundDto}.
 *
 * @throws {NotFoundError} When the fund does not exist.
 */
export async function getFund(
  ctx: Pick<UnitOfWorkContext, "funds">,
  input: GetFundInput,
): Promise<FundDto> {
  const fund = await ctx.funds.findById(EntityId.create(input.fundId));

  if (fund === null) {
    throw new NotFoundError(`Fund with id ${input.fundId} was not found.`);
  }

  return toFundDto(fund);
}
