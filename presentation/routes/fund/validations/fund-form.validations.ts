import { z } from "zod"

import { IsValidCnpj } from "../validators/cnpj.validator"
import { IsValidPercentage } from "../validators/percentage.validator"

// Validates an optional percentage fee field.
const OPTIONAL_FEE_SCHEMA = z
  .string()
  .trim()
  .refine((value) => value === "" || IsValidPercentage(value), {
    message: "Informe um percentual entre 0 e 999,99.",
  })

// Validates the fund add form fields with **Zod**.
const FUND_FORM_SCHEMA = z.object({
  cnpj: z.string().trim().refine(IsValidCnpj, {
    message: "Informe um CNPJ válido.",
  }),
  name: z.string().trim().min(1, "Informe o nome."),
  administrationFee: OPTIONAL_FEE_SCHEMA,
  performanceFee: OPTIONAL_FEE_SCHEMA,
  bankId: z.string().trim().min(1, "Selecione o banco."),
  benchmarkId: z.string().trim(),
  categoryId: z.string().trim(),
})

// Validates the fund edit form fields with **Zod**.
const FUND_EDIT_FORM_SCHEMA = z.object({
  name: z.string().trim().min(1, "Informe o nome."),
  administrationFee: OPTIONAL_FEE_SCHEMA,
  performanceFee: OPTIONAL_FEE_SCHEMA,
  benchmarkId: z.string().trim(),
  categoryId: z.string().trim(),
})

// Values of the fund add form fields.
type FundFormValues = z.infer<typeof FUND_FORM_SCHEMA>

// Values of the fund edit form fields.
type FundEditFormValues = z.infer<typeof FUND_EDIT_FORM_SCHEMA>

export {
  FUND_FORM_SCHEMA,
  FUND_EDIT_FORM_SCHEMA,
  type FundFormValues,
  type FundEditFormValues,
}
