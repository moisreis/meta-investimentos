import { z } from "zod"

/**
 * @summary
 * Add form schema: portfolio, bank, agency and account.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export const BANK_ACCOUNT_FORM_SCHEMA = z.object({
  portfolioId: z.string().trim().min(1, "Informe a carteira."),
  bankId: z.string().trim().min(1, "Informe o banco."),
  agency: z.string().trim().min(1, "Informe a agência."),
  accountNumber: z.string().trim().min(1, "Informe a conta."),
})

// Edit form schema: agency and account number only.
export const BANK_ACCOUNT_EDIT_FORM_SCHEMA = z.object({
  agency: z.string().trim().min(1, "Informe a agência."),
  accountNumber: z.string().trim().min(1, "Informe a conta."),
})

// Values of the bank account add/edit form fields.
export type BankAccountFormValues = z.infer<
  typeof BANK_ACCOUNT_FORM_SCHEMA
>

