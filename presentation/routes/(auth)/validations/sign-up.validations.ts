import { z } from "zod"
import { isValidCpf } from "../validators/cpf.validator"

// Validates the sign-up form fields with **Zod**.
const signUpFormSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome completo."),
  firstName: z.string().trim().min(1, "Informe seu nome."),
  lastName: z.string().trim().min(1, "Informe seu sobrenome."),
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .email("Informe um e-mail válido."),
  cpf: z.string().refine(isValidCpf, {
    message: "Informe um CPF válido.",
  }),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
})

// Values of the sign-up form fields.
type SignUpFormValues = z.infer<typeof signUpFormSchema>

export { signUpFormSchema, type SignUpFormValues }