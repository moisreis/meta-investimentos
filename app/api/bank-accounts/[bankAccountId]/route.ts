import { z } from "zod";

import { noContent, ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { deleteBankAccount } from "@/business/use-cases/bank/delete-bank-account.uc";
import { getBankAccount } from "@/business/use-cases/bank/get-bank-account.uc";
import { updateBankAccount } from "@/business/use-cases/bank/update-bank-account.uc";

/**
 * The JSON body accepted when updating a bank account.
 */
const UPDATE_BODY = z
  .object({
    agency: z.string().trim().min(1).max(12).optional(),
    accountNumber: z.string().trim().min(1).max(20).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided.",
  });

/**
 * Retrieves a single bank account.
 */
export const GET = apiHandler({
  handler: async ({ params, runtime }) => {
    const bankAccountId = entityIdParam.parse(params.bankAccountId);
    const dto = await runtime.unitOfWork.run((tx) =>
      getBankAccount(tx, { bankAccountId }),
    );
    return ok(dto);
  },
});

/**
 * Updates a bank account.
 *
 * Only the portfolio owner or an editor may update bank accounts.
 */
export const PATCH = apiHandler({
  bodySchema: UPDATE_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const bankAccountId = entityIdParam.parse(params.bankAccountId);
    const dto = await updateBankAccount(runtime.unitOfWork, {
      actorId: actor.actorId,
      bankAccountId,
      ...body,
    });
    return ok(dto);
  },
});

/**
 * Deletes a bank account.
 *
 * Only the portfolio owner or an editor may delete bank accounts.
 */
export const DELETE = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const bankAccountId = entityIdParam.parse(params.bankAccountId);
    await deleteBankAccount(runtime.unitOfWork, {
      actorId: actor.actorId,
      bankAccountId,
    });
    return noContent();
  },
});
