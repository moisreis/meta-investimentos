import Decimal from "decimal.js";

import {
  calculatePortfolioPerformance,
  calculatePositionPerformance,
} from "@/business/calculators";
import type { Quota } from "@/business/entities/fund/quota.entity";
import type { PositionPerformance } from "@/business/entities/performance/position-performance.entity";
import type { Portfolio } from "@/business/entities/portfolio/portfolio.entity";
import type { Position } from "@/business/entities/portfolio/position.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";
import { GrowthFactor } from "@/business/value-objects/growth-factor.vo";
import type { QuotaPrice } from "@/business/value-objects/quota-price.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

/**
 * The number of days to look back before the requested start date so the
 * trailing (monthly/yearly/12-month) returns can be derived.
 */
const LOOKBACK_DAYS = 400;
const DAY_MS = 86_400_000;

/**
 * The subset of repos required to recalculate performance.
 */
type RecalculationContext = Pick<
  UnitOfWorkContext,
  | "portfolios"
  | "positions"
  | "applications"
  | "withdrawals"
  | "quotas"
  | "positionPerformances"
  | "portfolioPerformances"
>;

/**
 * Input for {@link recalculatePortfolioPerformance}.
 */
export interface RecalculatePortfolioPerformanceInput {
  /**
   * The ids of the portfolios to recalculate.
   */
  portfolioIds: string[];

  /**
   * The start date (inclusive) of the period to recompute.
   */
  startDate: Date;

  /**
   * The end date (inclusive) of the period to recompute.
   */
  endDate: Date;
}

/** Flow totals accumulated up to a date (excluding reversed transactions). */
interface FlowRow {
  date: Date;
  amount: Decimal;
  quotas: Decimal;
}

/** A single position and the fund it holds. */
interface ResolvedPosition {
  position: Position;
  fundId: string;
}

/** A quota price keyed by its date timestamp. */
type QuotaMap = Map<number, QuotaPrice>;

/**
 * The cumulative growth chain computed for a single position over time.
 */
interface DailyFactor {
  date: Date;
  factor: GrowthFactor;
}

/** The recomputed position snapshots for a single date. */
interface PositionSnapshot {
  date: Date;
  flowTotals: {
    applicationAmount: Decimal;
    applicationQuotas: Decimal;
    withdrawalAmount: Decimal;
    withdrawalQuotas: Decimal;
  };
  quotaPrice: QuotaPrice;
  patrimony: Decimal;
  factors: DailyFactor[];
}

/** The aggregated per-date values across all positions of a portfolio. */
interface PortfolioDailyAggregate {
  date: Date;
  patrimony: Decimal;
  applicationQuotas: Decimal;
  withdrawalQuotas: Decimal;
  applicationAmount: Decimal;
  withdrawalAmount: Decimal;
  factors: DailyFactor[];
}

/**
 * Recomputes and persists the position and portfolio performance rows for
 * the provided portfolios over the provided date range.
 *
 * For every date that has quota data within the range, a
 * {@link PositionPerformance} is written for each position and a
 * {@link PortfolioPerformance} is written for the portfolio. Existing
 * performance rows inside the requested range are replaced, keeping the
 * operation idempotent.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The portfolios and period to recalculate.
 */
export async function recalculatePortfolioPerformance(
  ctx: RecalculationContext,
  input: RecalculatePortfolioPerformanceInput,
): Promise<void> {
  for (const portfolioId of input.portfolioIds) {
    await recalculatePortfolio(ctx, portfolioId, input);
  }
}

