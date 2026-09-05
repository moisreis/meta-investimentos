import { z } from "zod";

import { created, paginated } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { slicePage } from "@/app/api/_core/pagination";
import {
  dateStringSchema,
  entityIdParam,
  moneySchema,
  paginationQuerySchema,
} from "@/app/api/_core/schemas";
import { createCheckingAccount } from "@/business/use-cases/bank/create-checking-account.uc";
import { listBankAccountCheckingAccounts } from "@/business/use-cases/bank/list-bank-account-checking-accounts.uc";

/**
 * The JSON body accepted when creating a checking account transaction.
 */
const CREATE_BODY = z.object({
  date: dateStringSchema,
  value: moneySchema,
});

/**
 * Lists the checking account transactions of a bank account.
 */
export const GET = apiHandler({
  querySchema: paginationQuerySchema,
  handler: async ({ params, query, runtime }) => {
    const bankAccountId = entityIdParam.parse(params.bankAccountId);
    const transactions = await runtime.unitOfWork.run((tx) =>
      listBankAccountCheckingAccounts(tx, { bankAccountId }),
    );
    const page = slicePage(transactions, query);
    return paginated(page.items, page.meta);
  },
});

/**
 * Creates a checking account transaction.
 *
 * Any authenticated user may register transactions.
 */
export const POST = apiHandler({
  bodySchema: CREATE_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const bankAccountId = entityIdParam.parse(params.bankAccountId);
    const dto = await createCheckingAccount(runtime.unitOfWork, {
      actorId: actor.actorId,
      bankAccountId,
      date: body.date,
      value: body.value,
    });
    return created(dto);
  },
});
