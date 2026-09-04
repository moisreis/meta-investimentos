import { recalculatePortfolioPerformance } from "@/business/use-cases/performance/recalculate-portfolio-performance.uc";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

/**
 * The subset of repositories required to resolve and recalculate the
 * portfolios affected by a CVM import.
 */
type RecalculateAffectedPortfoliosContext = Pick<
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
 * Input for {@link recalculateAffectedPortfolios}.
 */
export interface RecalculateAffectedPortfoliosInput {
  /**
   * The id of the import whose affected portfolios should be recomputed
   * (used for provenance/audit linkage).
   */
  importId: string;

  /**
   * The distinct fund ids touched by the import.
   */
  fundIds: string[];

  /**
   * The start date (inclusive) of the imported period.
   */
  startDate: Date;

  /**
   * The end date (inclusive) of the imported period.
   */
  endDate: Date;
}

/**
 * Recomputes the performance of every portfolio that holds any of the
 * funds affected by a CVM quota import.
 *
 * The trigger resolves the affected portfolios by finding every position
 * that holds an imported fund, deduplicates the owning portfolios, and
 * delegates the actual recalculation (including the trailing-period
 * lookback) to {@link recalculatePortfolioPerformance}.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The import's affected funds and date range.
 */
export async function recalculateAffectedPortfolios(
  ctx: RecalculateAffectedPortfoliosContext,
  input: RecalculateAffectedPortfoliosInput,
): Promise<void> {
  const POSITIONS = await ctx.positions.findAllByFundIds(input.fundIds);

  const PORTFOLIO_IDS = [
    ...new Set(POSITIONS.map((P) => P.portfolioId as string)),
  ];

  if (PORTFOLIO_IDS.length === 0) {
    return;
  }

  await recalculatePortfolioPerformance(ctx, {
    portfolioIds: PORTFOLIO_IDS,
    startDate: input.startDate,
    endDate: input.endDate,
  });
}
