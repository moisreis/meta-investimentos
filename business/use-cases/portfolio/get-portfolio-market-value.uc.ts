import Decimal from "decimal.js";
import { resolvePortfolioAccess } from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

import type { PortfolioMarketValueDto } from "./portfolio-reads.dtos";

/**
 * Input for {@link getPortfolioMarketValue}.
 */
export interface GetPortfolioMarketValueInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the portfolio to value.
   */
  portfolioId: string;

  /**
   * The reference date for the valuation.
   */
  referenceDate: Date;
}

/**
 * Calculates the total market value of a portfolio on a reference date.
 *
 * Each position is valued as the product of the quotas held
 * (applications minus withdrawals up to the reference date) and the fund
 * quota price on the reference date; the position values are summed.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor, portfolio, and reference date.
 * @returns The {@link PortfolioMarketValueDto}.
 *
 * @throws {NotFoundError} When the portfolio is not accessible.
 */
export async function getPortfolioMarketValue(
  ctx: Pick<
    UnitOfWorkContext,
    | "portfolios"
    | "portfolioPermissions"
    | "positions"
    | "applications"
    | "withdrawals"
    | "quotas"
  >,
  input: GetPortfolioMarketValueInput,
): Promise<PortfolioMarketValueDto> {
  await resolvePortfolioAccess(
    ctx,
    EntityId.create(input.portfolioId),
    EntityId.create(input.actorId),
  );

  const positions = await ctx.positions.findAllByPortfolioId(
    EntityId.create(input.portfolioId),
  );

  const periodStart = new Date(0);

  let total = new Decimal(0);
  const valuations = [];

  for (const position of positions) {
    const positionId = position.id as EntityId;

    const applications = await ctx.applications.findAllByPositionIdInPeriod(
      positionId,
      periodStart,
      input.referenceDate,
    );
    const withdrawals = await ctx.withdrawals.findAllByPositionIdInPeriod(
      positionId,
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

    total = total.plus(new Decimal(marketValue));
    valuations.push({
      positionId,
      fundId: position.fundId,
      quotasHeld: quotasHeld.toString(),
      quotaPrice: quotaPrice?.value.toString() ?? null,
      marketValue,
    });
  }

  return {
    portfolioId: EntityId.create(input.portfolioId),
    referenceDate: input.referenceDate,
    totalMarketValue: total.toFixed(2),
    positionCount: positions.length,
    positions: valuations,
  };
}
