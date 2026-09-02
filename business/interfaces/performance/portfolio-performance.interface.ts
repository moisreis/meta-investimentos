import type { PortfolioPerformance } from "@/business/entities/performance/portfolio-performance.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * Represents the repository contract for persisting and retrieving
 * `PortfolioPerformance` entities.
 *
 * An `IPortfolioPerformance`:
 * - persists performances through {@link IPortfolioPerformance.save}.
 * - retrieves performances by id, portfolio id, date, and the latest
 *   entry of a portfolio.
 * - removes performances by id.
 *
 * Implementations are responsible for mapping database rows to
 * `PortfolioPerformance` entities and back.
 */
export interface IPortfolioPerformance {
  /**
   * Retrieves the performance with the provided id.
   *
   * @param id - The unique identifier of the performance.
   * @returns A promise resolving to the `PortfolioPerformance` or
   * `null` when not found.
   */
  findById(id: EntityId): Promise<PortfolioPerformance | null>;

  /**
   * Retrieves all performances belonging to the provided portfolio id.
   *
   * @param portfolioId - The unique identifier of the portfolio.
   * @returns A promise resolving to the `PortfolioPerformance` entries
   * or an empty array when there are no matches.
   */
  findAllByPortfolioId(portfolioId: EntityId): Promise<PortfolioPerformance[]>;

  /**
   * Retrieves the performance of the provided portfolio on the
   * provided date.
   *
   * @param portfolioId - The unique identifier of the portfolio.
   * @param date - The date of the performance.
   * @returns A promise resolving to the `PortfolioPerformance` or
   * `null` when not found.
   */
  findByPortfolioIdAndDate(
    portfolioId: EntityId,
    date: Date,
  ): Promise<PortfolioPerformance | null>;

  /**
   * Retrieves the latest performance of the provided portfolio.
   *
   * @param portfolioId - The unique identifier of the portfolio.
   * @returns A promise resolving to the `PortfolioPerformance` with
   * the latest date or `null` when there is no performance.
   */
  findLatestByPortfolioId(
    portfolioId: EntityId,
  ): Promise<PortfolioPerformance | null>;

  /**
   * Persists the provided performance.
   *
   * When the performance has no id, the implementation inserts a new
   * record and the persisted `PortfolioPerformance` (with its
   * generated id) is returned; otherwise the existing record is
   * updated.
   *
   * @param portfolioPerformance - The performance to persist.
   * @returns A promise resolving to the persisted `PortfolioPerformance`.
   */
  save(
    portfolioPerformance: PortfolioPerformance,
  ): Promise<PortfolioPerformance>;

  /**
   * Removes the performance with the provided id.
   *
   * @param id - The unique identifier of the performance.
   * @returns A promise that resolves when the performance is removed.
   */
  delete(id: EntityId): Promise<void>;
}
