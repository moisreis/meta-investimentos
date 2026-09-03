import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { BankDto } from "./bank.dtos";
import { toBankDto } from "./bank.dtos";

/**
 * Input for {@link getBank}.
 */
export interface GetBankInput {
  /**
   * The id of the bank to retrieve.
   */
  bankId: string;
}

/**
 * Retrieves a single bank by id.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The bank id.
 * @returns The {@link BankDto}.
 *
 * @throws {NotFoundError} When the bank does not exist.
 */
export async function getBank(
  ctx: Pick<UnitOfWorkContext, "banks">,
  input: GetBankInput,
): Promise<BankDto> {
  const bank = await ctx.banks.findById(EntityId.create(input.bankId));

  if (bank === null) {
    throw new NotFoundError(`Bank with id ${input.bankId} was not found.`);
  }

  return toBankDto(bank);
}
