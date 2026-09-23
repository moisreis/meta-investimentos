import { z } from "zod"

// Upper bound enforced by numeric(5,2) columns.
const PERCENTAGE_MAX = 999.99

/**
 * Percentage field for the portfolio form.
 *
 * @remarks
 * Accepts a string input (e.g. `"3,75"`), allows up to two
 * decimal places, and pipes it into a number between 0 and
 * 999.99. The regex also rejects empty strings, so the field
 * is effectively required.
 */
const percentageField = (label: string) =>
  z
    .string()
    .regex(
      /^\d+([.,]\d{1,2})?$/,
      `${label} deve ser um número com até 2 casas decimais.`
    )
    .transform((value) => Number.parseFloat(value.replace(",", ".")))
    .pipe(
      z
        .number()
        .min(0, `${label} não pode ser negativa.`)
        .max(PERCENTAGE_MAX, `${label} deve ser no máximo 999,99.`)
    )

/**
 * Validates the new/edit portfolio form payload.
 *
 * @remarks
 * Mirrors the `portfolio` schema fields of interest and the
 * `portfolio_allocation_order` check constraint, which
 * enforces `min ≤ target ≤ max`.
 */
export const portfolioFormSchema = z
  .object({
    acronym: z
      .string()
      .trim()
      .min(1, "Informe a sigla.")
      .max(16, "A sigla deve ter no máximo 16 caracteres."),
    name: z
      .string()
      .trim()
      .min(1, "Informe o nome.")
      .max(120, "O nome deve ter no máximo 120 caracteres."),
    annualInterestRate: percentageField("A taxa anual"),
    minAllocation: percentageField("A alocação mínima"),
    targetAllocation: percentageField("A alocação alvo"),
    maxAllocation: percentageField("A alocação máxima"),
  })
  .refine((values) => values.minAllocation <= values.targetAllocation, {
    message: "A alocação mínima deve ser menor ou igual à alocação alvo.",
    path: ["minAllocation"],
  })
  .refine((values) => values.targetAllocation <= values.maxAllocation, {
    message: "A alocação alvo deve ser menor ou igual à alocação máxima.",
    path: ["maxAllocation"],
  })

/** Raw shape kept in the form state (numeric fields as strings). */
export type PortfolioFormInputValues = z.input<typeof portfolioFormSchema>

/** Validated shape emitted on submit (numeric fields as numbers). */
export type PortfolioFormValues = z.output<typeof portfolioFormSchema>

export const portfolioFormDefaultValues: PortfolioFormInputValues = {
  acronym: "",
  name: "",
  annualInterestRate: "",
  minAllocation: "",
  targetAllocation: "",
  maxAllocation: "",
}