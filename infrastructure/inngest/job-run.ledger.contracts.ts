import type { JobRunResult } from "@/business/entities/inngest/job-run.entity";
import { JobRun } from "@/business/entities/inngest/job-run.entity";
import type { IJobRunRepository } from "@/business/interfaces/inngest/job-run.interface";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * The input required to open a new durable job run.
 */
export interface StartJobRunInput {
  /**
   * The logical name of the job (for example `cvm-import`).
   */
  jobName: string;

  /**
   * The name of the event that triggered the run.
   */
  eventType: string;

  /**
   * The payload of the triggering event.
   */
  eventPayload: Record<string, unknown>;

  /**
   * The idempotency key that de-duplicated the triggering event.
   */
  idempotencyKey?: string;

  /**
   * The maximum retry count configured for the run.
   */
  maxRetries?: number;
}

/**
 * A reference to a failed run that the retry sweep can re-fire.
 */
export interface FailedRunReference {
  eventType: string;
  eventPayload: Record<string, unknown>;
}

/**
 * The durable job-run ledger used by the *Inngest* workers.
 *
 * A `IJobRunLedger` records the lifecycle of every run — open, progress,
 * complete and fail — against the {@link IJobRunRepository} backing the
 * `job_run` table.
 */
export interface IJobRunLedger {
  /**
   * Opens a new durable run record.
   *
   * @param input - The run details.
   * @returns A reference carrying the persisted run id.
   */
  start(input: StartJobRunInput): Promise<{ runId: string }>;

  /**
   * Updates the progress percentage of an open run.
   *
   * @param runId - The id of the run.
   * @param progress - The progress percentage (0 to 100).
   */
  progress(runId: string, progress: number): Promise<void>;

  /**
   * Marks a run as completed with a JSON result summary.
   *
   * @param runId - The id of the run.
   * @param result - The serializable result summary.
   */
  complete(runId: string, result: JobRunResult): Promise<void>;

  /**
   * Marks a run as failed with the failure details.
   *
   * @param runId - The id of the run.
   * @param error - The failure to record.
   */
  fail(runId: string, error: Error): Promise<void>;

  /**
   * Retrieves failed runs eligible for the retry sweep.
   *
   * @param limit - The maximum number of failures to return.
   * @returns A promise resolving to the failed run references.
   */
  findFailed(limit?: number): Promise<FailedRunReference[]>;
}

/**
 * Creates an {@link IJobRunLedger} backed by the provided job-run
 * repository.
 *
 * @param repository - The repository persisting `job_run` records.
 * @returns The ledger instance.
 */
export function createJobRunLedger(
  repository: IJobRunRepository,
): IJobRunLedger {
  return {
    async start(input) {
      const RUN = await repository.save(
        JobRun.create({
          jobName: input.jobName,
          status: "RUNNING",
          eventType: input.eventType,
          eventPayload: input.eventPayload,
          idempotencyKey: input.idempotencyKey,
          maxRetries: input.maxRetries,
        }),
      );

      return { runId: RUN.id?.toString() ?? "" };
    },

    async progress(runId, progress) {
      const RUN = await requireRun(repository, runId);
      await repository.save(RUN.markProgress(progress));
    },

    async complete(runId, result) {
      const RUN = await requireRun(repository, runId);
      await repository.save(RUN.complete(result));
    },

    async fail(runId, error) {
      const RUN = await requireRun(repository, runId);
      await repository.save(
        RUN.fail({
          message: error.message ?? "Job failed.",
          stack: error.stack,
        }),
      );
    },

    async findFailed(limit = 100) {
      const RUNS = await repository.findByStatus("FAILED", limit);
      return RUNS.map((run) => ({
        eventType: run.eventType,
        eventPayload: run.eventPayload,
      }));
    },
  };
}

/**
 * Loads the run with the provided id from the repository.
 *
 * @param repository - The repository to load from.
 * @param runId - The id of the run.
 * @returns A promise resolving to the `JobRun`.
 *
 * @throws {Error} If no run matches the provided id.
 */
async function requireRun(
  repository: IJobRunRepository,
  runId: string,
): Promise<JobRun> {
  const RUN = await repository.findById(runId as EntityId);
  if (!RUN) {
    throw new Error(`Job run ${runId} was not found.`);
  }
  return RUN;
}
