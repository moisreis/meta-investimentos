import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { getStatement } from "@/business/use-cases/statement/get-statement.uc";

/**
 * Retrieves a single statement by id.
 */
export const GET = apiHandler({
  handler: async ({ params, runtime }) => {
    const statementId = entityIdParam.parse(params.statementId);
    const dto = await runtime.unitOfWork.run((tx) =>
      getStatement(tx, { statementId }),
    );
    return ok(dto);
  },
});
