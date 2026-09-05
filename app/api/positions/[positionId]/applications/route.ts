import { z } from "zod";

import { created, paginated } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { slicePage } from "@/app/api/_core/pagination";
import {
  dateStringSchema,
  entityIdParam,
  paginationQuerySchema,
  positiveMoneySchema,
} from "@/app/api/_core/schemas";
import { createApplication } from "@/business/use-cases/application/create-application.uc";
import { listPositionApplications } from "@/business/use-cases/application/list-position-applications.uc";

/**
 * The JSON body accepted when creating an application.
 */
const CREATE_BODY = z.object({
  date: dateStringSchema,
  amount: positiveMoneySchema,
});

/**
 * Lists all applications of a position the authenticated user can
 * access.
 */
export const GET = apiHandler({
  querySchema: paginationQuerySchema,
  handler: async ({ actor, params, query, runtime }) => {
    const positionId = entityIdParam.parse(params.positionId);
    const applications = await runtime.unitOfWork.run((tx) =>
      listPositionApplications(tx, { actorId: actor.actorId, positionId }),
    );
    const page = slicePage(applications, query);
    return paginated(page.items, page.meta);
  },
});

/**
 * Creates an application against a position.
 *
 * Only the portfolio owner or an editor may apply funds. The fund must
 * have a quota price on the application date.
 */
export const POST = apiHandler({
  bodySchema: CREATE_BODY,
  handler: async ({ actor, body, params, runtime }) => {
    const positionId = entityIdParam.parse(params.positionId);
    const dto = await createApplication(runtime.unitOfWork, {
      actorId: actor.actorId,
      positionId,
      date: body.date,
      amount: body.amount,
    });
    return created(dto);
  },
});
