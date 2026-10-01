import { z } from "zod"

/**
 * @summary
 * Validates the sign-in form fields.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
const SIGN_IN_FORM_SCHEMA = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
})

// Values of the sign-in form fields.
type SignInFormValues = z.infer<typeof SIGN_IN_FORM_SCHEMA>

export { SIGN_IN_FORM_SCHEMA, type SignInFormValues }
