import { z } from "zod"

import { IsValidCpf } from "@/lib/validation/document.validation"

/**
 * @summary
 * Validates the sign-up form fields with **Zod**.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
const SIGN_UP_FORM_SCHEMA = z.object({
  name: z.string().trim().min(1, "Informe seu nome completo."),
  firstName: z.string().trim().min(1, "Informe seu nome."),
  lastName: z.string().trim().min(1, "Informe seu sobrenome."),
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .email("Informe um e-mail válido."),
  cpf: z.string().refine(IsValidCpf, {
    message: "Informe um CPF válido.",
  }),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres."),
})

// Values of the sign-up form fields.
type SignUpFormValues = z.infer<typeof SIGN_UP_FORM_SCHEMA>

export { SIGN_UP_FORM_SCHEMA, type SignUpFormValues }

