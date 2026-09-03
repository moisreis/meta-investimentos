import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { QuotaDto } from "./fund.dtos";
import { toQuotaDto } from "./fund.dtos";

/**
 * Input for {@link getLatestQuota}.
 */
export interface GetLatestQuotaInput {
  /**
   * The id of the fund to retrieve the latest quota for.
   */
  fundId: string;
}

/**
 * Retrieves the most recent quota for a fund.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The fund id.
 * @returns The latest {@link QuotaDto}.
 *
 * @throws {NotFoundError} When the fund has no quota registered.
 */
export async function getLatestQuota(
  ctx: Pick<UnitOfWorkContext, "quotas">,
  input: GetLatestQuotaInput,
): Promise<QuotaDto> {
  const quota = await ctx.quotas.findLatestByFundId(
    EntityId.create(input.fundId),
  );

  if (quota === null) {
    throw new NotFoundError(`No quota found for fund ${input.fundId}.`);
  }

  return toQuotaDto(quota);
}
