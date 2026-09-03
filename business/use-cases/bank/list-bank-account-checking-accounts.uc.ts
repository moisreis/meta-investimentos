import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

import type { CheckingAccountDto } from "./bank.dtos";
import { toCheckingAccountDto } from "./bank.dtos";

/**
 * Input for {@link listBankAccountCheckingAccounts}.
 */
export interface ListBankAccountCheckingAccountsInput {
  /**
   * The id of the bank account to list transactions for.
   */
  bankAccountId: string;
}

/**
 * Lists the checking account transactions of a bank account.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The bank account id.
 * @returns The {@link CheckingAccountDto}s of the bank account.
 */
export async function listBankAccountCheckingAccounts(
  ctx: Pick<UnitOfWorkContext, "checkingAccounts">,
  input: ListBankAccountCheckingAccountsInput,
): Promise<CheckingAccountDto[]> {
  const transactions = await ctx.checkingAccounts.findAllByBankAccountId(
    EntityId.create(input.bankAccountId),
  );

  return transactions.map(toCheckingAccountDto);
}
