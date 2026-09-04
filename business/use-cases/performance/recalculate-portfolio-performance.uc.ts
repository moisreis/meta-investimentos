import Decimal from "decimal.js";

import {
  calculatePortfolioCumulativeTarget,
  calculatePortfolioPerformance,
  calculatePortfolioReturn,
  calculatePortfolioTarget,
  calculatePositionPerformance,
} from "@/business/calculators";
import {
  reconstructPositionHoldings,
  resolveQuoteAtOrBefore,
} from "@/business/calculators/performance";
import type { Quota } from "@/business/entities/fund/quota.entity";
import type { PositionPerformance } from "@/business/entities/performance/position-performance.entity";
import type { Application } from "@/business/entities/portfolio/application.entity";
import type { Portfolio } from "@/business/entities/portfolio/portfolio.entity";
import type { Position } from "@/business/entities/portfolio/position.entity";
import type { TransactionAllocation } from "@/business/entities/portfolio/transaction-allocation.entity";
import type { Withdrawal } from "@/business/entities/portfolio/withdrawal.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";
import { GrowthFactor } from "@/business/value-objects/growth-factor.vo";
import type { QuotaPrice } from "@/business/value-objects/quota-price.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { withCalculationLock } from "./calculation-lock";

/**
 * The number of days to look back before the requested start date so the
 * trailing (monthly/yearly/12-month) returns can be derived.
 */
const LOOKBACK_DAYS = 400;
const DAY_MS = 86_400_000;

/** The benchmark acronyms used to compute the portfolio targets/spreads. */
const INFLATION_ACRONYM = "IPCA";
const RISK_FREE_ACRONYM = "CDI";
const MARKET_ACRONYM = "IBOV";

/**
 * The subset of repos required to recalculate performance.
 */
type CalculationContext = Pick<
  UnitOfWorkContext,
  | "portfolios"
  | "positions"
  | "applications"
  | "withdrawals"
  | "transactionAllocations"
  | "quotas"
  | "benchmarks"
  | "benchmarkHistories"
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

  /**
   * Additional reference dates that must receive a snapshot even when no
   * exact quote exists for the date; the last known quote is carried
   * forward. Defaults to none.
   */
  anchorDates?: Date[];
}

/** A single position and the fund it holds. */
interface ResolvedPosition {
  position: Position;
  fundId: string;
}

/** A quota price keyed by its date timestamp. */
type QuotaMap = Map<number, QuotaPrice>;

/** An accumulated daily growth factor. */
interface DailyFactor {
  date: Date;
  factor: GrowthFactor;
}

/** The recomputed position snapshot for a single date. */
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

/** The flows and allocations that reconstruct a position's holdings. */
interface PositionFlowData {
  applications: Application[];
  withdrawals: Withdrawal[];
  allocations: TransactionAllocation[];
}

/** The monthly inflation rates keyed by `YYYY-MM`. */
type MonthlyRateMap = Map<string, SignedPercentage>;

/** The monthly benchmark rates keyed by `YYYY-MM` per benchmark role. */
interface MonthlyBenchmarkRates {
  inflation: MonthlyRateMap;
  riskFree: MonthlyRateMap;
  market: MonthlyRateMap;
}

/**
 * Recomputes and persists the position and portfolio performance rows for
 * the provided portfolios over the provided date range.
 *
 * For every date that has quota data within the range, a
 * {@link PositionPerformance} is written for each position and a
 * {@link PortfolioPerformance} is written for the portfolio. The snapshot
 * is computed from FIFO-reconstructed holdings, and the missing-quote
 * resolution carries the last known price forward. Existing performance
 * rows inside the requested range are replaced, keeping the operation
 * idempotent.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The portfolios and period to recalculate.
 */
export async function recalculatePortfolioPerformance(
  ctx: CalculationContext,
  input: RecalculatePortfolioPerformanceInput,
): Promise<void> {
  for (const portfolioId of input.portfolioIds) {
    await withCalculationLock(portfolioId, () =>
      recalculatePortfolio(ctx, portfolioId, input),
    );
  }
}

