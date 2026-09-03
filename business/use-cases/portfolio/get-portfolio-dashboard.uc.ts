import Decimal from "decimal.js";
import { calculateEarnings } from "@/business/calculators";
import { resolvePortfolioAccess } from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

import type { PortfolioDashboardDto } from "./portfolio-reads.dtos";

/**
 * Input for {@link getPortfolioDashboard}.
 */
export interface GetPortfolioDashboardInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the portfolio to analyze.
   */
  portfolioId: string;

  /**
   * The reference date for the dashboard data.
   */
  referenceDate: Date;
}

/**
 * Retrieves the portfolio dashboard data on a reference date.
 *
 * The dashboard aggregates total patrimony, earnings, the allocation
 * series across positions, and recent application/withdrawal counts.
 * The reads run through the transaction-scoped repositories.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor, portfolio, and reference date.
 * @returns The {@link PortfolioDashboardDto}.
 *
 * @throws {NotFoundError} When the portfolio is not accessible.
 */
export async function getPortfolioDashboard(
  ctx: Pick<
    UnitOfWorkContext,
    | "portfolios"
    | "portfolioPermissions"
    | "positions"
    | "applications"
    | "withdrawals"
    | "quotas"
  >,
  input: GetPortfolioDashboardInput,
): Promise<PortfolioDashboardDto> {
  await resolvePortfolioAccess(
    ctx,
    EntityId.create(input.portfolioId),
    EntityId.create(input.actorId),
  );

  const positions = await ctx.positions.findAllByPortfolioId(
    EntityId.create(input.portfolioId),
  );

  const periodStart = new Date(0);
  let totalPatrimony = new Decimal(0);
  let applicationTotal = new Decimal(0);
  let withdrawalTotal = new Decimal(0);
  let recentApplications = 0;
  let recentWithdrawals = 0;

  const allocationSeries: Array<{
    positionId: EntityId;
    fundId: EntityId;
    allocation: string;
    patrimony: string;
  }> = [];

  for (const position of positions) {
    const applications = await ctx.applications.findAllByPositionIdInPeriod(
      position.id as EntityId,
      periodStart,
      input.referenceDate,
    );
    const withdrawals = await ctx.withdrawals.findAllByPositionIdInPeriod(
      position.id as EntityId,
      periodStart,
      input.referenceDate,
    );
    const latestQuota = await ctx.quotas.findLatestByFundId(position.fundId);

    recentApplications += applications.length;
    recentWithdrawals += withdrawals.length;

    const appQuotas = applications.reduce(
      (acc, a) => acc.plus(a.quotas.value),
      new Decimal(0),
    );
    const wdQuotas = withdrawals.reduce(
      (acc, w) => acc.plus(w.quotas.value),
      new Decimal(0),
    );
    const quotasHeld = appQuotas.minus(wdQuotas);
    const value =
      latestQuota !== null
        ? latestQuota.price.value.times(quotasHeld)
        : new Decimal(0);

    for (const app of applications) {
      applicationTotal = applicationTotal.plus(app.amount.value);
    }
    for (const w of withdrawals) {
      withdrawalTotal = withdrawalTotal.plus(w.amount.value);
    }

    totalPatrimony = totalPatrimony.plus(value);
    allocationSeries.push({
      positionId: position.id as EntityId,
      fundId: position.fundId,
      allocation: value.toString(),
      patrimony: value.toString(),
    });
  }

  const netCashFlow = SignedMoney.create(
    applicationTotal.minus(withdrawalTotal),
  );
  const earnings = calculateEarnings({
    currentBalance: SignedMoney.create(totalPatrimony),
    initialBalance: SignedMoney.create(0),
    cashFlow: netCashFlow,
  });

  return {
    portfolioId: EntityId.create(input.portfolioId),
    referenceDate: input.referenceDate,
    totalPatrimony: totalPatrimony.toString(),
    totalEarnings: earnings.value.toString(),
    allocationSeries,
    recentApplications,
    recentWithdrawals,
  };
}
