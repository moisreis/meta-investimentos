import type { PositionPerformance } from "@domain/position-performance/entities/position-performance.entity";
import type { EntityId } from "@/value-objects";

/**
 * @summary
 * Defines the repository contract for `PositionPerformance`
 * entities.
 *
 * @remarks
 * An `IPositionPerformance` persists, retrieves, and removes
 * performances. Supports lookup by id, position id, date,
 * and the latest entry of a position.
 *
 * @explanation
 * Use this interface to implement data access for performances.
 * Persistence implementations map rows to `PositionPerformance`
 * entities.
 *
 * @example
 * const PERF = await PERF_REPO.findById(ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface IPositionPerformance {
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
   * @returns The entry or `null`.
   *
   * @example
   * const PERF = await PERF_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<PositionPerformance | null>;

  /**
   * @summary
   * Retrieves all performances of the provided position.
   *
   * @remarks
   * Returns an empty array when no performances match.
   *
   * @explanation
   * Use this method to list performances linked to a
   * position. Returns an empty array for no matches.
   *
   * @param positionId - The unique identifier of the position.
   * @returns The matching entries.
   *
   * @example
   * const PERFS = await PERF_REPO.findAllByPositionId(POS_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByPositionId(positionId: EntityId): Promise<PositionPerformance[]>;

  /**
   * @summary
   * Retrieves the performance of the position on the
   * provided date.
   *
   * @remarks
   * Returns null when no performance matches.
   *
   * @explanation
   * Use this method to find the performance of a position
   * on a given date. Callers check null for existence.
   *
   * @param positionId - The unique identifier of the position.
   * @param date - The date of the performance.
   * @returns The entry or `null`.
   *
   * @example
   * const PERF = await PERF_REPO
   *   .findByPositionIdAndDate(POS_ID, DATE);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findByPositionIdAndDate(
    positionId: EntityId,
    date: Date,
  ): Promise<PositionPerformance | null>;

  /**
   * @summary
   * Retrieves the latest performance of the position.
   *
   * @remarks
   * Returns null when the position has no performance.
   *
   * @explanation
   * Use this method to get the most recent performance of
   * a position. Callers check null for no data.
   *
   * @param positionId - The unique identifier of the position.
   * @returns The entry or `null`.
   *
   * @example
   * const PERF = await PERF_REPO
   *   .findLatestByPositionId(POS_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findLatestByPositionId(positionId: EntityId): Promise<PositionPerformance | null>;

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
   * @param positionPerformance - The performance to persist.
   * @returns The persisted entry.
   *
   * @example
   * const PERF = await PERF_REPO.save(NEW_PERF);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(positionPerformance: PositionPerformance): Promise<PositionPerformance>;

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
   * @returns Resolves when removed.
   *
   * @example
   * await PERF_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>;
}