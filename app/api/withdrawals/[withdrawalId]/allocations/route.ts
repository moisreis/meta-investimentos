import { created } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { allocateWithdrawalQuotasFifoOperation } from "@/business/use-cases/withdrawal/allocate-withdrawal-quotas-fifo.uc";

/**
 * Allocates a withdrawal's quotas across its position's applications in
 * FIFO order.
 *
 * Usually the allocation happens atomically when the withdrawal is
 * created. This endpoint allows retrying the allocation when it was not
 * performed, e.g. after a partial failure.
 */
export const POST = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const withdrawalId = entityIdParam.parse(params.withdrawalId);
    const dto = await allocateWithdrawalQuotasFifoOperation(
      runtime.unitOfWork,
      {
        actorId: actor.actorId,
        withdrawalId,
      },
    );
    return created(dto);
  },
});
