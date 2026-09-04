import type {
  JobRun,
  JobRunStatus,
} from "@/business/entities/inngest/job-run.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * Represents the repository contract for persisting and retrieving
 * {@link JobRun} durable records.
 *
 * An `IJobRunRepository`:
 * - persists run records through {@link IJobRunRepository.save}.
 * - retrieves runs by id, status, idempotency key and recency.
 *
 * Implementations are responsible for mapping database rows to `JobRun`
 * entities and back.
 */
export interface IJobRunRepository {
  /**
   * Persists the provided run record.
   *
   * When the run has no id, the implementation inserts a new record and
   * the persisted `JobRun` (with its generated id) is returned;
   * otherwise the existing record is updated.
   *
   * @param run - The run record to persist.
   * @returns A promise resolving to the persisted `JobRun`.
   */
  save(run: JobRun): Promise<JobRun>;

  /**
   * Retrieves the run record with the provided id.
   *
   * @param id - The unique identifier of the run.
   * @returns A promise resolving to the `JobRun` or `null` when not
   *   found.
   */
  findById(id: EntityId): Promise<JobRun | null>;

  /**
   * Retrieves the run record with the provided idempotency key.
   *
   * @param idempotencyKey - The idempotency key of the run.
   * @returns A promise resolving to the `JobRun` or `null` when not
   *   found.
   */
  findByIdempotencyKey(idempotencyKey: string): Promise<JobRun | null>;

  /**
   * Retrieves the most recent run records, newest first.
   *
   * @param limit - The maximum number of runs to return.
   * @returns A promise resolving to the matching `JobRun` entities.
   */
  findRecent(limit?: number): Promise<JobRun[]>;

  /**
   * Retrieves the run records in the provided status.
   *
   * @param status - The status to filter by.
   * @param limit - The maximum number of runs to return.
   * @returns A promise resolving to the matching `JobRun` entities.
   */
  findByStatus(status: JobRunStatus, limit?: number): Promise<JobRun[]>;
}
