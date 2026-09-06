import { z } from "zod";

import { accepted } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import {
  dateStringSchema,
  entityIdParam,
  referencePeriodSchema,
} from "@/app/api/_core/schemas";
import { getPortfolio } from "@/business/use-cases/portfolio/get-portfolio.uc";
import { buildPerformanceCalculationRequest } from "@/infrastructure/inngest/requests.utils";

/**
 * The JSON body accepted when requesting a performance calculation.
 */
const CALCULATE_BODY = z
  .object({
    period: referencePeriodSchema,
    anchor: dateStringSchema,
    endDate: dateStringSchema.optional(),
    businessDay: z.boolean().optional(),
  })
  .refine(
    (value) =>
      (value.period === "range" && value.endDate !== undefined) ||
      (value.period !== "range" && value.endDate === undefined),
    {
      message:
        "endDate is required when period is 'range' and forbidden otherwise.",
    },
  )
  .refine(
    (value) => value.endDate === undefined || value.anchor <= value.endDate,
    {
      message: "anchor must not be after endDate.",
    },
  );

/**
 * Requests an asynchronous portfolio performance recalculation.
 *
 * The request is validated against the actor's portfolio access and then
 * forwarded to the job scheduler; the response acknowledges the accepted
 * `performance/calculate.requested` event with the generated request id.
 */
export const POST = apiHandler({
  bodySchema: CALCULATE_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const portfolioId = entityIdParam.parse(params.portfolioId);

    await runtime.unitOfWork.run((tx) =>
      getPortfolio(tx, { actorId: actor.actorId, portfolioId }),
    );

    const event = buildPerformanceCalculationRequest({
      portfolioId,
      period: body.period,
      anchor: body.anchor.toISOString().slice(0, 10),
      endDate: body.endDate?.toISOString().slice(0, 10),
      businessDay: body.businessDay,
    });

    await runtime.send([event]);

    return accepted({ id: event.data.id });
  },
});
