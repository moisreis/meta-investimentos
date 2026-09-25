import { z } from "zod"

// Validates the bank add/edit form fields with **Zod**.
const BANK_FORM_SCHEMA = z.object({
  code: z.string().trim().min(1, "Informe o código."),
  name: z.string().trim().min(1, "Informe o nome."),
})

// Values of the bank add/edit form fields.
type BankFormValues = z.infer<typeof BANK_FORM_SCHEMA>

export { BANK_FORM_SCHEMA, type BankFormValues }
