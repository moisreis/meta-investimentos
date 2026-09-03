import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

import type { BankAccountDto } from "./bank.dtos";
import { toBankAccountDto } from "./bank.dtos";

/**
 * Input for {@link listPortfolioBankAccounts}.
 */
export interface ListPortfolioBankAccountsInput {
  /**
   * The id of the portfolio to list bank accounts for.
   */
  portfolioId: string;
}

/**
 * Lists the bank accounts of a portfolio.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The portfolio id.
 * @returns The {@link BankAccountDto}s of the portfolio.
 */
export async function listPortfolioBankAccounts(
  ctx: Pick<UnitOfWorkContext, "bankAccounts">,
  input: ListPortfolioBankAccountsInput,
): Promise<BankAccountDto[]> {
  const accounts = await ctx.bankAccounts.findAllByPortfolioId(
    EntityId.create(input.portfolioId),
  );

  return accounts.map(toBankAccountDto);
}
