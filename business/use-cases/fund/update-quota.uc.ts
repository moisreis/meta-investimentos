import { EntityId } from "@/business/value-objects/entity-id.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import { requireManager } from "../shared/require-manager";
import type { QuotaDto } from "./fund.dtos";
import { toQuotaDto } from "./fund.dtos";

/**
 * Input for {@link updateQuota}.
 */
export interface UpdateQuotaInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the quota to update.
   */
  quotaId: string;

  /**
   * The new unit price of the quota, as a decimal string.
   */
  price?: string;
}

/**
 * Updates the price of a quota.
 *
 * Reference and administration mutations are restricted to managers.
 * The update runs inside one `UnitOfWork` transaction so the change and
 * its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The update input.
 * @returns The updated {@link QuotaDto}.
 *
 * @throws {NotFoundError} When the actor is not a manager or the quota
 *   does not exist.
 */
export async function updateQuota(
  unitOfWork: UnitOfWork,
  input: UpdateQuotaInput,
): Promise<QuotaDto> {
  return unitOfWork.run(
    async (tx) => {
      await requireManager(tx, input.actorId);

      const existing = await tx.quotas.findById(EntityId.create(input.quotaId));

      if (existing === null) {
        throw new NotFoundError(
          `Quota with id ${input.quotaId} was not found.`,
        );
      }

      const updated =
        input.price !== undefined
          ? existing.updatePrice(QuotaPrice.create(input.price))
          : existing;

      const saved = await tx.quotas.save(updated);

      return toQuotaDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
