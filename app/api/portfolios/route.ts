import { z } from "zod";

import { created, paginated } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { slicePage } from "@/app/api/_core/pagination";
import {
  paginationQuerySchema,
  percentageSchema,
} from "@/app/api/_core/schemas";
import { createPortfolio } from "@/business/use-cases/portfolio/create-portfolio.uc";
import { listPortfolios } from "@/business/use-cases/portfolio/list-portfolios.uc";

/**
 * The JSON body accepted when creating a portfolio.
 */
const CREATE_BODY = z.object({
  acronym: z.string().trim().min(1).max(12),
  name: z.string().trim().min(1),
  annualInterestRate: percentageSchema,
  minAllocation: percentageSchema,
  maxAllocation: percentageSchema,
  targetAllocation: percentageSchema,
});

/**
 * Lists all portfolios the authenticated user can access.
 */
export const GET = apiHandler({
  querySchema: paginationQuerySchema,
  handler: async ({ actor, query, runtime }) => {
    const portfolios = await runtime.unitOfWork.run((tx) =>
      listPortfolios(tx, { actorId: actor.actorId }),
    );
    const page = slicePage(portfolios, query);
    return paginated(page.items, page.meta);
  },
});

/**
 * Creates a portfolio owned by the authenticated user.
 */
export const POST = apiHandler({
  bodySchema: CREATE_BODY,
  handler: async ({ actor, body, runtime }) => {
    const dto = await createPortfolio(runtime.unitOfWork, {
      actorId: actor.actorId,
      ...body,
    });
    return created(dto);
  },
});