async function recalculatePortfolio(
  ctx: RecalculationContext,
  portfolioId: string,
  input: RecalculatePortfolioPerformanceInput,
): Promise<void> {
  const PORTFOLIO = await ctx.portfolios.findById(portfolioId as never);
  if (PORTFOLIO === null) {
    return;
  }

  const RESOLVED = await resolvePositions(ctx, portfolioId);
  if (RESOLVED.length === 0) {
    await clearPortfolioRows(ctx, portfolioId, input);
    return;
  }

  const FUND_IDS = RESOLVED.map((R) => R.fundId);

  const PERIOD_START = new Date(
    input.startDate.getTime() - LOOKBACK_DAYS * DAY_MS,
  );
  const QUOTAS = await ctx.quotas.findAllByFundIdsInPeriod(
    FUND_IDS,
    PERIOD_START,
    input.endDate,
  );

  const PORTFOLIO_BY_DATE = new Map<number, PortfolioDailyAggregate>();

  for (const RESOLVED_POSITION of RESOLVED) {
    const SNAPSHOTS = await buildPositionSnapshots(
      ctx,
      RESOLVED_POSITION,
      new Date(PERIOD_START),
      input,
      QUOTAS,
    );

    await clearPositionRows(ctx, RESOLVED_POSITION.position, input);

    for (const SNAPSHOT of SNAPSHOTS) {
      if (!withinRange(SNAPSHOT.date, input)) {
        continue;
      }

      const PERFORMANCE = await calculatePositionPerformanceRow(
        RESOLVED_POSITION.position,
        SNAPSHOT,
      );
      await ctx.positionPerformances.save(PERFORMANCE);

      aggregate(PORTFOLIO_BY_DATE, SNAPSHOT);
    }
  }

  await writePortfolioRows(ctx, PORTFOLIO, PORTFOLIO_BY_DATE, input, RESOLVED);
}

async function calculatePositionPerformanceRow(
  position: Position,
  snapshot: PositionSnapshot,
): Promise<PositionPerformance> {
  const TRAILING = buildTrailingPeriods(snapshot.factors);
  const allocation = computeAllocation(snapshot);

  return calculatePositionPerformance({
    positionId: position.id?.toString() ?? "",
    date: snapshot.date,
    flowTotals: snapshot.flowTotals,
    dailyGrowthFactor:
      snapshot.factors.length > 0
        ? snapshot.factors[snapshot.factors.length - 1].factor
        : null,
    trailingPeriods: TRAILING,
    quotaPrice: snapshot.quotaPrice,
    allocation,
    initialBalance: position.initialBalance?.value ?? new Decimal(0),
  });
}

function aggregate(
  map: Map<number, PortfolioDailyAggregate>,
  snapshot: PositionSnapshot,
): void {
  const KEY = snapshot.date.getTime();
  const EXISTING = map.get(KEY) ?? {
    date: snapshot.date,
    patrimony: new Decimal(0),
    applicationQuotas: new Decimal(0),
    withdrawalQuotas: new Decimal(0),
    applicationAmount: new Decimal(0),
    withdrawalAmount: new Decimal(0),
    factors: [],
  };

  EXISTING.patrimony = EXISTING.patrimony.plus(snapshot.patrimony);
  EXISTING.applicationQuotas = EXISTING.applicationQuotas.plus(
    snapshot.flowTotals.applicationQuotas,
  );
  EXISTING.withdrawalQuotas = EXISTING.withdrawalQuotas.plus(
    snapshot.flowTotals.withdrawalQuotas,
  );
  EXISTING.applicationAmount = EXISTING.applicationAmount.plus(
    snapshot.flowTotals.applicationAmount,
  );
  EXISTING.withdrawalAmount = EXISTING.withdrawalAmount.plus(
    snapshot.flowTotals.withdrawalAmount,
  );
  if (snapshot.factors.length > 0) {
    EXISTING.factors.push(snapshot.factors[snapshot.factors.length - 1]);
  }

  map.set(KEY, EXISTING);
}

