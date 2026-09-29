import { z } from "zod"

/**
 * @summary
 * Validates the category add/edit form fields with **Zod**.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
const CATEGORY_FORM_SCHEMA = z.object({
  name: z.string().trim().min(1, "Informe o nome."),
})

// Values of the category add/edit form fields.
type CategoryFormValues = z.infer<typeof CATEGORY_FORM_SCHEMA>

export { CATEGORY_FORM_SCHEMA, type CategoryFormValues }
