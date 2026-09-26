import { z } from "zod"

// Matches a `YYYY-MM` month key accepted by the form.
export const STATEMENT_MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/

// Validates the statement generate form fields with **Zod**.
const GENERATE_STATEMENT_SCHEMA = z.object({
  portfolioId: z
    .string()
    .trim()
    .min(1, "Selecione uma carteira."),
  month: z.string().trim().regex(STATEMENT_MONTH_PATTERN, {
    message: "Selecione um mês de referência.",
  }),
})

// Values of the statement generate form fields.
type GenerateStatementFormValues = z.infer<
  typeof GENERATE_STATEMENT_SCHEMA
>

export {
  GENERATE_STATEMENT_SCHEMA,
  type GenerateStatementFormValues,
}
