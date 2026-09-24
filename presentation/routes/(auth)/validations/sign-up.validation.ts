import { z } from "zod"
import { IsValidCpf } from "../validators/cpf.validator"

// Validates the sign-up form fields with **Zod**.
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
