import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { QuotaDto } from "./fund.dtos";
import { toQuotaDto } from "./fund.dtos";

/**
 * Input for {@link getQuota}.
 */
export interface GetQuotaInput {
  /**
   * The id of the quota to retrieve.
   */
  quotaId: string;
}

/**
 * Retrieves a single quota by id.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The quota id.
 * @returns The {@link QuotaDto}.
 *
 * @throws {NotFoundError} When the quota does not exist.
 */
export async function getQuota(
  ctx: Pick<UnitOfWorkContext, "quotas">,
  input: GetQuotaInput,
): Promise<QuotaDto> {
  const quota = await ctx.quotas.findById(EntityId.create(input.quotaId));

  if (quota === null) {
    throw new NotFoundError(`Quota with id ${input.quotaId} was not found.`);
  }

  return toQuotaDto(quota);
}
