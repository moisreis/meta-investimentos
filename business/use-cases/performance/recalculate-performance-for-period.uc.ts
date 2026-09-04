import {
  RangeReference,
  ReferenceDatePolicy,
  type ReferencePeriod,
  type ReferenceSpan,
} from "@/business/date-policy/reference-date.policy";
import { recalculatePortfolioPerformance } from "@/business/use-cases/performance/recalculate-portfolio-performance.uc";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

/**
 * The subset of repositories required to recalculate a portfolio's
 * performance for a reference period.
 */
type RecalculatePeriodContext = Pick<
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
 * Input for {@link recalculatePerformanceForPeriod}.
 */
export interface RecalculatePerformanceForPeriodInput {
  /**
   * The id of the portfolio to recalculate.
   */
  portfolioId: string;

  /**
   * The reference period to recalculate: a single date, a calendar
   * month, the year-to-date, the trailing 12 months, or an explicit
   * range.
   */
  period: ReferencePeriod | "range";

  /**
   * The reference date the period is anchored to. When `period` is a
   * range, `anchor` is the inclusive range start and
   * {@link RecalculatePerformanceForPeriodInput.endDate} the end.
   */
  anchor: Date;

  /**
   * The inclusive end of an explicit range (`period` is `"range"`).
   */
  endDate?: Date;

  /**
   * When `true` (and `period` is `"date"`), non-business days snap back
   * to the previous business day.
   */
  businessDay?: boolean;

  /**
   * The canonical policy used to resolve the reference span. Defaults to
   * a new instance with weekends only.
   */
  policy?: ReferenceDatePolicy;
}

/**
 * Recomputes the performance of a portfolio for a canonical reference
 * period.
 *
 * The period is resolved by the {@link ReferenceDatePolicy} so that the
 * "current date", "specified date", "date range", "month", "year-to-date"
 * and "trailing 12 months" behaviors are always consistent. The reference
 * anchor date is always included in the output (its quote is carried
 * forward when the exact date lacks one).
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The portfolio and reference period to recalculate.
 */
export async function recalculatePerformanceForPeriod(
  ctx: RecalculatePeriodContext,
  input: RecalculatePerformanceForPeriodInput,
): Promise<void> {
  const POLICY = input.policy ?? new ReferenceDatePolicy();

  const SPAN = resolveSpan(POLICY, input);

  // NB: `recalculatePortfolioPerformance` already acquires the per-portfolio
  // calculation lock internally, so no additional lock is taken here (a second
  // lock on the same key would deadlock the already-held mutex).
  return recalculatePortfolioPerformance(ctx, {
    portfolioIds: [input.portfolioId],
    startDate: SPAN.start,
    endDate: SPAN.end,
    anchorDates: policyReferenceDates(input, SPAN),
  });
}

function resolveSpan(
  policy: ReferenceDatePolicy,
  input: RecalculatePerformanceForPeriodInput,
): ReferenceSpan {
  if (input.period === "range") {
    if (!input.endDate) {
      throw new Error(
        "RecalculatePerformanceForPeriod range requires endDate.",
      );
    }
    return new RangeReference(input.anchor, input.endDate).span;
  }
  return policy.resolve(input.period, input.anchor, {
    businessDay: input.businessDay ?? false,
  });
}

function policyReferenceDates(
  input: RecalculatePerformanceForPeriodInput,
  span: ReferenceSpan,
): Date[] {
  if (input.period === "range") {
    return [];
  }
  return [span.end];
}
