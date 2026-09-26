import { z } from "zod"

import { ID_SCHEMA } from "@/lib/validation/common.validation"

import {
  BANK_ACCOUNT_EDIT_FORM_SCHEMA,
  BANK_ACCOUNT_FORM_SCHEMA,
} from "./bank-account-form.validations"

// The payload accepted by the create bank account action.
// The form and the action share this schema, so the client
// check and the server check can never drift apart.
const CREATE_BANK_ACCOUNT_SCHEMA = BANK_ACCOUNT_FORM_SCHEMA

// Values of the create bank account action payload.
type CreateBankAccountValues = z.infer<
  typeof CREATE_BANK_ACCOUNT_SCHEMA
>

// The payload accepted by the update bank account action. It
// extends the edit form schema, which carries only the
// editable fields, and adds the target id.
const UPDATE_BANK_ACCOUNT_SCHEMA =
  BANK_ACCOUNT_EDIT_FORM_SCHEMA.extend({
    bankAccountId: ID_SCHEMA,
  })

// Values of the update bank account action payload.
type UpdateBankAccountValues = z.infer<
  typeof UPDATE_BANK_ACCOUNT_SCHEMA
>

// The payload accepted by the delete bank account action.
const DELETE_BANK_ACCOUNT_SCHEMA = z.object({
  bankAccountId: ID_SCHEMA,
})

// Values of the delete bank account action payload.
type DeleteBankAccountValues = z.infer<
  typeof DELETE_BANK_ACCOUNT_SCHEMA
>

// The payload accepted by the bulk delete bank accounts
// action.
const BULK_DELETE_BANK_ACCOUNTS_SCHEMA = z.object({
  bankAccountIds: z
    .array(ID_SCHEMA)
    .min(1, "Selecione ao menos uma conta.")
    .max(500, "Selecione menos de 500 contas."),
})

// Values of the bulk delete bank accounts action payload.
type BulkDeleteBankAccountsValues = z.infer<
  typeof BULK_DELETE_BANK_ACCOUNTS_SCHEMA
>

export {
  BULK_DELETE_BANK_ACCOUNTS_SCHEMA,
  CREATE_BANK_ACCOUNT_SCHEMA,
  DELETE_BANK_ACCOUNT_SCHEMA,
  UPDATE_BANK_ACCOUNT_SCHEMA,
  type BulkDeleteBankAccountsValues,
  type CreateBankAccountValues,
  type DeleteBankAccountValues,
  type UpdateBankAccountValues,
}
