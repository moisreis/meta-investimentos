import Decimal from "decimal.js";
import { calculateEarnings } from "@/business/calculators";
import { resolvePortfolioAccess } from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

import type { PortfolioSummaryDto } from "./portfolio-reads.dtos";

/**
 * Input for {@link getPortfolioSummary}.
 */
export interface GetPortfolioSummaryInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the portfolio to summarize.
   */
  portfolioId: string;

  /**
   * The reference date for the summary.
   */
  referenceDate: Date;
}

/**
 * Computes the portfolio summary on a reference date.
 *
 * The summary aggregates positions, applications, and withdrawals to
 * derive total patrimony, quotas held, and earnings. The reads run
 * through the transaction-scoped repositories.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor, portfolio, and reference date.
 * @returns The {@link PortfolioSummaryDto}.
 *
 * @throws {NotFoundError} When the portfolio is not accessible.
 */
export async function getPortfolioSummary(
  ctx: Pick<
    UnitOfWorkContext,
    | "portfolios"
    | "portfolioPermissions"
    | "positions"
    | "applications"
    | "withdrawals"
    | "quotas"
  >,
  input: GetPortfolioSummaryInput,
): Promise<PortfolioSummaryDto> {
  await resolvePortfolioAccess(
    ctx,
    EntityId.create(input.portfolioId),
    EntityId.create(input.actorId),
  );

  const positions = await ctx.positions.findAllByPortfolioId(
    EntityId.create(input.portfolioId),
  );

  const periodStart = new Date(0);

  let patrimony = new Decimal(0);
  let applicationTotal = new Decimal(0);
  let withdrawalTotal = new Decimal(0);
  let applicationQuotasSum = new Decimal(0);
  let withdrawalQuotasSum = new Decimal(0);

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

    for (const app of applications) {
      applicationTotal = applicationTotal.plus(app.amount.value);
      applicationQuotasSum = applicationQuotasSum.plus(app.quotas.value);
    }
    for (const w of withdrawals) {
      withdrawalTotal = withdrawalTotal.plus(w.amount.value);
      withdrawalQuotasSum = withdrawalQuotasSum.plus(w.quotas.value);
    }

    if (latestQuota !== null) {
      const quotasHeld = applicationQuotasSum.minus(withdrawalQuotasSum);
      patrimony = patrimony.plus(latestQuota.price.value.times(quotasHeld));
    }
  }

  const netCashFlow = SignedMoney.create(
    applicationTotal.minus(withdrawalTotal),
  );
  const initialBalance = SignedMoney.create(0);

  const earnings = calculateEarnings({
    currentBalance: SignedMoney.create(patrimony),
    initialBalance,
    cashFlow: netCashFlow,
  });

  return {
    portfolioId: EntityId.create(input.portfolioId),
    referenceDate: input.referenceDate,
    totalPatrimony: PositiveMoney.create(patrimony).value.toString(),
    totalQuotasHeld: applicationQuotasSum.minus(withdrawalQuotasSum).toString(),
    totalApplications: applicationTotal.toFixed(2),
    totalWithdrawals: withdrawalTotal.toFixed(2),
    netCashFlow: netCashFlow.value.toString(),
    earnings: earnings.value.toString(),
    positionCount: positions.length,
  };
}
