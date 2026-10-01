import { z } from "zod"

import { POSITIVE_MONEY_SCHEMA } from "@/lib/money/money.validation"
import { ID_SCHEMA } from "@/lib/validation/common.validation"
import { DATE_SCHEMA } from "@/lib/validation/date.validation"
/**
 * @summary
 * The amount is the only value the user provides: the quotas are
 * always derived from the quota price of the chosen date by the
 * service layer.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
const AMOUNT_SCHEMA = POSITIVE_MONEY_SCHEMA

/**
 * @summary
 * Validates the add application form fields with **Zod**.
 *
 * @remarks
 * The portfolio is picked inside the dialog, so it is part
 * of the form contract instead of being injected by the
 * parent screen. The create action extends this schema, so
 * the client check and the server check can never drift
 * apart.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
const APPLICATION_FORM_SCHEMA = z.object({
  portfolioId: ID_SCHEMA,
  fundId: ID_SCHEMA,
  date: DATE_SCHEMA,
  amount: AMOUNT_SCHEMA,
})

// Validates the edit application form fields with **Zod**.
const APPLICATION_EDIT_FORM_SCHEMA = z.object({
  date: DATE_SCHEMA,
  amount: AMOUNT_SCHEMA,
})

// Values of the add application form fields.
type ApplicationFormValues = z.infer<
  typeof APPLICATION_FORM_SCHEMA
>

// Values of the edit application form fields.
type ApplicationEditFormValues = z.infer<
  typeof APPLICATION_EDIT_FORM_SCHEMA
>

export {
  APPLICATION_FORM_SCHEMA,
  APPLICATION_EDIT_FORM_SCHEMA,
  type ApplicationFormValues,
  type ApplicationEditFormValues,
}