async function recalculatePortfolio(
  ctx: CalculationContext,
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

  await clearPortfolioRows(ctx, portfolioId, input);

  const FLOW_DATA: PositionFlowData[] = [];
  for (const R of RESOLVED) {
    FLOW_DATA.push(
      await loadPositionFlows(
        ctx,
        R.position.id as EntityId,
        PERIOD_START,
        input.endDate,
      ),
    );
  }

  const PORTFOLIO_AGG = new Map<number, PortfolioDailyAggregate>();

  const POSITION_SNAPSHOTS: {
    position: Position;
    snapshots: PositionSnapshot[];
  }[] = [];

  for (let I = 0; I < RESOLVED.length; I += 1) {
    const SNAPSHOTS = await buildPositionSnapshots(
      RESOLVED[I],
      FLOW_DATA[I],
      input,
      QUOTAS,
    );

    await clearPositionRows(ctx, RESOLVED[I].position, input);

    for (const SNAPSHOT of SNAPSHOTS) {
      if (!withinRange(SNAPSHOT.date, input)) {
        continue;
      }
      aggregate(PORTFOLIO_AGG, SNAPSHOT);
    }

    POSITION_SNAPSHOTS.push({
      position: RESOLVED[I].position,
      snapshots: SNAPSHOTS,
    });
  }

  const MONTHLY_BENCHMARKS = await resolveBenchmarkRates(
    ctx,
    INFLATION_ACRONYM,
    RISK_FREE_ACRONYM,
    MARKET_ACRONYM,
  );

  for (const { position, snapshots } of POSITION_SNAPSHOTS) {
    for (const SNAPSHOT of snapshots) {
      if (!withinRange(SNAPSHOT.date, input)) {
        continue;
      }
      const PORTFOLIO_PATRIMONY =
        PORTFOLIO_AGG.get(SNAPSHOT.date.getTime())?.patrimony ?? new Decimal(0);

      const PERFORMANCE = await calculatePositionPerformanceRow(
        position,
        SNAPSHOT,
        PORTFOLIO_PATRIMONY,
      );
      await ctx.positionPerformances.save(PERFORMANCE);
    }
  }

  await writePortfolioRows(
    ctx,
    PORTFOLIO,
    PORTFOLIO_AGG,
    input,
    RESOLVED,
    MONTHLY_BENCHMARKS,
  );
}

async function calculatePositionPerformanceRow(
  position: Position,
  snapshot: PositionSnapshot,
  portfolioPatrimony: Decimal,
): Promise<PositionPerformance> {
  const TRAILING = buildTrailingPeriods(snapshot.factors);

  const ALLOCATION = portfolioPatrimony.greaterThan(0)
    ? snapshot.patrimony.dividedBy(portfolioPatrimony).times(100)
    : new Decimal(0);

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
    allocation: ALLOCATION,
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
  ctx: CalculationContext,
  portfolio: Portfolio,
  byDate: Map<number, PortfolioDailyAggregate>,
  input: RecalculatePortfolioPerformanceInput,
  resolved: ResolvedPosition[],
  monthlyBenchmarks: MonthlyBenchmarkRates,
): Promise<void> {
  const DATES = [...byDate.keys()].sort((A, B) => A - B);

  if (DATES.length === 0) {
    return;
  }

  const INITIAL_BALANCE_SUM = sumInitialBalances(resolved);

  const DATES_IN_RANGE = DATES.map(
    (D) => byDate.get(D) as PortfolioDailyAggregate,
  ).filter((AGG) => withinRange(AGG.date, input));

  const MONTH_TARGETS = new Map<string, SignedPercentage>();
  for (const AGG of DATES_IN_RANGE) {
    const MONTH = monthKey(AGG.date);
    if (MONTH_TARGETS.has(MONTH)) {
      continue;
    }
    const IPCA =
      monthlyBenchmarks.inflation.get(MONTH) ?? SignedPercentage.create("0");
    MONTH_TARGETS.set(
      MONTH,
      calculatePortfolioTarget({
        annualInterestRate: portfolio.annualInterestRate,
        inflationRate: IPCA,
      }),
    );
  }

  const CUMULATIVE_BY_MONTH = new Map<string, SignedPercentage>();
  const SORTED_MONTHS = [...MONTH_TARGETS.keys()].sort();
  for (let I = 0; I < SORTED_MONTHS.length; I += 1) {
    const MONTH = SORTED_MONTHS[I];
    const SERIES: SignedPercentage[] = [];
    for (let J = 0; J <= I; J += 1) {
      SERIES.push(MONTH_TARGETS.get(SORTED_MONTHS[J]) as SignedPercentage);
    }
    CUMULATIVE_BY_MONTH.set(
      MONTH,
      calculatePortfolioCumulativeTarget({
        monthlyTargets: SERIES.map((value) => ({ value })),
      }),
    );
  }

  for (const AGG of DATES_IN_RANGE) {
    const MONTH = monthKey(AGG.date);
    const trailingRet = trailingReturn(AGG);

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
        trailingPeriods: buildPortfolioTrailingPeriods(AGG),
        monthlyTarget: MONTH_TARGETS.get(MONTH) ?? null,
        cumulativeTargets: cumulativeTargetsUpTo(CUMULATIVE_BY_MONTH, MONTH),
        monthlyBenchmarkRates: [],
        trailingMonthlyReturn: trailingRet,
        inflationIndexReturn: monthlyBenchmarks.inflation.get(MONTH) ?? null,
        riskFreeIndexReturn: monthlyBenchmarks.riskFree.get(MONTH) ?? null,
        marketIndexReturn: monthlyBenchmarks.market.get(MONTH) ?? null,
      }),
    );
  }
}

