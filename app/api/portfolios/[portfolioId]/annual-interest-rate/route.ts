import { z } from "zod";

import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { entityIdParam, percentageSchema } from "@/app/api/_core/schemas";
import { updatePortfolioAnnualInterestRate } from "@/business/use-cases/portfolio/update-portfolio-annual-interest-rate.uc";

/**
 * The JSON body accepted when updating the annual interest rate of a
 * portfolio.
 */
const INTEREST_RATE_BODY = z.object({
  annualInterestRate: percentageSchema,
});

/**
 * Updates the annual interest rate of a portfolio.
 *
 * Only the owner or an editor may change the annual interest rate.
 */
export const PATCH = apiHandler({
  bodySchema: INTEREST_RATE_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const portfolioId = entityIdParam.parse(params.portfolioId);
    const dto = await updatePortfolioAnnualInterestRate(runtime.unitOfWork, {
      actorId: actor.actorId,
      portfolioId,
      annualInterestRate: body.annualInterestRate,
    });
    return ok(dto);
  },
});
