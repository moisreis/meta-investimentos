import { accepted } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { reverseWithdrawal } from "@/business/use-cases/withdrawal/reverse-withdrawal.uc";

/**
 * Reverses a withdrawal.
 *
 * Only the portfolio owner or an editor may reverse a withdrawal. The
 * FIFO transaction allocations for the withdrawal are removed
 * atomically.
 */
export const POST = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const withdrawalId = entityIdParam.parse(params.withdrawalId);
    const dto = await reverseWithdrawal(runtime.unitOfWork, {
      actorId: actor.actorId,
      withdrawalId,
    });
    return accepted(dto);
  },
});
