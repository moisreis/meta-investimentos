import type { Portfolio } from "@/business/entities/portfolio/portfolio.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * Represents the repository contract for persisting and retrieving
 * `Portfolio` entities.
 *
 * An `IPortfolio`:
 * - persists portfolios through {@link IPortfolio.save}.
 * - retrieves portfolios by id and user id.
 * - removes portfolios by id.
 *
 * Implementations are responsible for mapping database rows to
 * `Portfolio` entities and back.
 */
export interface IPortfolio {
  /**
   * Retrieves the portfolio with the provided id.
   *
   * @param id - The unique identifier of the portfolio.
   * @returns A promise resolving to the `Portfolio` or `null` when
   * not found.
   */
  findById(id: EntityId): Promise<Portfolio | null>;

  /**
   * Retrieves all portfolios belonging to the provided user id.
   *
   * @param userId - The unique identifier of the user.
   * @returns A promise resolving to the `Portfolio` entries or an empty
   * array when there are no matches.
   */
  findAllByUserId(userId: EntityId): Promise<Portfolio[]>;

  /**
   * Retrieves all portfolios, optionally paginated.
   *
   * @param options - The pagination options.
   * @param options.limit - The maximum number of portfolios to return.
   * @param options.offset - The offset from which to start returning
   * portfolios.
   * @returns A promise resolving to the collection of `Portfolio`
   * entities.
   */
  findAll(options?: { limit?: number; offset?: number }): Promise<Portfolio[]>;

  /**
   * Persists the provided portfolio.
   *
   * When the portfolio has no id, the implementation inserts a new
   * record and the persisted `Portfolio` (with its generated id) is
   * returned; otherwise the existing record is updated.
   *
   * @param portfolio - The portfolio to persist.
   * @returns A promise resolving to the persisted `Portfolio`.
   */
  save(portfolio: Portfolio): Promise<Portfolio>;

  /**
   * Removes the portfolio with the provided id.
   *
   * @param id - The unique identifier of the portfolio.
   * @returns A promise that resolves when the portfolio is removed.
   */
  delete(id: EntityId): Promise<void>;
}
