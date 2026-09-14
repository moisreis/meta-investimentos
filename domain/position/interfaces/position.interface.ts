import type { Position } from "@domain/position/entities/position.entity";
import type { EntityId } from "@/value-objects";

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
   * @returns The entry or `null`.
   *
   * @example
   * const POS = await POSITION_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<Position | null>;

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
   * @returns The matching entries.
   *
   * @example
   * const POSS = await POSITION_REPO.findAllByPortfolioId(PF_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByPortfolioId(portfolioId: EntityId): Promise<Position[]>;

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
   * @param portfolioIds - The unique identifiers of the portfolios.
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
  findAllByPortfolioIds(portfolioIds: EntityId[]): Promise<Position[]>;

  /**
   * @summary
   * Retrieves all positions holding the provided funds.
   *
   * @remarks
   * Fund ids are stored as strings. Returns an empty
   * array when no positions match.
   *
   * @explanation
   * Use this method to list positions holding any of the
   * given funds. Returns an empty array for no matches.
   *
   * @param fundIds - The unique identifiers of the funds.
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
  findAllByFundIds(fundIds: string[]): Promise<Position[]>;

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
    fundId: EntityId,
  ): Promise<Position | null>;

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
   * @returns The persisted entry.
   *
   * @example
   * const POS = await POSITION_REPO.save(NEW_POS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(position: Position): Promise<Position>;

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
   * @returns Resolves when removed.
   *
   * @example
   * await POSITION_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>;
}