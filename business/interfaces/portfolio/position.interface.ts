import type { Position } from "@/business/entities/portfolio/position.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

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
  /**
   * Retrieves the position with the provided id.
   *
   * @param id - The unique identifier of the position.
   * @returns A promise resolving to the `Position` or `null` when not
   * found.
   */
  findById(id: EntityId): Promise<Position | null>;

  /**
   * Retrieves all positions belonging to the provided portfolio id.
   *
   * @param portfolioId - The unique identifier of the portfolio.
   * @returns A promise resolving to the `Position` entries or an empty
   * array when there are no matches.
   */
  findAllByPortfolioId(portfolioId: EntityId): Promise<Position[]>;

  /**
   * Retrieves all positions belonging to any of the provided portfolio
   * ids.
   *
   * @param portfolioIds - The unique identifiers of the portfolios.
   * @returns A promise resolving to the `Position` entries or an empty
   * array when there are no matches.
   */
  findAllByPortfolioIds(portfolioIds: EntityId[]): Promise<Position[]>;

  /**
   * Retrieves all positions holding any of the provided funds.
   *
   * @param fundIds - The unique identifiers of the funds.
   * @returns A promise resolving to the matching `Position` entries or an
   * empty array when there are no matches.
   */
  findAllByFundIds(fundIds: string[]): Promise<Position[]>;

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
    portfolioId: EntityId,
    fundId: EntityId,
  ): Promise<Position | null>;

  /**
   * Persists the provided position.
   *
   * When the position has no id, the implementation inserts a new
   * record and the persisted `Position` (with its generated id) is
   * returned; otherwise the existing record is updated.
   *
   * Updates are protected by optimistic locking: an update succeeds
   * only when the persisted version matches the stored version, and it
   * bumps the stored version.
   *
   * @param position - The position to persist.
   * @returns A promise resolving to the persisted `Position`.
   *
   * @throws {NotFoundError} If the position to update does not exist.
   * @throws {ConcurrencyError} If the persisted version is stale.
   */
  save(position: Position): Promise<Position>;

  /**
   * Removes the position with the provided id.
   *
   * @param id - The unique identifier of the position.
   * @returns A promise that resolves when the position is removed.
   */
  delete(id: EntityId): Promise<void>;
}
