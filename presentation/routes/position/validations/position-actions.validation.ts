import { z } from "zod"

import { ID_SCHEMA } from "@/lib/validation/common.validation"

/**
 * @summary
 * The payload accepted by the delete position action.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
const DELETE_POSITION_SCHEMA = z.object({
  positionId: ID_SCHEMA,
})

// Values of the delete position action payload.
type DeletePositionValues = z.infer<typeof DELETE_POSITION_SCHEMA>

export { DELETE_POSITION_SCHEMA, type DeletePositionValues }