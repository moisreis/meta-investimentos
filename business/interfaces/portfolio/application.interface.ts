import type { Application } from "@/business/entities/portfolio/application.entity";

/**
 * Represents the repository contract for persisting and retrieving
 * `Application` entities.
 *
 * An `IApplication`:
 * - persists applications through {@link IApplication.save}.
 * - retrieves applications by id, position id, and date period.
 * - removes applications by id.
 *
 * Implementations are responsible for mapping database rows to
 * `Application` entities and back.
 */
export interface IApplication {
  // --------------------------------------
  // QUERY METHODS
  // --------------------------------------

  /**
   * Retrieves the application with the provided id.
   *
   * @param id - The unique identifier of the application.
   * @returns A promise resolving to the `Application` or `null` when not
   * found.
   */
  findById(id: string): Promise<Application | null>;

  /**
   * Retrieves all applications belonging to the provided position id.
   *
   * @param positionId - The unique identifier of the position.
   * @returns A promise resolving to the `Application` entries or an empty
   * array when there are no matches.
   */
  findAllByPositionId(positionId: string): Promise<Application[]>;

  /**
   * Retrieves all applications of the provided position whose date
   * falls within the provided period, inclusive.
   *
   * @param positionId - The unique identifier of the position.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   * @returns A promise resolving to the `Application` entries or an empty
   * array when there are no matches.
   */
  findAllByPositionIdInPeriod(
    positionId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Application[]>;

  // --------------------------------------
  // COMMAND METHODS
  // --------------------------------------

  /**
   * Persists the provided application.
   *
   * When the application has no id, the implementation inserts a new
   * record and the persisted `Application` (with its generated id) is
   * returned; otherwise the existing record is updated.
   *
   * @param application - The application to persist.
   * @returns A promise resolving to the persisted `Application`.
   */
  save(application: Application): Promise<Application>;

  /**
   * Removes the application with the provided id.
   *
   * @param id - The unique identifier of the application.
   * @returns A promise that resolves when the application is removed.
   */
  delete(id: string): Promise<void>;
}
