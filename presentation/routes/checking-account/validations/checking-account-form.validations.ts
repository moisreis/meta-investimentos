import { z } from "zod"

import { IsValidMoney } from "../validators/money.validator"

// Add form schema: bank account, date and value.
export const CHECKING_ACCOUNT_FORM_SCHEMA = z.object({
  bankAccountId: z
    .string()
    .trim()
    .min(1, "Selecione a conta bancária."),
  date: z.string().trim().min(1, "Informe a data."),
  value: z.string().trim().refine(IsValidMoney, {
    message: "Informe um valor válido.",
  }),
})

// Edit form schema: value only.
export const CHECKING_ACCOUNT_EDIT_FORM_SCHEMA = z.object({
  value: z.string().trim().refine(IsValidMoney, {
    message: "Informe um valor válido.",
  }),
})

export type CheckingAccountFormValues = z.infer<
  typeof CHECKING_ACCOUNT_FORM_SCHEMA
>
