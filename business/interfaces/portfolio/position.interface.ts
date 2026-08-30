import type { Position } from "@/business/entities/portfolio/position.entity";

/**
 * Represents the repository contract for persisting and retrieving
 * `Position` entities.
 *
 * An `IPosition`:
 * - persists positions through {@link IPosition.save}.
 * - retrieves positions by id, portfolio id, and fund id.
 * - removes positions by id.
 *
 * Implementations are responsible for mapping database rows to
 * `Position` entities and back.
 */
export interface IPosition {
  // --------------------------------------
  // QUERY METHODS
  // --------------------------------------

  /**
   * Retrieves the position with the provided id.
   *
   * @param id - The unique identifier of the position.
   * @returns A promise resolving to the `Position` or `null` when not
   * found.
   */
  findById(id: string): Promise<Position | null>;

  /**
   * Retrieves all positions belonging to the provided portfolio id.
   *
   * @param portfolioId - The unique identifier of the portfolio.
   * @returns A promise resolving to the `Position` entries or an empty
   * array when there are no matches.
   */
  findAllByPortfolioId(portfolioId: string): Promise<Position[]>;

  /**
   * Retrieves the position of the provided fund within the provided
   * portfolio.
   *
   * @param portfolioId - The unique identifier of the portfolio.
   * @param fundId - The unique identifier of the fund.
   * @returns A promise resolving to the `Position` or `null` when not
   * found.
   */
  findByPortfolioIdAndFundId(
    portfolioId: string,
    fundId: string,
  ): Promise<Position | null>;

  // --------------------------------------
  // COMMAND METHODS
  // --------------------------------------

  /**
   * Persists the provided position.
   *
   * When the position has no id, the implementation inserts a new
   * record and the persisted `Position` (with its generated id) is
   * returned; otherwise the existing record is updated.
   *
   * @param position - The position to persist.
   * @returns A promise resolving to the persisted `Position`.
   */
  save(position: Position): Promise<Position>;

  /**
   * Removes the position with the provided id.
   *
   * @param id - The unique identifier of the position.
   * @returns A promise that resolves when the position is removed.
   */
  delete(id: string): Promise<void>;
}
