import { z } from "zod"

import { WITHDRAWAL_FORM_SCHEMA } from "./withdrawal-form.validations"

// The payload accepted by the add withdrawal action. The
// form and the action share the withdrawal schema, so the
// client check and the server check can never drift apart.
// The quotas are absent on purpose: they are always derived
// from the quota price of the chosen date by the service
// layer, and the amount is the only money value the client
// is allowed to send.
const ADD_WITHDRAWAL_SCHEMA = WITHDRAWAL_FORM_SCHEMA

// Values of the add withdrawal action payload.
type AddWithdrawalValues = z.infer<typeof ADD_WITHDRAWAL_SCHEMA>

export { ADD_WITHDRAWAL_SCHEMA, type AddWithdrawalValues }
