import { describe, expect, it } from "vitest";
import type { JobRunProps } from "@/business/entities/inngest/job-run.entity";
import { JobRun } from "@/business/entities/inngest/job-run.entity";

const VALID_PROPS: JobRunProps = {
  jobName: "cvm-import-fund",
  status: "PENDING",
  eventType: "cvm/import.fund.requested",
  eventPayload: { id: "request-1", fundCnpj: "08.267.224/0001-03" },
  idempotencyKey: "cvm-import-fund:request-1:08.267.224/0001-03",
};

const RUN_ID = "bd72c8f1-0f8d-4e1b-9d09-fb4e56e0a58e";

describe("JobRun.create", () => {
  it("creates a pending run with default values", () => {
    const run = JobRun.create(VALID_PROPS);

    expect(run.id).toBeUndefined();
    expect(run.jobName).toBe("cvm-import-fund");
    expect(run.status).toBe("PENDING");
    expect(run.eventType).toBe("cvm/import.fund.requested");
    expect(run.eventPayload).toMatchObject({ id: "request-1" });
    expect(run.idempotencyKey).toBe(VALID_PROPS.idempotencyKey);
    expect(run.progress).toBe(0);
    expect(run.retriesRemaining).toBe(0);
    expect(run.maxRetries).toBe(0);
    expect(run.resultSummary).toBeUndefined();
    expect(run.errorMessage).toBeUndefined();
    expect(run.errorStack).toBeUndefined();
    expect(run.finishedAt).toBeUndefined();
    expect(run.startedAt).toBeInstanceOf(Date);
    expect(run.createdAt).toBeInstanceOf(Date);
  });

  it("creates a run with the provided id", () => {
    const run = JobRun.create(VALID_PROPS, RUN_ID);

    expect(run.id).toBe(RUN_ID);
  });

  it("preserves provided optional values", () => {
    const STARTED_AT = new Date("2026-09-01T02:00:00.000Z");
    const FINISHED_AT = new Date("2026-09-01T02:05:00.000Z");
    const CREATED_AT = new Date("2026-09-01T02:00:00.000Z");
    const SUMMARY = { imported: 12 };

    const run = JobRun.create({
      ...VALID_PROPS,
      status: "RUNNING",
      progress: 40,
      retriesRemaining: 2,
      maxRetries: 5,
      startedAt: STARTED_AT,
      finishedAt: FINISHED_AT,
      resultSummary: SUMMARY,
      createdAt: CREATED_AT,
    });

    expect(run.progress).toBe(40);
    expect(run.retriesRemaining).toBe(2);
    expect(run.maxRetries).toBe(5);
    expect(run.startedAt).toBe(STARTED_AT);
    expect(run.finishedAt).toBe(FINISHED_AT);
    expect(run.resultSummary).toBe(SUMMARY);
    expect(run.createdAt).toBe(CREATED_AT);
  });

  it.each(["", "   "])("throws when the job name is blank", (blank) => {
    expect(() => JobRun.create({ ...VALID_PROPS, jobName: blank })).toThrow(
      "JobRun must have a jobName.",
    );
  });

  it.each(["", "   "])("throws when the event type is blank", (blank) => {
    expect(() => JobRun.create({ ...VALID_PROPS, eventType: blank })).toThrow(
      "JobRun must have an eventType.",
    );
  });

  it("throws when the event payload is missing", () => {
    expect(() =>
      JobRun.create({ ...VALID_PROPS, eventPayload: undefined as never }),
    ).toThrow("JobRun must have an eventPayload object.");
  });

  it("throws when the status is unknown", () => {
    expect(() =>
      JobRun.create({ ...VALID_PROPS, status: "DONE" as never }),
    ).toThrow(
      "JobRun status must be one of PENDING, RUNNING, COMPLETED, FAILED, CANCELLED.",
    );
  });

  it.each([
    -1, 101,
  ])("throws when the initial progress is out of range", (progress) => {
    expect(() => JobRun.create({ ...VALID_PROPS, progress })).toThrow(
      `JobRun progress must be between 0 and 100, got ${progress}.`,
    );
  });
});

