import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { CheckingAccountDto } from "./bank.dtos";
import { toCheckingAccountDto } from "./bank.dtos";

/**
 * Input for {@link getCheckingAccount}.
 */
export interface GetCheckingAccountInput {
  /**
   * The id of the checking account transaction to retrieve.
   */
  checkingAccountId: string;
}

/**
 * Retrieves a single checking account transaction by id.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The checking account id.
 * @returns The {@link CheckingAccountDto}.
 *
 * @throws {NotFoundError} When the checking account does not exist.
 */
export async function getCheckingAccount(
  ctx: Pick<UnitOfWorkContext, "checkingAccounts">,
  input: GetCheckingAccountInput,
): Promise<CheckingAccountDto> {
  const checkingAccount = await ctx.checkingAccounts.findById(
    EntityId.create(input.checkingAccountId),
  );

  if (checkingAccount === null) {
    throw new NotFoundError(
      `Checking account with id ${input.checkingAccountId} was not found.`,
    );
  }

  return toCheckingAccountDto(checkingAccount);
}
