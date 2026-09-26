import { z } from "zod"

import { ID_SCHEMA } from "@/lib/validation/common.validation"

import {
  FUND_EDIT_FORM_SCHEMA,
  FUND_FORM_SCHEMA,
} from "./fund-form.validations"

// The payload accepted by the create fund action. The form
// and the action share this schema, so the client check and
// the server check can never drift apart.
const CREATE_FUND_SCHEMA = FUND_FORM_SCHEMA

// Values of the create fund action payload.
type CreateFundValues = z.infer<typeof CREATE_FUND_SCHEMA>

// The payload accepted by the update fund action.
const UPDATE_FUND_SCHEMA = FUND_EDIT_FORM_SCHEMA.extend({
  fundId: ID_SCHEMA,
})

// Values of the update fund action payload.
type UpdateFundValues = z.infer<typeof UPDATE_FUND_SCHEMA>

// The payload accepted by the delete fund action.
const DELETE_FUND_SCHEMA = z.object({
  fundId: ID_SCHEMA,
})

// Values of the delete fund action payload.
type DeleteFundValues = z.infer<typeof DELETE_FUND_SCHEMA>

// The payload accepted by the bulk delete funds action.
const BULK_DELETE_FUNDS_SCHEMA = z.object({
  fundIds: z
    .array(ID_SCHEMA)
    .min(1, "Selecione ao menos um fundo.")
    .max(500, "Selecione menos de 500 fundos."),
})

// Values of the bulk delete funds action payload.
type BulkDeleteFundsValues = z.infer<
  typeof BULK_DELETE_FUNDS_SCHEMA
>

export {
  BULK_DELETE_FUNDS_SCHEMA,
  CREATE_FUND_SCHEMA,
  DELETE_FUND_SCHEMA,
  UPDATE_FUND_SCHEMA,
  type BulkDeleteFundsValues,
  type CreateFundValues,
  type DeleteFundValues,
  type UpdateFundValues,
}
