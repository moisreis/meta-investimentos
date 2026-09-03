import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

import type { QuotaDto } from "./fund.dtos";
import { toQuotaDto } from "./fund.dtos";

/**
 * Input for {@link listFundQuotas}.
 */
export interface ListFundQuotasInput {
  /**
   * The id of the fund to list quotas for.
   */
  fundId: string;
}

/**
 * Lists every quota registered for a fund.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The fund id.
 * @returns The {@link QuotaDto}s of the fund.
 */
export async function listFundQuotas(
  ctx: Pick<UnitOfWorkContext, "quotas">,
  input: ListFundQuotasInput,
): Promise<QuotaDto[]> {
  const quotas = await ctx.quotas.findAllByFundId(
    EntityId.create(input.fundId),
  );

  return quotas.map(toQuotaDto);
}
