import Decimal from "decimal.js";
import { resolvePortfolioAccess } from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

import type {
  PortfolioComplianceDto,
  PositionComplianceDto,
} from "./portfolio-reads.dtos";

/**
 * Input for {@link getPortfolioCompliance}.
 */
export interface GetPortfolioComplianceInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the portfolio to analyze.
   */
  portfolioId: string;

  /**
   * The reference date for the compliance analysis.
   */
  referenceDate: Date;
}

/**
 * Computes the compliance of a portfolio's positions against the
 * portfolio's own allocation bounds.
 *
 * The current allocation of each position is compared against the
 * portfolio's minimum and maximum allocation targets. The reads run
 * through the transaction-scoped repositories.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The actor, portfolio, and reference date.
 * @returns The {@link PortfolioComplianceDto}.
 *
 * @throws {NotFoundError} When the portfolio is not accessible.
 */
export async function getPortfolioCompliance(
  ctx: Pick<
    UnitOfWorkContext,
    | "portfolios"
    | "portfolioPermissions"
    | "positions"
    | "applications"
    | "withdrawals"
    | "quotas"
  >,
  input: GetPortfolioComplianceInput,
): Promise<PortfolioComplianceDto> {
  const { portfolio } = await resolvePortfolioAccess(
    ctx,
    EntityId.create(input.portfolioId),
    EntityId.create(input.actorId),
  );

  const positions = await ctx.positions.findAllByPortfolioId(
    EntityId.create(input.portfolioId),
  );

  const periodStart = new Date(0);
  let totalPatrimony = new Decimal(0);

  const positionValues: Array<{
    position: (typeof positions)[number];
    value: Decimal;
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

    positionValues.push({ position, value });
    totalPatrimony = totalPatrimony.plus(value);
  }

  const positionCompliance: PositionComplianceDto[] = [];
  const violations: Array<{ positionId: EntityId; reason: string }> = [];

  for (const { position, value } of positionValues) {
    const allocationPercent = totalPatrimony.isZero()
      ? 0
      : value.dividedBy(totalPatrimony).times(100);

    const current = SignedPercentage.create(allocationPercent.toString());

    let compliant = true;
    let reason = "";

    if (current.value.lt(portfolio.minAllocation.value)) {
      compliant = false;
      reason = "allocation below portfolio minimum";
    } else if (current.value.gt(portfolio.maxAllocation.value)) {
      compliant = false;
      reason = "allocation above portfolio maximum";
    }

    positionCompliance.push({
      positionId: position.id as EntityId,
      fundId: position.fundId,
      currentAllocation: allocationPercent.toFixed(4),
      normMinAllocation: portfolio.minAllocation.value.toString(),
      normMaxAllocation: portfolio.maxAllocation.value.toString(),
      normTargetAllocation: portfolio.targetAllocation.value.toString(),
      compliant,
    });

    if (!compliant) {
      violations.push({
        positionId: position.id as EntityId,
        reason,
      });
    }
  }

  return {
    portfolioId: EntityId.create(input.portfolioId),
    positions: positionCompliance,
    overallCompliant: violations.length === 0,
    violations,
  };
}
