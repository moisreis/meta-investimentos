import { EntityId } from "@/business/value-objects/entity-id.vo";
import { ValidationError } from "@/shared/errors";

/**
 * The set of lifecycle states a {@link JobRun} can be in.
 *
 * - `PENDING` — the run was scheduled but its work has not started.
 * - `RUNNING` — the work is in progress.
 * - `COMPLETED` — the work finished and recorded a result summary.
 * - `FAILED` — the work exhausted its retries or failed irrecoverably.
 * - `CANCELLED` — the work was cancelled before finishing.
 */
export type JobRunStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

/**
 * The JSON-serializable summary a {@link JobRun} records on completion.
 */
export type JobRunResult = Record<string, unknown>;

/**
 * The failure details a {@link JobRun} records when it fails.
 */
export interface JobRunFailure {
  message: string;
  stack?: string;
}

/**
 * The properties required to create a {@link JobRun} ledger record.
 */
export interface JobRunProps {
  jobName: string;
  status: JobRunStatus;
  eventType: string;
  eventPayload: Record<string, unknown>;
  idempotencyKey?: string;
  progress?: number;
  resultSummary?: JobRunResult;
  errorMessage?: string;
  errorStack?: string;
  retriesRemaining?: number;
  maxRetries?: number;
  startedAt?: Date;
  finishedAt?: Date;
  createdAt?: Date;
}

/**
 * Represents the durable record of a single job run executed through
 * *Inngest*.
 *
 * A `JobRun`:
 * - identifies which job ran and which triggering event started it.
 * - keeps the idempotency key that de-duplicated the triggering event.
 * - tracks status, progress, retries and lifecycle timestamps.
 * - records the JSON result summary or the failure details.
 *
 * `JobRun` instances are immutable; every state transition produces a
 * new instance carrying the same id.
 */
export class JobRun {
  private readonly _id?: EntityId;
  private readonly props: {
    jobName: string;
    status: JobRunStatus;
    eventType: string;
    eventPayload: Record<string, unknown>;
    idempotencyKey: string | undefined;
    progress: number;
    resultSummary: JobRunResult | undefined;
    errorMessage: string | undefined;
    errorStack: string | undefined;
    retriesRemaining: number;
    maxRetries: number;
    startedAt: Date;
    finishedAt: Date | undefined;
    createdAt: Date;
  };

  /**
   * Returns the unique identifier of the run.
   */
  get id(): EntityId | undefined {
    return this._id;
  }

  /**
   * Returns the name of the job that ran.
   */
  get jobName(): string {
    return this.props.jobName;
  }

  /**
   * Returns the lifecycle status of the run.
   */
  get status(): JobRunStatus {
    return this.props.status;
  }

  /**
   * Returns the name of the event that triggered the run.
   */
  get eventType(): string {
    return this.props.eventType;
  }

  /**
   * Returns the payload of the triggering event.
   */
  get eventPayload(): Record<string, unknown> {
    return this.props.eventPayload;
  }

  /**
   * Returns the idempotency key that de-duplicated the triggering event,
   * when one was configured.
   */
  get idempotencyKey(): string | undefined {
    return this.props.idempotencyKey;
  }

  /**
   * Returns the progress percentage of the run (0 to 100).
   */
  get progress(): number {
    return this.props.progress;
  }

  /**
   * Returns the JSON result summary, when the run completed.
   */
  get resultSummary(): JobRunResult | undefined {
    return this.props.resultSummary;
  }

  /**
   * Returns the failure message, when the run failed.
   */
  get errorMessage(): string | undefined {
    return this.props.errorMessage;
  }

  /**
   * Returns the failure stack trace, when the run failed.
   */
  get errorStack(): string | undefined {
    return this.props.errorStack;
  }

  /**
   * Returns the number of retries remaining for the run.
   */
  get retriesRemaining(): number {
    return this.props.retriesRemaining;
  }

  /**
   * Returns the maximum number of retries configured for the run.
   */
  get maxRetries(): number {
    return this.props.maxRetries;
  }

  /**
   * Returns the timestamp the run started.
   */
  get startedAt(): Date {
    return this.props.startedAt;
  }

  /**
   * Returns the timestamp the run finished, when it has.
   */
  get finishedAt(): Date | undefined {
    return this.props.finishedAt;
  }

  /**
   * Returns the creation timestamp of the run record.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Creates a `JobRun`.
   *
   * The constructor is private to ensure all instances are created
   * through {@link JobRun.create} and therefore satisfy the ledger's
   * invariants.
   */
  private constructor(props: JobRunProps, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze({
      jobName: props.jobName,
      status: props.status,
      eventType: props.eventType,
      eventPayload: props.eventPayload,
      idempotencyKey: props.idempotencyKey,
      progress: props.progress ?? 0,
      resultSummary: props.resultSummary,
      errorMessage: props.errorMessage,
      errorStack: props.errorStack,
      retriesRemaining: props.retriesRemaining ?? 0,
      maxRetries: props.maxRetries ?? 0,
      startedAt: props.startedAt ?? new Date(),
      finishedAt: props.finishedAt,
      createdAt: props.createdAt ?? new Date(),
    });
  }

