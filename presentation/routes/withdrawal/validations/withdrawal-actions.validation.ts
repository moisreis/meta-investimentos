import { z } from "zod"

import { ID_SCHEMA } from "@/lib/validation/common.validation"

import { WITHDRAWAL_FORM_SCHEMA } from "./withdrawal-form.validation"
/**
 * @summary
 * The payload accepted by the add withdrawal action. The form
 * and the action share the withdrawal schema, so the client
 * check and the server check can never drift apart. The quotas
 * are absent on purpose: they are always derived from the quota
 * price of the chosen date by the service layer, and the amount
 * is the only money value the client is allowed to send.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
const ADD_WITHDRAWAL_SCHEMA = WITHDRAWAL_FORM_SCHEMA

// Values of the add withdrawal action payload.
type AddWithdrawalValues = z.infer<typeof ADD_WITHDRAWAL_SCHEMA>

// The payload accepted by the delete withdrawal action.
const DELETE_WITHDRAWAL_SCHEMA = z.object({
  withdrawalId: ID_SCHEMA,
})

// Values of the delete withdrawal action payload.
type DeleteWithdrawalValues = z.infer<typeof DELETE_WITHDRAWAL_SCHEMA>

// The payload accepted by the reverse withdrawal action.
const REVERSE_WITHDRAWAL_SCHEMA = z.object({
  withdrawalId: ID_SCHEMA,
})

// Values of the reverse withdrawal action payload.
type ReverseWithdrawalValues = z.infer<typeof REVERSE_WITHDRAWAL_SCHEMA>

// The payload accepted by the bulk delete withdrawals action.
const BULK_DELETE_WITHDRAWALS_SCHEMA = z.object({
  withdrawalIds: z
    .array(ID_SCHEMA)
    .min(1, "Selecione ao menos um resgate.")
    .max(500, "Selecione menos de 500 resgates."),
})

// Values of the bulk delete withdrawals action payload.
type BulkDeleteWithdrawalsValues = z.infer<
  typeof BULK_DELETE_WITHDRAWALS_SCHEMA
>

export {
  ADD_WITHDRAWAL_SCHEMA,
  BULK_DELETE_WITHDRAWALS_SCHEMA,
  DELETE_WITHDRAWAL_SCHEMA,
  REVERSE_WITHDRAWAL_SCHEMA,
  type AddWithdrawalValues,
  type BulkDeleteWithdrawalsValues,
  type DeleteWithdrawalValues,
  type ReverseWithdrawalValues,
}