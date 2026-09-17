import { z } from "zod"

const signInFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
})

type SignInFormValues = z.infer<typeof signInFormSchema>

export { signInFormSchema, type SignInFormValues }