  /**
   * Creates a valid `JobRun` ledger record.
   *
   * @param props - The properties required to create the run.
   * @param id - The unique identifier of the run.
   * @returns A valid `JobRun` instance.
   *
   * @throws {ValidationError} If `props.jobName` is blank.
   * @throws {ValidationError} If `props.eventType` is blank.
   * @throws {ValidationError} If `props.status` is not a known status.
   * @throws {ValidationError} If `props.progress` is outside 0..100.
   */
  public static create(props: JobRunProps, id?: string): JobRun {
    if (!props.jobName || props.jobName.trim() === "") {
      throw new ValidationError("JobRun must have a jobName.");
    }
    if (!props.eventType || props.eventType.trim() === "") {
      throw new ValidationError("JobRun must have an eventType.");
    }
    if (!props.eventPayload || typeof props.eventPayload !== "object") {
      throw new ValidationError("JobRun must have an eventPayload object.");
    }
    if (!isJobRunStatus(props.status)) {
      throw new ValidationError(
        `JobRun status must be one of PENDING, RUNNING, COMPLETED, FAILED, CANCELLED.`,
      );
    }
    if (
      props.progress !== undefined &&
      (props.progress < 0 || props.progress > 100)
    ) {
      throw new ValidationError(
        `JobRun progress must be between 0 and 100, got ${props.progress}.`,
      );
    }

    return new JobRun(props, id);
  }

  /**
   * Marks the run as started (RUNNING).
   *
   * @returns A new `JobRun` instance in the `RUNNING` state.
   */
  public start(): JobRun {
    return this.transition({ status: "RUNNING", startedAt: new Date() });
  }

  /**
   * Updates the progress percentage of the run.
   *
   * @param progress - The progress percentage (0 to 100).
   * @returns A new `JobRun` instance with the updated progress.
   *
   * @throws {ValidationError} If `progress` is outside 0..100.
   */
  public markProgress(progress: number): JobRun {
    if (progress < 0 || progress > 100) {
      throw new ValidationError(
        `JobRun progress must be between 0 and 100, got ${progress}.`,
      );
    }
    return this.transition({ progress });
  }

  /**
   * Marks the run as completed with a JSON result summary.
   *
   * @param result - The serializable result summary.
   * @returns A new `JobRun` instance in the `COMPLETED` state.
   */
  public complete(result: JobRunResult): JobRun {
    return this.transition({
      status: "COMPLETED",
      resultSummary: result,
      finishedAt: new Date(),
    });
  }

  /**
   * Marks the run as failed with the failure details.
   *
   * @param failure - The failure message and optional stack trace.
   * @returns A new `JobRun` instance in the `FAILED` state.
   */
  public fail(failure: JobRunFailure): JobRun {
    return this.transition({
      status: "FAILED",
      errorMessage: failure.message,
      errorStack: failure.stack,
      finishedAt: new Date(),
    });
  }

  /**
   * Marks the run as cancelled.
   *
   * @returns A new `JobRun` instance in the `CANCELLED` state.
   */
  public cancel(): JobRun {
    return this.transition({ status: "CANCELLED", finishedAt: new Date() });
  }

  /**
   * Produces a new `JobRun` that shares this run's id and merges the
   * provided property updates over the current values.
   *
   * @param update - The properties to change.
   * @returns A new `JobRun` instance.
   */
  private transition(update: Partial<JobRunProps>): JobRun {
    return new JobRun(
      {
        jobName: this.props.jobName,
        status: this.props.status,
        eventType: this.props.eventType,
        eventPayload: this.props.eventPayload,
        idempotencyKey: this.props.idempotencyKey,
        progress: this.props.progress,
        resultSummary: this.props.resultSummary,
        errorMessage: this.props.errorMessage,
        errorStack: this.props.errorStack,
        retriesRemaining: this.props.retriesRemaining,
        maxRetries: this.props.maxRetries,
        startedAt: this.props.startedAt,
        finishedAt: this.props.finishedAt,
        createdAt: this.props.createdAt,
        ...update,
      },
      this._id?.toString(),
    );
  }

  /**
   * Determines whether this `JobRun` represents the same run as the
   * provided instance, based on referential equality and the unique id.
   *
   * @param object - The run to compare against.
   * @returns `true` when both runs share the same id; otherwise, `false`.
   */
  public equals(object?: JobRun | null): boolean {
    if (object == null) {
      return false;
    }
    if (this === object) {
      return true;
    }
    if (!this._id || !object._id) {
      return false;
    }
    return this._id === object._id;
  }
}

/**
 * Determines whether a value is a known {@link JobRunStatus}.
 *
 * @param value - The value to check.
 * @returns `true` when the value is one of the supported statuses.
 */
function isJobRunStatus(value: unknown): value is JobRunStatus {
  return (
    value === "PENDING" ||
    value === "RUNNING" ||
    value === "COMPLETED" ||
    value === "FAILED" ||
    value === "CANCELLED"
  );
}
