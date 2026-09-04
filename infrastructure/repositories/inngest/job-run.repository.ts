import { desc, eq } from "drizzle-orm";
import type { JobRunStatus } from "@/business/entities/inngest/job-run.entity";
import { JobRun } from "@/business/entities/inngest/job-run.entity";
import type { IJobRunRepository } from "@/business/interfaces/inngest/job-run.interface";
import type { EntityId } from "@/business/value-objects/entity-id.vo";
import { jobRun } from "@/infrastructure/database/schemas";

import type { DbClient } from "../types";

/**
 * Maps a `job_run` database row to a {@link JobRun} entity.
 */
function toEntity(row: typeof jobRun.$inferSelect): JobRun {
  return JobRun.create(
    {
      jobName: row.jobName,
      status: row.status as JobRunStatus,
      eventType: row.eventType,
      eventPayload: row.eventPayload as Record<string, unknown>,
      idempotencyKey: row.idempotencyKey ?? undefined,
      progress: row.progress,
      resultSummary: row.resultSummary as Record<string, unknown> | undefined,
      errorMessage: row.errorMessage ?? undefined,
      errorStack: row.errorStack ?? undefined,
      retriesRemaining: row.retriesRemaining,
      maxRetries: row.maxRetries,
      startedAt: row.startedAt,
      finishedAt: row.finishedAt ?? undefined,
      createdAt: row.createdAt,
    },
    row.id,
  );
}

/**
 * PostgreSQL-backed implementation of the {@link IJobRunRepository}
 * contract.
 *
 * Maps `job_run` rows to `JobRun` entities and back.
 */
export class JobRunRepository implements IJobRunRepository {
  private readonly db: DbClient;

  /**
   * Creates a `JobRunRepository` bound to the provided database client.
   *
   * @param db - The database client to run queries against.
   */
  constructor(db: DbClient) {
    this.db = db;
  }

  /**
   * @see {@link IJobRunRepository.save}
   */
  async save(run: JobRun): Promise<JobRun> {
    if (run.id) {
      const [row] = await this.db
        .update(jobRun)
        .set({
          jobName: run.jobName,
          status: run.status,
          eventType: run.eventType,
          eventPayload: run.eventPayload,
          idempotencyKey: run.idempotencyKey,
          progress: run.progress,
          resultSummary: run.resultSummary,
          errorMessage: run.errorMessage,
          errorStack: run.errorStack,
          retriesRemaining: run.retriesRemaining,
          maxRetries: run.maxRetries,
          startedAt: run.startedAt,
          finishedAt: run.finishedAt,
        })
        .where(eq(jobRun.id, run.id))
        .returning();

      return toEntity(row);
    }

    const [row] = await this.db
      .insert(jobRun)
      .values({
        jobName: run.jobName,
        status: run.status,
        eventType: run.eventType,
        eventPayload: run.eventPayload,
        idempotencyKey: run.idempotencyKey,
        progress: run.progress,
        resultSummary: run.resultSummary,
        errorMessage: run.errorMessage,
        errorStack: run.errorStack,
        retriesRemaining: run.retriesRemaining,
        maxRetries: run.maxRetries,
        startedAt: run.startedAt,
        finishedAt: run.finishedAt,
      })
      .returning();

    return toEntity(row);
  }

  /**
   * @see {@link IJobRunRepository.findById}
   */
  async findById(id: EntityId): Promise<JobRun | null> {
    const [row] = await this.db
      .select()
      .from(jobRun)
      .where(eq(jobRun.id, id))
      .limit(1);

    return row ? toEntity(row) : null;
  }

  /**
   * @see {@link IJobRunRepository.findByIdempotencyKey}
   */
  async findByIdempotencyKey(idempotencyKey: string): Promise<JobRun | null> {
    const [row] = await this.db
      .select()
      .from(jobRun)
      .where(eq(jobRun.idempotencyKey, idempotencyKey))
      .orderBy(desc(jobRun.createdAt))
      .limit(1);

    return row ? toEntity(row) : null;
  }

  /**
   * @see {@link IJobRunRepository.findRecent}
   */
  async findRecent(limit = 50): Promise<JobRun[]> {
    const rows = await this.db
      .select()
      .from(jobRun)
      .orderBy(desc(jobRun.createdAt))
      .limit(limit);

    return rows.map(toEntity);
  }

  /**
   * @see {@link IJobRunRepository.findByStatus}
   */
  async findByStatus(status: JobRunStatus, limit = 100): Promise<JobRun[]> {
    const rows = await this.db
      .select()
      .from(jobRun)
      .where(eq(jobRun.status, status))
      .orderBy(desc(jobRun.createdAt))
      .limit(limit);

    return rows.map(toEntity);
  }
}
