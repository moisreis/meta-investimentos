import { z } from "zod";

import { accepted } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { dateStringSchema } from "@/app/api/_core/schemas";
import { buildBenchmarkRefresh } from "@/infrastructure/inngest/requests";

/**
 * The JSON body accepted when requesting a benchmark refresh.
 */
const REFRESH_BODY = z
  .object({
    startDate: dateStringSchema.optional(),
    endDate: dateStringSchema.optional(),
  })
  .refine(
    (value) =>
      value.startDate === undefined ||
      value.endDate === undefined ||
      value.startDate <= value.endDate,
    {
      message: "startDate must not be after endDate.",
    },
  );

/**
 * Requests an asynchronous benchmark series refresh.
 *
 * The request is forwarded to the job scheduler; the response
 * acknowledges the accepted `benchmark/refresh.requested` event with the
 * generated request id.
 */
export const POST = apiHandler({
  bodySchema: REFRESH_BODY,
  handler: async ({ body, runtime }) => {
    const event = buildBenchmarkRefresh({
      startDate: body.startDate?.toISOString().slice(0, 10),
      endDate: body.endDate?.toISOString().slice(0, 10),
    });

    await runtime.send([event]);

    return accepted(event.data);
  },
});
