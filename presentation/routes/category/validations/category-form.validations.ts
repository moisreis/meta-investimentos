import { z } from "zod"

// Validates the category add/edit form fields with **Zod**.
const CATEGORY_FORM_SCHEMA = z.object({
  name: z.string().trim().min(1, "Informe o nome."),
})

// Values of the category add/edit form fields.
type CategoryFormValues = z.infer<typeof CATEGORY_FORM_SCHEMA>

export { CATEGORY_FORM_SCHEMA, type CategoryFormValues }
