import { z } from "zod"

import { MONEY_SCHEMA } from "@/lib/money/money.validation"
import { ID_SCHEMA } from "@/lib/validation/common.validation"
import { DATE_SCHEMA } from "@/lib/validation/date.validation"

/**
 * @summary
 * Add form schema: bank account, date and value.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export const CHECKING_ACCOUNT_FORM_SCHEMA = z.object({
  bankAccountId: ID_SCHEMA,
  date: DATE_SCHEMA,
  value: MONEY_SCHEMA,
})

// Edit form schema: value only.
export const CHECKING_ACCOUNT_EDIT_FORM_SCHEMA = z.object({
  value: MONEY_SCHEMA,
})

export type CheckingAccountFormValues = z.infer<
  typeof CHECKING_ACCOUNT_FORM_SCHEMA
>
