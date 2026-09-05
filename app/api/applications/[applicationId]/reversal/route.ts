import { accepted } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { reverseApplication } from "@/business/use-cases/application/reverse-application.uc";

/**
 * Reverses an application.
 *
 * Only the portfolio owner or an editor may reverse an application, and
 * only when no later, non-reversed withdrawal still consumes its
 * quotas.
 */
export const POST = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const applicationId = entityIdParam.parse(params.applicationId);
    const dto = await reverseApplication(runtime.unitOfWork, {
      actorId: actor.actorId,
      applicationId,
    });
    return accepted(dto);
  },
});
