import { z } from "zod";

import { created, ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam, entityIdSchema } from "@/app/api/_core/schemas";
import { createBankAccount } from "@/business/use-cases/bank/create-bank-account.uc";
import { listPortfolioBankAccounts } from "@/business/use-cases/bank/list-portfolio-bank-accounts.uc";

/**
 * The JSON body accepted when creating a bank account.
 */
const CREATE_BODY = z.object({
  bankId: entityIdSchema,
  agency: z.string().trim().min(1).max(12),
  accountNumber: z.string().trim().min(1).max(20),
});

/**
 * Lists the bank accounts of a portfolio.
 */
export const GET = apiHandler({
  handler: async ({ params, runtime }) => {
    const portfolioId = entityIdParam.parse(params.portfolioId);
    const accounts = await runtime.unitOfWork.run((tx) =>
      listPortfolioBankAccounts(tx, { portfolioId }),
    );
    return ok(accounts);
  },
});

/**
 * Creates a bank account for a portfolio.
 *
 * Only the portfolio owner or an editor may create bank accounts.
 */
export const POST = apiHandler({
  bodySchema: CREATE_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const portfolioId = entityIdParam.parse(params.portfolioId);
    const dto = await createBankAccount(runtime.unitOfWork, {
      actorId: actor.actorId,
      portfolioId,
      ...body,
    });
    return created(dto);
  },
});