function cumulativeTargetsUpTo(
  cumulativeByMonth: Map<string, SignedPercentage>,
  month: string,
): SignedPercentage[] {
  const RESULT: SignedPercentage[] = [];
  for (const KEY of [...cumulativeByMonth.keys()].sort()) {
    if (KEY <= month) {
      RESULT.push(cumulativeByMonth.get(KEY) as SignedPercentage);
    }
  }
  return RESULT;
}

function trailingReturn(agg: PortfolioDailyAggregate): SignedPercentage | null {
  const FACTORS = agg.factors.slice(-30);
  if (FACTORS.length === 0) {
    return null;
  }
  return calculatePortfolioReturn({
    dailyGrowthFactors: FACTORS.map((F) => ({ value: F.factor })),
  });
}

function buildPortfolioTrailingPeriods(
  agg: PortfolioDailyAggregate,
): Record<string, GrowthFactor[]> {
  const BY_DATE = agg.factors.map((F) => F.factor);
  return {
    monthly: BY_DATE.slice(-30),
    yearly: BY_DATE.slice(-365),
    last12m: BY_DATE.slice(-365),
  };
}

async function resolveBenchmarkRates(
  ctx: CalculationContext,
  inflationAcronym: string,
  riskFreeAcronym: string,
  marketAcronym: string,
): Promise<MonthlyBenchmarkRates> {
  const [inflation, riskFree, market] = await Promise.all([
    resolveMonthlyRates(ctx, inflationAcronym),
    resolveMonthlyRates(ctx, riskFreeAcronym),
    resolveMonthlyRates(ctx, marketAcronym),
  ]);
  return { inflation, riskFree, market };
}

async function resolveMonthlyRates(
  ctx: CalculationContext,
  acronym: string,
): Promise<MonthlyRateMap> {
  const RATES: MonthlyRateMap = new Map();

  const BENCHMARK = await ctx.benchmarks.findByAcronym(acronym);
  if (!BENCHMARK) {
    return RATES;
  }

  const HISTORIES = await ctx.benchmarkHistories.findAllByBenchmarkId(
    BENCHMARK.id as EntityId,
  );
  for (const HISTORY of HISTORIES) {
    RATES.set(monthKey(HISTORY.date), HISTORY.rate);
  }

  return RATES;
}

