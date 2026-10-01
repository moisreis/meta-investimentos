import { z } from "zod"

import { IsValidPercentage } from "@/lib/validation/percentage.validation"

/**
 * @summary
 * Validates a required allocation percentage field.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
const ALLOCATION_SCHEMA = z
  .string()
  .trim()
  .refine(IsValidPercentage, {
    message: "Informe um percentual entre 0 e 999,99.",
  })

// Validates the norm add and edit form fields with **Zod**.
const NORM_FORM_SCHEMA = z.object({
  articleNumber: z.string().trim().min(1, "Informe o artigo."),
  name: z.string().trim().min(1, "Informe o nome."),
  categoryId: z.string().trim().min(1, "Selecione a categoria."),
  minAllocation: ALLOCATION_SCHEMA,
  maxAllocation: ALLOCATION_SCHEMA,
  targetAllocation: ALLOCATION_SCHEMA,
})

// Values of the norm form fields.
type NormFormValues = z.infer<typeof NORM_FORM_SCHEMA>

export { NORM_FORM_SCHEMA, type NormFormValues }
