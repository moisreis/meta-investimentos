import Decimal from "decimal.js";
import { resolvePortfolioAccess } from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { PositionMarketValueDto } from "./position.dtos";

/**
 * Input for {@link calculatePositionMarketValue}.
 */
export interface CalculatePositionMarketValueInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the position to value.
   */
  positionId: string;

  /**
   * The reference date for the valuation.
   */
  referenceDate: Date;
}

/**
 * Calculates the market value of a position on a reference date.
 *
 * The market value is the product of the quotas held (applications
 * minus withdrawals) and the quota price of the fund on the reference
 * date. The reads run through the transaction-scoped repositories.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor, position, and reference date.
 * @returns The {@link PositionMarketValueDto}.
 *
 * @throws {NotFoundError} When the position or its portfolio is not
 *   accessible.
 */
export async function calculatePositionMarketValue(
  ctx: Pick<
    UnitOfWorkContext,
    | "portfolios"
    | "portfolioPermissions"
    | "positions"
    | "applications"
    | "withdrawals"
    | "quotas"
  >,
  input: CalculatePositionMarketValueInput,
): Promise<PositionMarketValueDto> {
  const position = await ctx.positions.findById(
    EntityId.create(input.positionId),
  );

  if (position === null) {
    throw new NotFoundError(
      `Position with id ${input.positionId} was not found.`,
    );
  }

  await resolvePortfolioAccess(
    ctx,
    position.portfolioId,
    EntityId.create(input.actorId),
  );

  const periodStart = new Date(0);

  const applications = await ctx.applications.findAllByPositionIdInPeriod(
    EntityId.create(input.positionId),
    periodStart,
    input.referenceDate,
  );
  const withdrawals = await ctx.withdrawals.findAllByPositionIdInPeriod(
    EntityId.create(input.positionId),
    periodStart,
    input.referenceDate,
  );

  const appQuotas = applications.reduce(
    (acc, a) => acc.plus(a.quotas.value),
    new Decimal(0),
  );
  const wdQuotas = withdrawals.reduce(
    (acc, w) => acc.plus(w.quotas.value),
    new Decimal(0),
  );
  const quotasHeld = appQuotas.minus(wdQuotas);

  const quota = await ctx.quotas.findByFundIdAndDate(
    position.fundId,
    input.referenceDate,
  );

  const quotaPrice = quota ? quota.price : null;
  const marketValue = quotaPrice
    ? quotaPrice.value.times(quotasHeld).toFixed(2)
    : "0.00";

  return {
    positionId: position.id as EntityId,
    fundId: position.fundId,
    referenceDate: input.referenceDate,
    quotasHeld: quotasHeld.toString(),
    quotaPrice: quotaPrice?.value.toString() ?? null,
    marketValue,
  };
}
