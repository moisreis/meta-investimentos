import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam } from "@/app/api/_core/schemas";
import { listPortfolioTransactionHistory } from "@/business/use-cases/portfolio/list-portfolio-transaction-history.uc";

/**
 * Lists the application and withdrawal transactions across all
 * positions of a portfolio.
 */
export const GET = apiHandler({
  handler: async ({ actor, params, runtime }) => {
    const portfolioId = entityIdParam.parse(params.portfolioId);
    const dto = await runtime.unitOfWork.run((tx) =>
      listPortfolioTransactionHistory(tx, {
        actorId: actor.actorId,
        portfolioId,
      }),
    );
    return ok(dto);
  },
});
