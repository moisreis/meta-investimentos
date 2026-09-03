import { Bank } from "@/business/entities/bank/bank.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { ValidationError } from "@/shared/errors";

import type { BankDto } from "./bank.dtos";
import { toBankDto } from "./bank.dtos";

/**
 * Input for {@link createBank}.
 */
export interface CreateBankInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The code of the bank.
   */
  code: string;

  /**
   * The name of the bank.
   */
  name: string;
}

/**
 * Creates a bank.
 *
 * The bank is created inside one `UnitOfWork` transaction so the
 * insertion and its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The bank properties.
 * @returns The created {@link BankDto}.
 *
 * @throws {ValidationError} When a bank with the same code already
 *   exists.
 */
export async function createBank(
  unitOfWork: UnitOfWork,
  input: CreateBankInput,
): Promise<BankDto> {
  return unitOfWork.run(
    async (tx) => {
      const existing = await tx.banks.findByCode(input.code);

      if (existing !== null) {
        throw new ValidationError(
          `Bank with code ${input.code} already exists.`,
        );
      }

      const bank = Bank.create({ code: input.code, name: input.name });

      const saved = await tx.banks.save(bank);

      return toBankDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
