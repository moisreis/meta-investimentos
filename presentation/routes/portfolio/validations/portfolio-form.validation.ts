import { z } from "zod"

import { IsValidPercentage } from "@/lib/validation/percentage.validation"

/**
 * @summary
 * Validates a single percentage field of the portfolio form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
const PERCENTAGE_SCHEMA = z
  .string()
  .trim()
  .min(1, "Informe o percentual.")
  .refine(IsValidPercentage, {
    message: "Informe um percentual entre 0 e 999,99.",
  })

/**
 * @summary
 * Validates the three bounds of one attached norm.
 *
 * @remarks
 * The row carries only what the service stores. The name
 * and the article number the row also holds are dropped
 * here: they are read from the norm registry on the way
 * back in, so a portfolio never keeps a copy of them that
 * can go stale.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-04
 */
const NORM_ALLOCATION_SCHEMA = z
  .object({
    normId: z.string().min(1, "Selecione uma norma."),
    minAllocation: PERCENTAGE_SCHEMA,
    targetAllocation: PERCENTAGE_SCHEMA,
    maxAllocation: PERCENTAGE_SCHEMA,
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

// Validates the portfolio add/edit form fields with **Zod**.
const PORTFOLIO_FORM_SCHEMA = z
  .object({
    acronym: z.string().trim().min(1, "Informe a sigla."),
    name: z.string().trim().min(1, "Informe o nome."),
    annualInterestRate: PERCENTAGE_SCHEMA,
    minAllocation: PERCENTAGE_SCHEMA,
    maxAllocation: PERCENTAGE_SCHEMA,
    targetAllocation: PERCENTAGE_SCHEMA,
    norms: z.array(NORM_ALLOCATION_SCHEMA).optional(),
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
