import { z } from "zod";

import { accepted } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { cnpjSchema, dateStringSchema } from "@/app/api/_core/schemas";
import { buildFundQuoteRefresh } from "@/infrastructure/inngest/requests.utils";

/**
 * The JSON body accepted when requesting a fund quote refresh.
 */
const REFRESH_BODY = z.object({
  date: dateStringSchema.optional(),
  requestedCnpjs: z.array(cnpjSchema).optional(),
});

/**
 * Requests an asynchronous fund quote refresh from the CVM source.
 *
 * The request is forwarded to the job scheduler; the response
 * acknowledges the accepted `fund/refresh.quotes` event.
 */
export const POST = apiHandler({
  bodySchema: REFRESH_BODY,
  handler: async ({ body, runtime }) => {
    const event = buildFundQuoteRefresh({
      date: body.date?.toISOString().slice(0, 10),
      requestedCnpjs: body.requestedCnpjs,
    });

    await runtime.send([event]);

    return accepted(event.data);
  },
});
