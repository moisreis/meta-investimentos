import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { toJobRunApiDto } from "@/app/api/_core/serializers/job-run.serializer";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

/**
 * Retrieves a single job-run ledger record.
 */
export const GET = apiHandler({
  handler: async ({ params, runtime }) => {
    const jobRunId = entityIdParam.parse(params.jobRunId);

    const run = await runtime.unitOfWork.run((tx) =>
      tx.jobRuns.findById(EntityId.create(jobRunId)),
    );

    if (run === null) {
      throw new NotFoundError(`Job run with id ${jobRunId} was not found.`);
    }

    return ok(toJobRunApiDto(run));
  },
});
