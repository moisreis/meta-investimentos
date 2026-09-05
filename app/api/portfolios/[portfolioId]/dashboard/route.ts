import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { resolveReferenceDate } from "@/app/api/_core/reference-date";
import {
  entityIdParam,
  referenceDateQuerySchema,
} from "@/app/api/_core/schemas";
import { getPortfolioDashboard } from "@/business/use-cases/portfolio/get-portfolio-dashboard.uc";

/**
 * Retrieves the portfolio dashboard data on a reference date.
 */
export const GET = apiHandler({
  querySchema: referenceDateQuerySchema,
  handler: async ({ actor, params, query, runtime }) => {
    const portfolioId = entityIdParam.parse(params.portfolioId);
    const referenceDate = resolveReferenceDate(query.referenceDate);
    const dto = await runtime.unitOfWork.run((tx) =>
      getPortfolioDashboard(tx, {
        actorId: actor.actorId,
        portfolioId,
        referenceDate,
      }),
    );
    return ok(dto);
  },
});
