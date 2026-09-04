import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError, ValidationError } from "@/shared/errors";

import { requireManager } from "../shared/require-manager";
import type { BankDto } from "./bank.dtos";
import { toBankDto } from "./bank.dtos";

/**
 * Input for {@link updateBank}.
 */
export interface UpdateBankInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the bank to update.
   */
  bankId: string;

  /**
   * The new code of the bank.
   */
  code?: string;

  /**
   * The new name of the bank.
   */
  name?: string;
}

/**
 * Updates a bank.
 *
 * Reference and administration mutations are restricted to managers.
 * The update runs inside one `UnitOfWork` transaction so the change and
 * its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The update input.
 * @returns The updated {@link BankDto}.
 *
 * @throws {NotFoundError} When the actor is not a manager or the bank
 *   does not exist.
 * @throws {ValidationError} When the new code collides with an existing
 *   bank.
 */
export async function updateBank(
  unitOfWork: UnitOfWork,
  input: UpdateBankInput,
): Promise<BankDto> {
  return unitOfWork.run(
    async (tx) => {
      await requireManager(tx, input.actorId);

      const existing = await tx.banks.findById(EntityId.create(input.bankId));

      if (existing === null) {
        throw new NotFoundError(`Bank with id ${input.bankId} was not found.`);
      }

      if (input.code !== undefined && input.code !== existing.code) {
        const collision = await tx.banks.findByCode(input.code);

        if (collision !== null) {
          throw new ValidationError(
            `Bank with code ${input.code} already exists.`,
          );
        }
      }

      let updated = existing;

      if (input.code !== undefined) {
        updated = updated.changeCode(input.code);
      }
      if (input.name !== undefined) {
        updated = updated.rename(input.name);
      }

      const saved = await tx.banks.save(updated);

      return toBankDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
