import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

import type { FundDto } from "./fund.dtos";
import { toFundDto } from "./fund.dtos";

/**
 * Input for {@link listFunds}.
 */
export interface ListFundsInput {
  /**
   * The maximum number of funds to return.
   */
  limit?: number;

  /**
   * The offset from which to start returning funds.
   */
  offset?: number;
}

/**
 * Retrieves a collection of funds.
 *
 * Reference data is readable by any authenticated actor.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The pagination options.
 * @returns The collection of {@link FundDto}.
 */
export async function listFunds(
  ctx: Pick<UnitOfWorkContext, "funds">,
  input: ListFundsInput = {},
): Promise<FundDto[]> {
  const funds = await ctx.funds.findAll({
    limit: input.limit,
    offset: input.offset,
  });

  return funds.map((fund) => toFundDto(fund));
}
