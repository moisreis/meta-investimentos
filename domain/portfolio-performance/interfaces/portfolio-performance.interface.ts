import type { PortfolioPerformance } from "@domain/portfolio-performance/entities/portfolio-performance.entity"
import type { EntityId } from "@/value-objects"

/**
 * @summary
 * Defines the repository contract for `PortfolioPerformance`.
 *
 * @remarks
 * An `IPortfolioPerformance` persists, retrieves, and removes
 * performances. Supports lookup by id, portfolio id, date,
 * and the latest entry of a portfolio.
 *
 * @explanation
 * Use this interface to implement data access for performances.
 * Persistence implementations map rows to `PortfolioPerformance`
 * entities.
 *
 * @example
 * const PERF = await PERF_REPO.findById(ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface IPortfolioPerformance {
  /**
   * @summary
   * Retrieves the performance with the provided id.
   *
   * @remarks
   * Returns null when no performance matches.
   *
   * @explanation
   * Use this method to look up a single performance by its
   * unique identifier. Callers check null for existence.
   *
   * @param id - The unique identifier of the performance.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const PERF = await PERF_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<PortfolioPerformance | null>

  /**
   * @summary
   * Retrieves all performances of the provided portfolio.
   *
   * @remarks
   * Returns an empty array when no performances match.
   *
   * @explanation
   * Use this method to list performances linked to a
   * portfolio. Returns an empty array for no matches.
   *
   * @param portfolioId - The unique identifier of the portfolio.
   *
   * @returns The matching entries.
   *
   * @example
   * const PERFS = await PERF_REPO.findAllByPortfolioId(PF_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByPortfolioId(
    portfolioId: EntityId
  ): Promise<PortfolioPerformance[]>

  /**
   * @summary
   * Retrieves all performances of the provided portfolios.
   *
   * @remarks
   * Returns an empty array when no performances match.
   *
   * @explanation
   * Use this method to list performances linked to several
   * portfolios. Returns an empty array for no matches.
   *
   * @param portfolioIds - The identifiers of the portfolios.
   *
   * @returns The matching entries.
   *
   * @example
   * const PERFS = await PERF_REPO
   *   .findAllByPortfolioIds(PORTFOLIO_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  findAllByPortfolioIds(
    portfolioIds: EntityId[]
  ): Promise<PortfolioPerformance[]>

  /**
   * @summary
   * Retrieves the portfolio's performance on a date.
   *
   * @remarks
   * Returns null when no performance matches.
   *
   * @explanation
   * Use this method to find the performance of a portfolio
   * on a given date. Callers check null for existence.
   *
   * @param portfolioId - The unique identifier of the portfolio.
   * @param date - The date of the performance.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const PERF = await PERF_REPO
   *   .findByPortfolioIdAndDate(PF_ID, DATE);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findByPortfolioIdAndDate(
    portfolioId: EntityId,
    date: Date
  ): Promise<PortfolioPerformance | null>

  /**
   * @summary
   * Retrieves the latest performance of the portfolio.
   *
   * @remarks
   * Returns null when the portfolio has no performance.
   *
   * @explanation
   * Use this method to get the most recent performance of
   * a portfolio. Callers check null for no data.
   *
   * @param portfolioId - The unique identifier of the portfolio.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const PERF = await PERF_REPO
   *   .findLatestByPortfolioId(PF_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findLatestByPortfolioId(
    portfolioId: EntityId
  ): Promise<PortfolioPerformance | null>

  /**
   * @summary
   * Retrieves the latest performance of each provided portfolio.
   *
   * @remarks
   * Returns an empty array when a portfolio has no
   * performance. Only the latest entry of each portfolio
   * is returned.
   *
   * @explanation
   * Use this method to get the most recent performance of
   * every given portfolio. Returns an empty array for none.
   *
   * @param portfolioIds - The identifiers of the portfolios.
   *
   * @returns The latest snapshots.
   *
   * @example
   * const PERFS = await PERF_REPO
   *   .findLatestByPortfolioIds(PORTFOLIO_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  findLatestByPortfolioIds(
    portfolioIds: EntityId[]
  ): Promise<PortfolioPerformance[]>

  /**
   * @summary
   * Retrieves the latest snapshot of each portfolio within
   * a date range.
   *
   * @remarks
   * Returns an empty array when no performance matches the
   * range or the portfolios. Only the latest entry of each
   * portfolio inside `[from, to]` is returned.
   *
   * @explanation
   * Use this method to hydrate the snapshot that closes a
   * date range for several portfolios in a single query.
   *
   * @param portfolioIds - The identifiers of the portfolios.
   * @param from - The inclusive start of the range.
   * @param to - The inclusive end of the range.
   *
   * @returns The latest snapshots in the range.
   *
   * @example
   * const PERFS = await PERF_REPO
   *   .findLatestByPortfolioIdsInRange(PF_IDS, FROM, TO);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  findLatestByPortfolioIdsInRange(
    portfolioIds: EntityId[],
    from: Date,
    to: Date
  ): Promise<PortfolioPerformance[]>

  /**
   * @summary
   * Retrieves the distinct snapshot dates of the portfolios.
   *
   * @remarks
   * Returns an empty array when no performance matches.
   * Every date is unique and ordered ascending.
   *
   * @explanation
   * Use this method to list the days that hold performance
   * records for the provided portfolios, so the UI can
   * disable the remaining days.
   *
   * @param portfolioIds - The identifiers of the portfolios.
   *
   * @returns The distinct snapshot dates.
   *
   * @example
   * const DATES = await PERF_REPO
   *   .findDistinctDatesByPortfolioIds(PF_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  findDistinctDatesByPortfolioIds(
    portfolioIds: EntityId[]
  ): Promise<Date[]>

  /**
   * @summary
   * Persists the provided performance.
   *
   * @remarks
   * Inserts a new record when the performance has no id;
   * otherwise updates the existing record.
   *
   * @explanation
   * Use this method to create or update a performance.
   * The persisted entity with its id is returned.
   *
   * @param portfolioPerformance - The performance to persist.
   *
   * @returns The persisted entry.
   *
   * @example
   * const PERF = await PERF_REPO.save(NEW_PERF);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(
    portfolioPerformance: PortfolioPerformance
  ): Promise<PortfolioPerformance>

  /**
   * @summary
   * Removes the performance with the provided id.
   *
   * @remarks
   * Resolves when the performance is removed.
   *
   * @explanation
   * Use this method to delete a performance record.
   * The promise resolves once the operation completes.
   *
   * @param id - The unique identifier of the performance.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await PERF_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>
}
