import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { getWithdrawal } from "@/business/use-cases/withdrawal/get-withdrawal.uc";

/**
 * Retrieves a single withdrawal the authenticated user can access.
 */
export const GET = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const withdrawalId = entityIdParam.parse(params.withdrawalId);
    const dto = await runtime.unitOfWork.run((tx) =>
      getWithdrawal(tx, { actorId: actor.actorId, withdrawalId }),
    );
    return ok(dto);
  },
});
