import { z } from "zod"

import { ID_SCHEMA } from "@/lib/validation/common.validation"

import {
  CHECKING_ACCOUNT_EDIT_FORM_SCHEMA,
  CHECKING_ACCOUNT_FORM_SCHEMA,
} from "./checking-account-form.validations"

// The payload accepted by the record checking account
// action. The form and the action share this schema, so the
// client check and the server check can never drift apart.
const RECORD_CHECKING_ACCOUNT_SCHEMA =
  CHECKING_ACCOUNT_FORM_SCHEMA

// Values of the record checking account action payload.
type RecordCheckingAccountValues = z.infer<
  typeof RECORD_CHECKING_ACCOUNT_SCHEMA
>

// The payload accepted by the update checking account
// action.
const UPDATE_CHECKING_ACCOUNT_SCHEMA =
  CHECKING_ACCOUNT_EDIT_FORM_SCHEMA.extend({
    checkingAccountId: ID_SCHEMA,
  })

// Values of the update checking account action payload.
type UpdateCheckingAccountValues = z.infer<
  typeof UPDATE_CHECKING_ACCOUNT_SCHEMA
>

// The payload accepted by the delete checking account
// action.
const DELETE_CHECKING_ACCOUNT_SCHEMA = z.object({
  checkingAccountId: ID_SCHEMA,
})

// Values of the delete checking account action payload.
type DeleteCheckingAccountValues = z.infer<
  typeof DELETE_CHECKING_ACCOUNT_SCHEMA
>

// The payload accepted by the bulk delete checking
// accounts action.
const BULK_DELETE_CHECKING_ACCOUNTS_SCHEMA = z.object({
  checkingAccountIds: z
    .array(ID_SCHEMA)
    .min(1, "Selecione ao menos um saldo.")
    .max(500, "Selecione menos de 500 saldos."),
})

// Values of the bulk delete checking accounts action
// payload.
type BulkDeleteCheckingAccountsValues = z.infer<
  typeof BULK_DELETE_CHECKING_ACCOUNTS_SCHEMA
>

export {
  BULK_DELETE_CHECKING_ACCOUNTS_SCHEMA,
  DELETE_CHECKING_ACCOUNT_SCHEMA,
  RECORD_CHECKING_ACCOUNT_SCHEMA,
  UPDATE_CHECKING_ACCOUNT_SCHEMA,
  type BulkDeleteCheckingAccountsValues,
  type DeleteCheckingAccountValues,
  type RecordCheckingAccountValues,
  type UpdateCheckingAccountValues,
}
