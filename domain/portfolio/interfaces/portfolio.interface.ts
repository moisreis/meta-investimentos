import type { Portfolio } from "@domain/portfolio/entities/portfolio.entity"
import type { EntityId } from "@/value-objects"

/**
 * @summary
 * Defines the repository contract for `Portfolio` entities.
 *
 * @remarks
 * An `IPortfolio` persists, retrieves, and removes portfolios.
 * Supports lookup by id and user id.
 *
 * @explanation
 * Use this interface to implement data access for portfolios.
 * Persistence implementations map rows to `Portfolio` entities.
 *
 * @example
 * const PTF = await PORTFOLIO_REPO.findById(ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface IPortfolio {
  /**
   * @summary
   * Retrieves the portfolio with the provided id.
   *
   * @remarks
   * Returns null when no portfolio matches.
   *
   * @explanation
   * Use this method to look up a single portfolio by its
   * unique identifier. Callers check null for existence.
   *
   * @param id - The unique identifier of the portfolio.
   * @returns The entry or `null`.
   *
   * @example
   * const PTF = await PORTFOLIO_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<Portfolio | null>

  /**
   * @summary
   * Retrieves the portfolios with the provided ids.
   *
   * @remarks
   * Returns an empty array when no portfolios match.
   *
   * @explanation
   * Use this method to look up portfolios by their unique
   * identifiers. Returns an empty array for no matches.
   *
   * @param ids - The unique identifiers of the portfolios.
   * @returns The matching entries.
   *
   * @example
   * const PTFS = await PORTFOLIO_REPO.findAllByIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  findAllByIds(ids: EntityId[]): Promise<Portfolio[]>

  /**
   * @summary
   * Retrieves all portfolios belonging to the provided user.
   *
   * @remarks
   * Returns an empty array when no portfolios match.
   *
   * @explanation
   * Use this method to list all portfolios linked to a
   * user. Returns an empty array for no matches.
   *
   * @param userId - The unique identifier of the user.
   * @returns The matching entries.
   *
   * @example
   * const PTFS = await PORTFOLIO_REPO.findAllByUserId(USER_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByUserId(userId: EntityId): Promise<Portfolio[]>

  /**
   * @summary
   * Retrieves all portfolios, optionally paginated.
   *
   * @remarks
   * Use limit and offset to paginate results.
   *
   * @explanation
   * Use this method to list all portfolios. Pass options
   * to paginate when the dataset is large.
   *
   * @param options - The pagination options.
   * @param options.limit - Maximum portfolios to return.
   * @param options.offset - Starting offset.
   * @returns The matching entries.
   *
   * @example
   * const PTFS = await PORTFOLIO_REPO.findAll();
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAll(options?: { limit?: number; offset?: number }): Promise<Portfolio[]>

  /**
   * @summary
   * Persists the provided portfolio.
   *
   * @remarks
   * Inserts a new record when the portfolio has no id;
   * otherwise updates the existing record.
   *
   * @explanation
   * Use this method to create or update a portfolio.
   * The persisted entity with its id is returned.
   *
   * @param portfolio - The portfolio to persist.
   * @returns The persisted entry.
   *
   * @example
   * const PTF = await PORTFOLIO_REPO.save(NEW_PTF);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(portfolio: Portfolio): Promise<Portfolio>

  /**
   * @summary
   * Removes the portfolio with the provided id.
   *
   * @remarks
   * Resolves when the portfolio is removed.
   *
   * @explanation
   * Use this method to delete a portfolio record.
   * The promise resolves once the operation completes.
   *
   * @param id - The unique identifier of the portfolio.
   * @returns Resolves when removed.
   *
   * @example
   * await PORTFOLIO_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>
}
