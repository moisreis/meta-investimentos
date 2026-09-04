import type { SendEventPayload } from "inngest";
import { eventType } from "inngest";

import { inngest } from "@/infrastructure/inngest/client";
import { assertRetryFailedJobs } from "@/infrastructure/inngest/contracts";
import {
  newRequestId,
  retryFailedJobsIdempotencyKey,
} from "@/infrastructure/inngest/idempotency";
import { getJobRunLedger } from "@/infrastructure/inngest/job-run.ledger.instance";
import { RETRY_ATTEMPTS } from "@/infrastructure/inngest/retry";

/**
 * The failed-job retry sweep worker.
 *
 * Receives a `job/retry.requested` event, reads the failed runs recorded
 * in the durable job-run ledger and re-fires each one. Re-firing uses a
 * freshly generated request id so the new event carries a new
 * idempotency key and is not de-duplicated against the old attempt.
 */
export const retryFailedJobsJob = inngest.createFunction(
  {
    id: "retry-failed-jobs",
    triggers: eventType("job/retry.requested"),
    concurrency: { limit: 1 },
    idempotency: "job-retry:{{event.data.date}}",
    retries: RETRY_ATTEMPTS.retryFailedJobs,
  },
  async ({ event, step }) => {
    const ledger = await getJobRunLedger();
    const payload = assertRetryFailedJobs(event.data);

    const run = await step.run("job-run.start", () =>
      ledger.start({
        jobName: "retry-failed-jobs",
        eventType: "job/retry.requested",
        eventPayload: payload as unknown as Record<string, unknown>,
        idempotencyKey: retryFailedJobsIdempotencyKey(payload.date),
        maxRetries: RETRY_ATTEMPTS.retryFailedJobs,
      }),
    );

    const failed = await step.run("find-failed-runs", () =>
      ledger.findFailed(payload.limit),
    );

    await step.sendEvent(
      "re-fire-failed-runs",
      failed.map((run) => ({
        name: run.eventType,
        data: {
          ...run.eventPayload,
          id: run.eventPayload.id ? newRequestId() : run.eventPayload.id,
        },
      })) as SendEventPayload,
    );

    await step.run("job-run.complete", () =>
      ledger.complete(run.runId, {
        date: payload.date,
        reFired: failed.length,
      }),
    );

    return { date: payload.date, reFired: failed.length };
  },
);