describe("JobRun.start", () => {
  it("moves the run to RUNNING with a new started timestamp", () => {
    const run = JobRun.create(VALID_PROPS, RUN_ID);

    const started = run.start();

    expect(started).not.toBe(run);
    expect(started.id).toBe(RUN_ID);
    expect(started.status).toBe("RUNNING");
    expect(started.startedAt).toBeInstanceOf(Date);
    expect(started.jobName).toBe("cvm-import-fund");
    expect(run.status).toBe("PENDING");
  });
});

describe("JobRun.markProgress", () => {
  it("updates the progress percentage", () => {
    const run = JobRun.create(VALID_PROPS, RUN_ID);

    const updated = run.markProgress(75);

    expect(updated.id).toBe(RUN_ID);
    expect(updated.progress).toBe(75);
  });

  it.each([-1, 101])("throws when the progress is out of range", (progress) => {
    const run = JobRun.create(VALID_PROPS, RUN_ID);

    expect(() => run.markProgress(progress)).toThrow(
      `JobRun progress must be between 0 and 100, got ${progress}.`,
    );
  });
});

describe("JobRun.complete", () => {
  it("completes the run with a result summary", () => {
    const run = JobRun.create(VALID_PROPS, RUN_ID);
    const SUMMARY = { imported: 12, skipped: 0 };

    const completed = run.complete(SUMMARY);

    expect(completed.id).toBe(RUN_ID);
    expect(completed.status).toBe("COMPLETED");
    expect(completed.resultSummary).toBe(SUMMARY);
    expect(completed.finishedAt).toBeInstanceOf(Date);
  });
});

describe("JobRun.fail", () => {
  it("fails the run with the failure details", () => {
    const run = JobRun.create(VALID_PROPS, RUN_ID);

    const failed = run.fail({ message: "boom", stack: "at <anonymous>" });

    expect(failed.id).toBe(RUN_ID);
    expect(failed.status).toBe("FAILED");
    expect(failed.errorMessage).toBe("boom");
    expect(failed.errorStack).toBe("at <anonymous>");
    expect(failed.finishedAt).toBeInstanceOf(Date);
  });

  it("fails the run without a stack trace", () => {
    const run = JobRun.create(VALID_PROPS, RUN_ID);

    const failed = run.fail({ message: "boom" });

    expect(failed.status).toBe("FAILED");
    expect(failed.errorStack).toBeUndefined();
  });
});

describe("JobRun.cancel", () => {
  it("cancels the run", () => {
    const run = JobRun.create(VALID_PROPS, RUN_ID);

    const cancelled = run.cancel();

    expect(cancelled.id).toBe(RUN_ID);
    expect(cancelled.status).toBe("CANCELLED");
    expect(cancelled.finishedAt).toBeInstanceOf(Date);
  });
});

describe("JobRun.equals", () => {
  it("returns true for the same instance", () => {
    const run = JobRun.create(VALID_PROPS, RUN_ID);

    expect(run.equals(run)).toBe(true);
  });

  it("returns true when both runs share the same id", () => {
    const a = JobRun.create(VALID_PROPS, RUN_ID);
    const b = JobRun.create(VALID_PROPS, RUN_ID);

    expect(a.equals(b)).toBe(true);
  });

  it("returns false for different ids", () => {
    const a = JobRun.create(VALID_PROPS, RUN_ID);
    const b = JobRun.create(
      VALID_PROPS,
      "f4e1f2a1-9b2c-4d3e-8f0a-123456789abc",
    );

    expect(a.equals(b)).toBe(false);
  });

  it("returns false when compared against null or undefined", () => {
    const run = JobRun.create(VALID_PROPS, RUN_ID);

    expect(run.equals(null)).toBe(false);
    expect(run.equals(undefined)).toBe(false);
  });

  it("returns false when neither run has an id", () => {
    const a = JobRun.create(VALID_PROPS);
    const b = JobRun.create(VALID_PROPS);

    expect(a.equals(b)).toBe(false);
  });
});