async function writePortfolioRows(
  ctx: RecalculationContext,
  portfolio: Portfolio,
  byDate: Map<number, PortfolioDailyAggregate>,
  input: RecalculatePortfolioPerformanceInput,
  resolved: ResolvedPosition[],
): Promise<void> {
  const DATES = [...byDate.keys()].sort((A, B) => A - B);

  await clearPortfolioRows(ctx, portfolio.id?.toString() ?? "", input);

  if (DATES.length === 0) {
    return;
  }

  const INITIAL_BALANCE_SUM = sumInitialBalances(resolved);

  for (const DATE of DATES) {
    const AGG = byDate.get(DATE) as PortfolioDailyAggregate;
    if (!withinRange(AGG.date, input)) {
      continue;
    }

    await ctx.portfolioPerformances.save(
      calculatePortfolioPerformance({
        portfolioId: portfolio.id?.toString() ?? "",
        date: AGG.date,
        portfolioValue: AGG.patrimony,
        sumOfInitialBalances: INITIAL_BALANCE_SUM,
        applicationTotal: AGG.applicationAmount,
        applicationQuotas: AGG.applicationQuotas,
        withdrawalTotal: AGG.withdrawalAmount,
        withdrawalQuotas: AGG.withdrawalQuotas,
        dailyGrowthFactor:
          AGG.factors.length > 0
            ? AGG.factors[AGG.factors.length - 1].factor
            : null,
        trailingPeriods: {},
        monthlyTarget: null,
        cumulativeTargets: [],
        monthlyBenchmarkRates: [],
        trailingMonthlyReturn: null,
        inflationIndexReturn: null,
        riskFreeIndexReturn: null,
        marketIndexReturn: null,
      }),
    );
  }
}

async function buildPositionSnapshots(
  ctx: RecalculationContext,
  resolved: ResolvedPosition,
  periodStart: Date,
  input: RecalculatePortfolioPerformanceInput,
  quotas: Quota[],
): Promise<PositionSnapshot[]> {
  const QUOTA_MAP = buildQuotaMap(quotas, resolved.fundId);
  const DATES = [...QUOTA_MAP.keys()].sort((A, B) => A - B);

  const positionId = resolved.position.id as EntityId;
  const [APPLICATIONS, WITHDRAWALS] = await Promise.all([
    ctx.applications.findAllByPositionIdInPeriod(
      positionId,
      periodStart,
      input.endDate,
    ),
    ctx.withdrawals.findAllByPositionIdInPeriod(
      positionId,
      periodStart,
      input.endDate,
    ),
  ]);

  const APPLICATION_ROWS: FlowRow[] = APPLICATIONS.map((A) => ({
    date: A.date,
    amount: A.amount.value,
    quotas: A.quotas.value,
  }));
  const WITHDRAWAL_ROWS: FlowRow[] = WITHDRAWALS.map((W) => ({
    date: W.date,
    amount: W.amount.value,
    quotas: W.quotas.value,
  }));

  const SNAPSHOTS: PositionSnapshot[] = [];
  const FACTORS: DailyFactor[] = [];
  let previousValue: Decimal | null = null;

  for (const DATE of DATES) {
    const QUOTA_PRICE = QUOTA_MAP.get(DATE);
    if (!QUOTA_PRICE) {
      continue;
    }

    const FLOW = buildFlowTotals(
      APPLICATION_ROWS,
      WITHDRAWAL_ROWS,
      new Date(DATE),
    );
    const QUOTAS_HELD = Decimal.max(
      FLOW.applicationQuotas.minus(FLOW.withdrawalQuotas),
      0,
    );
    const VALUE = QUOTA_PRICE.value.times(QUOTAS_HELD);

    if (previousValue !== null && !previousValue.isZero()) {
      FACTORS.push({
        date: new Date(DATE),
        factor: GrowthFactor.create(VALUE.div(previousValue)),
      });
    }

    previousValue = VALUE;

    SNAPSHOTS.push({
      date: new Date(DATE),
      flowTotals: FLOW,
      quotaPrice: QUOTA_PRICE,
      patrimony: VALUE,
      factors: [...FACTORS],
    });
  }

  return SNAPSHOTS;
}

