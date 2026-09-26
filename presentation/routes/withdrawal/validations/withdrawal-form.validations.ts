import { z } from "zod"

import { POSITIVE_MONEY_SCHEMA } from "@/lib/money/money.validation"
import { ID_SCHEMA } from "@/lib/validation/common.validation"
import { DATE_SCHEMA } from "@/lib/validation/date.validation"

// The amount is the only value the user provides: the
// quotas are always derived from the quota price of the
// chosen date by the service layer.
const AMOUNT_SCHEMA = POSITIVE_MONEY_SCHEMA

// Validates the add withdrawal form fields with **Zod**.
const WITHDRAWAL_FORM_SCHEMA = z.object({
  positionId: ID_SCHEMA,
  date: DATE_SCHEMA,
  amount: AMOUNT_SCHEMA,
})

// Values of the add withdrawal form fields.
type WithdrawalFormValues = z.infer<
  typeof WITHDRAWAL_FORM_SCHEMA
>

export { WITHDRAWAL_FORM_SCHEMA, type WithdrawalFormValues }
