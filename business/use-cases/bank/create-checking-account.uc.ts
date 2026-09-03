import { CheckingAccount } from "@/business/entities/bank/checking-account.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { CheckingAccountDto } from "./bank.dtos";
import { toCheckingAccountDto } from "./bank.dtos";

/**
 * Input for {@link createCheckingAccount}.
 */
export interface CreateCheckingAccountInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the bank account the transaction belongs to.
   */
  bankAccountId: string;

  /**
   * The date of the transaction.
   */
  date: Date;

  /**
   * The value of the transaction, as a signed decimal string.
   */
  value: string;
}

/**
 * Creates a checking account transaction.
 *
 * The transaction is created inside one `UnitOfWork` transaction so the
 * insertion and its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The checking account properties.
 * @returns The created {@link CheckingAccountDto}.
 *
 * @throws {NotFoundError} When the referenced bank account does not
 *   exist.
 */
export async function createCheckingAccount(
  unitOfWork: UnitOfWork,
  input: CreateCheckingAccountInput,
): Promise<CheckingAccountDto> {
  return unitOfWork.run(
    async (tx) => {
      const bankAccountId = EntityId.create(input.bankAccountId);

      const bankAccount = await tx.bankAccounts.findById(bankAccountId);

      if (bankAccount === null) {
        throw new NotFoundError(
          `Bank account with id ${input.bankAccountId} was not found.`,
        );
      }

      const checkingAccount = CheckingAccount.create({
        bankAccountId,
        date: input.date,
        value: SignedMoney.create(input.value),
      });

      const saved = await tx.checkingAccounts.save(checkingAccount);

      return toCheckingAccountDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
