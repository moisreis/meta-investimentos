import { z } from "zod"
import { IsValidPercentage } from "../validators/percentage.validator"

// Validates a single percentage field of the portfolio form.
const PERCENTAGE_SCHEMA = z
  .string()
  .trim()
  .min(1, "Informe o percentual.")
  .refine(IsValidPercentage, {
    message: "Informe um percentual entre 0 e 999,99.",
  })

// Validates the portfolio add/edit form fields with **Zod**.
const PORTFOLIO_FORM_SCHEMA = z
  .object({
    acronym: z.string().trim().min(1, "Informe a sigla."),
    name: z.string().trim().min(1, "Informe o nome."),
    annualInterestRate: PERCENTAGE_SCHEMA,
    minAllocation: PERCENTAGE_SCHEMA,
    maxAllocation: PERCENTAGE_SCHEMA,
    targetAllocation: PERCENTAGE_SCHEMA,
  })
  .refine(
    (values) =>
      Number(values.minAllocation.replace(",", ".")) <=
        Number(values.targetAllocation.replace(",", ".")) &&
      Number(values.targetAllocation.replace(",", ".")) <=
        Number(values.maxAllocation.replace(",", ".")),
    {
      message:
        "A alocação alvo deve estar entre a mínima e a máxima.",
      path: ["targetAllocation"],
    }
  )

// Values of the portfolio add/edit form fields.
type PortfolioFormValues = z.infer<typeof PORTFOLIO_FORM_SCHEMA>

export { PORTFOLIO_FORM_SCHEMA, type PortfolioFormValues }
