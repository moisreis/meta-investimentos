import type { Application } from "@domain/application/entities/application.entity";
import type { EntityId } from "@/value-objects";

/**
 * @summary
 * Defines the repository contract for `Application` entities.
 *
 * @remarks
 * An `IApplication` persists, retrieves, and removes applications.
 * Supports lookup by id, position id, and date period.
 *
 * @explanation
 * Use this interface to implement data access for applications.
 * Persistence implementations map rows to `Application` entities.
 *
 * @example
 * const APP = await APP_REPO.findById(ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface IApplication {
  /**
   * @summary
   * Retrieves the application with the provided id.
   *
   * @remarks
   * Returns null when no application matches.
   *
   * @explanation
   * Use this method to look up a single application by
   * its unique identifier. Callers check null for existence.
   *
   * @param id - The unique identifier of the application.
   * @returns The entry or `null`.
   *
   * @example
   * const APP = await APP_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<Application | null>;

  /**
   * @summary
   * Retrieves all applications of the provided position.
   *
   * @remarks
   * Returns an empty array when no applications match.
   *
   * @explanation
   * Use this method to list applications linked to a
   * position. Returns an empty array for no matches.
   *
   * @param positionId - The unique identifier of the position.
   * @returns The matching entries.
   *
   * @example
   * const APPS = await APP_REPO.findAllByPositionId(POS_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByPositionId(positionId: EntityId): Promise<Application[]>;

  /**
   * @summary
   * Retrieves all applications of the position dated within
   * the provided period.
   *
   * @remarks
   * The period is inclusive of both dates. Returns an
   * empty array when no applications match.
   *
   * @explanation
   * Use this method to list applications inside a date
   * range. Includes applications on both period edges.
   *
   * @param positionId - The unique identifier of the position.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   * @returns The matching entries.
   *
   * @example
   * const APPS = await APP_REPO
   *   .findAllByPositionIdInPeriod(POS_ID, START, END);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByPositionIdInPeriod(
    positionId: EntityId,
    startDate: Date,
    endDate: Date,
  ): Promise<Application[]>;

  /**
   * @summary
   * Persists the provided application.
   *
   * @remarks
   * Inserts a new record when the application has no id;
   * otherwise updates the existing record.
   *
   * @explanation
   * Use this method to create or update an application.
   * The persisted entity with its id is returned.
   *
   * @param application - The application to persist.
   * @returns The persisted entry.
   *
   * @example
   * const APP = await APP_REPO.save(NEW_APP);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(application: Application): Promise<Application>;

  /**
   * @summary
   * Removes the application with the provided id.
   *
   * @remarks
   * Resolves when the application is removed.
   *
   * @explanation
   * Use this method to delete an application record.
   * The promise resolves once the operation completes.
   *
   * @param id - The unique identifier of the application.
   * @returns Resolves when removed.
   *
   * @example
   * await APP_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>;
}