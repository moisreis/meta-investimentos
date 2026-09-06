import { z } from "zod";

import { accepted } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { cnpjSchema, dateStringSchema } from "@/app/api/_core/schemas";
import { buildCvmImportRequest } from "@/infrastructure/inngest/requests.utils";

/**
 * The JSON body accepted when requesting a CVM import.
 */
const IMPORT_BODY = z
  .object({
    monthsBack: z.coerce.number().int().min(1).max(36).optional(),
    requestedStart: dateStringSchema.optional(),
    requestedEnd: dateStringSchema.optional(),
    requestedCnpjs: z.array(cnpjSchema).optional(),
  })
  .refine(
    (value) =>
      value.requestedStart === undefined ||
      value.requestedEnd === undefined ||
      value.requestedStart <= value.requestedEnd,
    {
      message: "requestedStart must not be after requestedEnd.",
    },
  );

/**
 * Requests an asynchronous CVM quota import.
 *
 * The request is forwarded to the job scheduler; the response
 * acknowledges the accepted `cvm/import.requested` event with the
 * generated request id.
 */
export const POST = apiHandler({
  bodySchema: IMPORT_BODY,
  handler: async ({ body, runtime }) => {
    const event = buildCvmImportRequest({
      monthsBack: body.monthsBack,
      requestedStart: body.requestedStart?.toISOString().slice(0, 10),
      requestedEnd: body.requestedEnd?.toISOString().slice(0, 10),
      requestedCnpjs: body.requestedCnpjs,
    });

    await runtime.send([event]);

    return accepted({ id: event.data.id });
  },
});
