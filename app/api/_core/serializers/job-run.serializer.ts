import type { JobRun } from "@/business/entities/inngest/job-run.entity";

/**
 * The public envelope of a durable job-run ledger record.
 */
export interface JobRunApiDto {
  id: string | null;
  jobName: string;
  status: string;
  eventType: string;
  eventPayload: Record<string, unknown>;
  idempotencyKey: string | null;
  progress: number;
  resultSummary: Record<string, unknown> | null;
  errorMessage: string | null;
  errorStack: string | null;
  retriesRemaining: number;
  maxRetries: number;
  startedAt: string;
  finishedAt: string | null;
  createdAt: string;
}

/**
 * Maps a `JobRun` entity to its API representation.
 *
 * @param run - The job-run entity.
 * @returns The serializable DTO.
 */
export function toJobRunApiDto(run: JobRun): JobRunApiDto {
  return {
    id: run.id ? run.id.toString() : null,
    jobName: run.jobName,
    status: run.status,
    eventType: run.eventType,
    eventPayload: run.eventPayload,
    idempotencyKey: run.idempotencyKey ?? null,
    progress: run.progress,
    resultSummary: run.resultSummary ?? null,
    errorMessage: run.errorMessage ?? null,
    errorStack: run.errorStack ?? null,
    retriesRemaining: run.retriesRemaining,
    maxRetries: run.maxRetries,
    startedAt: run.startedAt.toISOString(),
    finishedAt: run.finishedAt?.toISOString() ?? null,
    createdAt: run.createdAt.toISOString(),
  };
}
