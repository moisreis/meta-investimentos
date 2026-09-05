import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { getApplication } from "@/business/use-cases/application/get-application.uc";

/**
 * Retrieves a single application the authenticated user can access.
 */
export const GET = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const applicationId = entityIdParam.parse(params.applicationId);
    const dto = await runtime.unitOfWork.run((tx) =>
      getApplication(tx, { actorId: actor.actorId, applicationId }),
    );
    return ok(dto);
  },
});