async function loadPositionFlows(
  ctx: CalculationContext,
  positionId: EntityId,
  periodStart: Date,
  endDate: Date,
): Promise<PositionFlowData> {
  const APPLICATIONS = await ctx.applications.findAllByPositionIdInPeriod(
    positionId,
    periodStart,
    endDate,
  );
  const WITHDRAWALS = await ctx.withdrawals.findAllByPositionIdInPeriod(
    positionId,
    periodStart,
    endDate,
  );

  const ALLOCATIONS = new Map<string, TransactionAllocation>();

  for (const APP of APPLICATIONS) {
    const APP_ALLOCS = await ctx.transactionAllocations.findAllByApplicationId(
      APP.id as EntityId,
    );
    for (const A of APP_ALLOCS) {
      ALLOCATIONS.set(allocationKey(A), A);
    }
  }
  for (const W of WITHDRAWALS) {
    const W_ALLOCS = await ctx.transactionAllocations.findAllByWithdrawalId(
      W.id as EntityId,
    );
    for (const A of W_ALLOCS) {
      ALLOCATIONS.set(allocationKey(A), A);
    }
  }

  return {
    applications: APPLICATIONS,
    withdrawals: WITHDRAWALS,
    allocations: [...ALLOCATIONS.values()],
  };
}

function allocationKey(a: TransactionAllocation): string {
  return (
    a.id?.toString() ??
    `${a.applicationId.toString()}:${a.withdrawId.toString()}`
  );
}

async function buildPositionSnapshots(
  resolved: ResolvedPosition,
  flow: PositionFlowData,
  input: RecalculatePortfolioPerformanceInput,
  quotas: Quota[],
): Promise<PositionSnapshot[]> {
  const FUND_QUOTAS = quotas.filter(
    (Q) => Q.fundId.toString() === resolved.fundId,
  );
  const QUOTA_MAP = buildQuotaMap(FUND_QUOTAS);
  const DATE_SET = new Set(QUOTA_MAP.keys());
  for (const ANCHOR of input.anchorDates ?? []) {
    if (withinRange(ANCHOR, input)) {
      DATE_SET.add(ANCHOR.getTime());
    }
  }
  const DATES = [...DATE_SET].sort((A, B) => A - B);

  const SNAPSHOTS: PositionSnapshot[] = [];
  const FACTORS: DailyFactor[] = [];
  let previousValue: Decimal | null = null;

  for (const DATE of DATES) {
    const EXACT = QUOTA_MAP.get(DATE);
    const PRICE = EXACT ?? resolveQuoteAtOrBefore(FUND_QUOTAS, new Date(DATE));
    if (!PRICE) {
      continue;
    }

    const SNAPSHOT_DATE = new Date(DATE);
    const HOLDINGS = reconstructPositionHoldings(
      SNAPSHOT_DATE,
      flow.applications,
      flow.withdrawals,
      flow.allocations,
    );
    const VALUE = PRICE.value.times(HOLDINGS.quotasHeld);

    if (previousValue !== null && !previousValue.isZero()) {
      FACTORS.push({
        date: SNAPSHOT_DATE,
        factor: GrowthFactor.create(VALUE.div(previousValue)),
      });
    }

    previousValue = VALUE;

    SNAPSHOTS.push({
      date: SNAPSHOT_DATE,
      flowTotals: {
        applicationAmount: HOLDINGS.applicationAmount,
        applicationQuotas: HOLDINGS.quotasHeld,
        withdrawalAmount: HOLDINGS.withdrawalAmount,
        withdrawalQuotas: new Decimal(0),
      },
      quotaPrice: PRICE,
      patrimony: VALUE,
      factors: [...FACTORS],
    });
  }

  return SNAPSHOTS;
}

function buildQuotaMap(quotas: Quota[]): QuotaMap {
  const MAP: QuotaMap = new Map();
  for (const QUOTA of quotas) {
    MAP.set(QUOTA.date.getTime(), QUOTA.price);
  }
  return MAP;
}

function buildTrailingPeriods(
  factors: DailyFactor[],
): Record<string, GrowthFactor[]> {
  const BY_DATE = factors.map((F) => F.factor);

  return {
    monthly: BY_DATE.slice(-30),
    yearly: BY_DATE.slice(-365),
    last12m: BY_DATE.slice(-365),
  };
}

function withinRange(
  date: Date,
  input: RecalculatePortfolioPerformanceInput,
): boolean {
  const T = date.getTime();
  return T >= input.startDate.getTime() && T <= input.endDate.getTime();
}

async function resolvePositions(
  ctx: CalculationContext,
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
  ctx: CalculationContext,
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
  ctx: CalculationContext,
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

function monthKey(date: Date): string {
  const M = date.getUTCMonth() + 1;
  const Y = date.getUTCFullYear();
  return `${Y}-${M.toString().padStart(2, "0")}`;
}
