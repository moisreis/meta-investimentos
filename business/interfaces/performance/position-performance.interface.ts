import type { PositionPerformance } from "@/business/entities/performance/position-performance.entity";

/**
 * Represents the repository contract for persisting and retrieving
 * `PositionPerformance` entities.
 *
 * An `IPositionPerformance`:
 * - persists performances through {@link IPositionPerformance.save}.
 * - retrieves performances by id, position id, date, and the latest
 *   entry of a position.
 * - removes performances by id.
 *
 * Implementations are responsible for mapping database rows to
 * `PositionPerformance` entities and back.
 */
export interface IPositionPerformance {
  // --------------------------------------
  // QUERY METHODS
  // --------------------------------------

  /**
   * Retrieves the performance with the provided id.
   *
   * @param id - The unique identifier of the performance.
   * @returns A promise resolving to the `PositionPerformance` or
   * `null` when not found.
   */
  findById(id: string): Promise<PositionPerformance | null>;

  /**
   * Retrieves all performances belonging to the provided position id.
   *
   * @param positionId - The unique identifier of the position.
   * @returns A promise resolving to the `PositionPerformance` entries
   * or an empty array when there are no matches.
   */
  findAllByPositionId(positionId: string): Promise<PositionPerformance[]>;

  /**
   * Retrieves the performance of the provided position on the
   * provided date.
   *
   * @param positionId - The unique identifier of the position.
   * @param date - The date of the performance.
   * @returns A promise resolving to the `PositionPerformance` or
   * `null` when not found.
   */
  findByPositionIdAndDate(
    positionId: string,
    date: Date,
  ): Promise<PositionPerformance | null>;

  /**
   * Retrieves the latest performance of the provided position.
   *
   * @param positionId - The unique identifier of the position.
   * @returns A promise resolving to the `PositionPerformance` with
   * the latest date or `null` when there is no performance.
   */
  findLatestByPositionId(
    positionId: string,
  ): Promise<PositionPerformance | null>;

  // --------------------------------------
  // COMMAND METHODS
  // --------------------------------------

  /**
   * Persists the provided performance.
   *
   * When the performance has no id, the implementation inserts a new
   * record and the persisted `PositionPerformance` (with its
   * generated id) is returned; otherwise the existing record is
   * updated.
   *
   * @param positionPerformance - The performance to persist.
   * @returns A promise resolving to the persisted `PositionPerformance`.
   */
  save(positionPerformance: PositionPerformance): Promise<PositionPerformance>;

  /**
   * Removes the performance with the provided id.
   *
   * @param id - The unique identifier of the performance.
   * @returns A promise that resolves when the performance is removed.
   */
  delete(id: string): Promise<void>;
}
