import type { CvmImport } from "@/business/entities/cvm/cvm-import.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * Represents the repository contract for persisting and retrieving
 * {@link CvmImport} summary records.
 *
 * An `ICvmImport`:
 * - persists import summaries through {@link ICvmImport.save}.
 * - queries import summaries for data-health reporting.
 *
 * Implementations are responsible for mapping database rows to
 * `CvmImport` entities and back.
 */
export interface ICvmImport {
  /**
   * Persists the provided import summary.
   *
   * @param cvmImport - The import summary to persist.
   * @returns A promise resolving to the persisted `CvmImport`.
   */
  save(cvmImport: CvmImport): Promise<CvmImport>;

  /**
   * Retrieves the most recent import summary.
   *
   * @returns A promise resolving to the latest `CvmImport` or `null`
   *   when no import has been recorded.
   */
  findLatest(): Promise<CvmImport | null>;

  /**
   * Retrieves the import summaries that ended in a failed state.
   *
   * @param limit - The maximum number of failed imports to return.
   * @returns A promise resolving to the matching `CvmImport` entities.
   */
  findFailed(limit?: number): Promise<CvmImport[]>;

  /**
   * Retrieves the import summary with the provided id.
   *
   * @param id - The unique identifier of the import summary.
   * @returns A promise resolving to the `CvmImport` or `null` when not
   *   found.
   */
  findById(id: EntityId): Promise<CvmImport | null>;
}