function buildQuotaMap(quotas: Quota[], fundId: string): QuotaMap {
  const MAP: QuotaMap = new Map();
  for (const QUOTA of quotas) {
    if (QUOTA.fundId.toString() !== fundId) {
      continue;
    }
    MAP.set(QUOTA.date.getTime(), QUOTA.price);
  }
  return MAP;
}

function buildFlowTotals(
  applications: FlowRow[],
  withdrawals: FlowRow[],
  date: Date,
): PositionSnapshot["flowTotals"] {
  const TARGET = date.getTime();
  let applicationAmount = new Decimal(0);
  let applicationQuotas = new Decimal(0);
  let withdrawalAmount = new Decimal(0);
  let withdrawalQuotas = new Decimal(0);

  for (const A of applications) {
    if (A.date.getTime() <= TARGET) {
      applicationAmount = applicationAmount.plus(A.amount);
      applicationQuotas = applicationQuotas.plus(A.quotas);
    }
  }
  for (const W of withdrawals) {
    if (W.date.getTime() <= TARGET) {
      withdrawalAmount = withdrawalAmount.plus(W.amount);
      withdrawalQuotas = withdrawalQuotas.plus(W.quotas);
    }
  }

  return {
    applicationAmount,
    applicationQuotas,
    withdrawalAmount,
    withdrawalQuotas,
  };
}

function buildTrailingPeriods(
  factors: DailyFactor[],
): Record<string, GrowthFactor[]> {
  const BY_DATE = factors.map((F) => F.factor);

  return {
    monthly: sliceByWindow(BY_DATE, 30),
    yearly: sliceByWindow(BY_DATE, 365),
    last12m: sliceByWindow(BY_DATE, 365),
  };
}

function sliceByWindow(
  factors: GrowthFactor[],
  windowCount: number,
): GrowthFactor[] {
  return factors.slice(-windowCount);
}

function computeAllocation(snapshot: PositionSnapshot): Decimal {
  if (snapshot.patrimony.isZero()) {
    return new Decimal(0);
  }
  return new Decimal(100);
}

function withinRange(
  date: Date,
  input: RecalculatePortfolioPerformanceInput,
): boolean {
  const T = date.getTime();
  return T >= input.startDate.getTime() && T <= input.endDate.getTime();
}

async function resolvePositions(
  ctx: RecalculationContext,
  portfolioId: string,
): Promise<ResolvedPosition[]> {
  const POSITIONS = await ctx.positions.findAllByPortfolioId(
    portfolioId as never,
  );
  return POSITIONS.map((P) => ({
    position: P,
    fundId: P.fundId.toString(),
  }));
}

async function clearPositionRows(
  ctx: RecalculationContext,
  position: Position,
  input: RecalculatePortfolioPerformanceInput,
): Promise<void> {
  const ID = position.id as EntityId;
  const ROWS = await ctx.positionPerformances.findAllByPositionId(ID);
  for (const ROW of ROWS) {
    if (withinRange(ROW.date, input)) {
      await ctx.positionPerformances.delete(ROW.id as EntityId);
    }
  }
}

async function clearPortfolioRows(
  ctx: RecalculationContext,
  portfolioId: string,
  input: RecalculatePortfolioPerformanceInput,
): Promise<void> {
  const ID = portfolioId as never;
  const ROWS = await ctx.portfolioPerformances.findAllByPortfolioId(ID);
  for (const ROW of ROWS) {
    if (withinRange(ROW.date, input)) {
      await ctx.portfolioPerformances.delete(ROW.id as EntityId);
    }
  }
}

function sumInitialBalances(resolved: ResolvedPosition[]): Decimal {
  return resolved.reduce(
    (TOTAL, R) =>
      TOTAL.plus(R.position.initialBalance?.value ?? new Decimal(0)),
    new Decimal(0),
  );
}
