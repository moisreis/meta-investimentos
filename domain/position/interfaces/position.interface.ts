import type { Position } from "@domain/position/entities/position.entity"
import type { EntityId } from "@/value-objects"

// Count of position rows linked to a portfolio.
export interface PortfolioRowCount {
  // The unique identifier of the portfolio.
  portfolioId: EntityId

  // The number of linked position rows.
  count: number
}

// Count of position rows linked to a fund.
export interface FundRowCount {
  // The unique identifier of the fund.
  fundId: EntityId

  // The number of linked position rows.
  count: number
}

/**
 * @summary
 * Defines the repository contract for `Position` entities.
 *
 * @remarks
 * An `IPosition` persists, retrieves, and removes positions.
 * Supports lookup by id, portfolio id, and fund id.
 *
 * @explanation
 * Use this interface to implement data access for positions.
 * Persistence implementations map rows to `Position` entities.
 *
 * @example
 * const POS = await POSITION_REPO.findById(ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface IPosition {
  /**
   * @summary
   * Retrieves the position with the provided id.
   *
   * @remarks
   * Returns null when no position matches.
   *
   * @explanation
   * Use this method to look up a single position by its
   * unique identifier. Callers check null for existence.
   *
   * @param id - The unique identifier of the position.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const POS = await POSITION_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<Position | null>

  /**
   * @summary
   * Retrieves all positions of the provided portfolio.
   *
   * @remarks
   * Returns an empty array when no positions match.
   *
   * @explanation
   * Use this method to list positions linked to a
   * portfolio. Returns an empty array for no matches.
   *
   * @param portfolioId - The unique identifier of the portfolio.
   *
   * @returns The matching entries.
   *
   * @example
   * const POSS = await POSITION_REPO
   *   .findAllByPortfolioId(PF_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByPortfolioId(
    portfolioId: EntityId
  ): Promise<Position[]>

  /**
   * @summary
   * Retrieves all positions of the provided portfolios.
   *
   * @remarks
   * Returns an empty array when no positions match.
   *
   * @explanation
   * Use this method to list positions linked to several
   * portfolios. Returns an empty array for no matches.
   *
   * @param portfolioIds - The identifiers of the portfolios.
   *
   * @returns The matching entries.
   *
   * @example
   * const POSS = await POSITION_REPO
   *   .findAllByPortfolioIds(PORTFOLIO_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByPortfolioIds(
    portfolioIds: EntityId[]
  ): Promise<Position[]>

  /**
   * @summary
   * Counts the position rows held per provided portfolio.
   *
   * @remarks
   * Returns an entry per matched portfolio and an empty
   * array when the input is empty. Because the `(portfolio,
   * fund)` pair is unique, the count equals the number of
   * distinct funds held by the portfolio.
   *
   * @explanation
   * Use this method to tally positions through a single
   * grouped query instead of hydrating every row.
   *
   * @param portfolioIds - The identifiers of the portfolios.
   *
   * @returns The position count per portfolio.
   *
   * @example
   * const COUNTS = await POSITION_REPO
   *   .countByPortfolioIds(PORTFOLIO_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  countByPortfolioIds(
    portfolioIds: EntityId[]
  ): Promise<PortfolioRowCount[]>

  /**
   * @summary
   * Counts the position rows held per provided fund.
   *
   * @remarks
   * Returns an entry per matched fund and an empty
   * array when the input is empty. Because the
   * `(portfolio, fund)` pair is unique, the count
   * equals the number of portfolios holding the fund.
   *
   * @explanation
   * Use this method to tally positions through a
   * single grouped query instead of hydrating every
   * row.
   *
   * @param fundIds - The identifiers of the funds.
   *
   * @returns The position count per fund.
   *
   * @example
   * const COUNTS = await POSITION_REPO
   *   .countByFundIds(FUND_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  countByFundIds(fundIds: EntityId[]): Promise<FundRowCount[]>

  /**
   * @summary
   * Retrieves all positions holding the provided funds.
   *
   * @remarks
   * Returns an empty array when no positions match.
   *
   * @explanation
   * Use this method to list positions holding any of the
   * given funds. Returns an empty array for no matches.
   *
   * @param fundIds - The unique identifiers of the funds.
   *
   * @returns The matching entries.
   *
   * @example
   * const POSS = await POSITION_REPO
   *   .findAllByFundIds(FUND_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByFundIds(fundIds: EntityId[]): Promise<Position[]>

  /**
   * @summary
   * Retrieves the position of the fund in the portfolio.
   *
   * @remarks
   * Returns null when no position matches.
   *
   * @explanation
   * Use this method to find the position that holds a
   * specific fund inside a portfolio. Callers check null.
   *
   * @param portfolioId - The unique identifier of the portfolio.
   * @param fundId - The unique identifier of the fund.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const POS = await POSITION_REPO
   *   .findByPortfolioIdAndFundId(PF_ID, FUND_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findByPortfolioIdAndFundId(
    portfolioId: EntityId,
    fundId: EntityId
  ): Promise<Position | null>

  /**
   * @summary
   * Persists the provided position.
   *
   * @remarks
   * Inserts a new record when the position has no id;
   * otherwise updates the existing record. Updates are
   * protected by optimistic locking and may throw a
   * `NotFoundError` or a `ConcurrencyError`.
   *
   * @explanation
   * Use this method to create or update a position. The
   * persisted entity with its id is returned. The stored
   * version is bumped on every update.
   *
   * @param position - The position to persist.
   *
   * @returns The persisted entry.
   *
   * @example
   * const POS = await POSITION_REPO.save(NEW_POS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(position: Position): Promise<Position>

  /**
   * @summary
   * Removes the position with the provided id.
   *
   * @remarks
   * Resolves when the position is removed.
   *
   * @explanation
   * Use this method to delete a position record.
   * The promise resolves once the operation completes.
   *
   * @param id - The unique identifier of the position.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await POSITION_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>
}
