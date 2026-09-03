import { Quota } from "@/business/entities/fund/quota.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError, ValidationError } from "@/shared/errors";

import type { QuotaDto } from "./fund.dtos";
import { toQuotaDto } from "./fund.dtos";

/**
 * Input for {@link createQuota}.
 */
export interface CreateQuotaInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the fund the quota belongs to.
   */
  fundId: string;

  /**
   * The date the quota refers to.
   */
  date: Date;

  /**
   * The unit price of the quota, as a decimal string.
   */
  price: string;
}

/**
 * Creates a quota for a fund on a given date.
 *
 * The quota is created inside one `UnitOfWork` transaction so the
 * insertion and its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The quote properties.
 * @returns The created {@link QuotaDto}.
 *
 * @throws {ValidationError} When a quota already exists for the fund on
 *   that date.
 * @throws {NotFoundError} When the referenced fund does not exist.
 */
export async function createQuota(
  unitOfWork: UnitOfWork,
  input: CreateQuotaInput,
): Promise<QuotaDto> {
  return unitOfWork.run(
    async (tx) => {
      const fundId = EntityId.create(input.fundId);

      const fund = await tx.funds.findById(fundId);

      if (fund === null) {
        throw new NotFoundError(`Fund with id ${input.fundId} was not found.`);
      }

      const existing = await tx.quotas.findByFundIdAndDate(fundId, input.date);

      if (existing !== null) {
        throw new ValidationError(
          `Quota for fund ${input.fundId} on ${input.date.toISOString()} already exists.`,
        );
      }

      const quota = Quota.create({
        fundId,
        date: input.date,
        price: QuotaPrice.create(input.price),
      });

      const saved = await tx.quotas.save(quota);

      return toQuotaDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
