import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

import type { BankDto } from "./bank.dtos";
import { toBankDto } from "./bank.dtos";

/**
 * Input for {@link listBanks}.
 */
export interface ListBanksInput {
  /**
   * The maximum number of banks to return.
   */
  limit?: number;

  /**
   * The offset from which to start returning banks.
   */
  offset?: number;
}

/**
 * Retrieves a collection of banks.
 *
 * Reference data is readable by any authenticated actor.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The pagination options.
 * @returns The collection of {@link BankDto}.
 */
export async function listBanks(
  ctx: Pick<UnitOfWorkContext, "banks">,
  input: ListBanksInput = {},
): Promise<BankDto[]> {
  const banks = await ctx.banks.findAll({
    limit: input.limit,
    offset: input.offset,
  });

  return banks.map((bank) => toBankDto(bank));
}
