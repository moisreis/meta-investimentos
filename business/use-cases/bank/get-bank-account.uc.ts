import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { BankAccountDto } from "./bank.dtos";
import { toBankAccountDto } from "./bank.dtos";

/**
 * Input for {@link getBankAccount}.
 */
export interface GetBankAccountInput {
  /**
   * The id of the bank account to retrieve.
   */
  bankAccountId: string;
}

/**
 * Retrieves a single bank account by id.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The bank account id.
 * @returns The {@link BankAccountDto}.
 *
 * @throws {NotFoundError} When the bank account does not exist.
 */
export async function getBankAccount(
  ctx: Pick<UnitOfWorkContext, "bankAccounts">,
  input: GetBankAccountInput,
): Promise<BankAccountDto> {
  const account = await ctx.bankAccounts.findById(
    EntityId.create(input.bankAccountId),
  );

  if (account === null) {
    throw new NotFoundError(
      `Bank account with id ${input.bankAccountId} was not found.`,
    );
  }

  return toBankAccountDto(account);
}
