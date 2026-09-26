import { z } from "zod"

import { ID_SCHEMA } from "@/lib/validation/common.validation"

import { BANK_FORM_SCHEMA } from "./bank-form.validations"

// The payload accepted by the create bank action. The form
// and the action share this schema, so the client check and
// the server check can never drift apart.
const CREATE_BANK_SCHEMA = BANK_FORM_SCHEMA

// Values of the create bank action payload.
type CreateBankValues = z.infer<typeof CREATE_BANK_SCHEMA>

// The payload accepted by the update bank action.
const UPDATE_BANK_SCHEMA = BANK_FORM_SCHEMA.extend({
  bankId: ID_SCHEMA,
})

// Values of the update bank action payload.
type UpdateBankValues = z.infer<typeof UPDATE_BANK_SCHEMA>

// The payload accepted by the delete bank action.
const DELETE_BANK_SCHEMA = z.object({
  bankId: ID_SCHEMA,
})

// Values of the delete bank action payload.
type DeleteBankValues = z.infer<typeof DELETE_BANK_SCHEMA>

// The payload accepted by the bulk delete banks action.
const BULK_DELETE_BANKS_SCHEMA = z.object({
  bankIds: z
    .array(ID_SCHEMA)
    .min(1, "Selecione ao menos um banco.")
    .max(500, "Selecione menos de 500 bancos."),
})

// Values of the bulk delete banks action payload.
type BulkDeleteBanksValues = z.infer<
  typeof BULK_DELETE_BANKS_SCHEMA
>

export {
  BULK_DELETE_BANKS_SCHEMA,
  CREATE_BANK_SCHEMA,
  DELETE_BANK_SCHEMA,
  UPDATE_BANK_SCHEMA,
  type BulkDeleteBanksValues,
  type CreateBankValues,
  type DeleteBankValues,
  type UpdateBankValues,
}
