import { z } from "zod"

import { ID_SCHEMA } from "@/lib/validation/common.validation"
import { DATE_SCHEMA } from "@/lib/validation/date.validation"

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
type DeletePositionValues = z.infer<
  typeof DELETE_POSITION_SCHEMA
>

// The payload accepted by the bulk delete positions action.
const BULK_DELETE_POSITIONS_SCHEMA = z.object({
  positionIds: z
    .array(ID_SCHEMA)
    .min(1, "Selecione ao menos uma posição.")
    .max(500, "Selecione menos de 500 posições."),
})

// Values of the bulk delete positions action payload.
type BulkDeletePositionsValues = z.infer<
  typeof BULK_DELETE_POSITIONS_SCHEMA
>

// The payload accepted by the get position period returns
// action. The boundaries are inclusive UTC day keys.
const GET_POSITION_PERIOD_RETURNS_SCHEMA = z.object({
  positionId: ID_SCHEMA,
  from: DATE_SCHEMA,
  to: DATE_SCHEMA,
})

// Values of the get position period returns action payload.
type GetPositionPeriodReturnsValues = z.infer<
  typeof GET_POSITION_PERIOD_RETURNS_SCHEMA
>

export {
  BULK_DELETE_POSITIONS_SCHEMA,
  DELETE_POSITION_SCHEMA,
  GET_POSITION_PERIOD_RETURNS_SCHEMA,
  type BulkDeletePositionsValues,
  type DeletePositionValues,
  type GetPositionPeriodReturnsValues,
}
