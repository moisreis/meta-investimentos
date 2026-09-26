import { z } from "zod"
import { IsValidCpf } from "@/presentation/routes/(auth)/validators/cpf.validator"

// Validates the user add form fields with **Zod**.
const USER_ADD_FORM_SCHEMA = z.object({
  name: z.string().trim().min(1, "Informe o nome."),
  email: z
    .string()
    .trim()
    .min(1, "Informe o e-mail.")
    .email("Informe um e-mail válido."),
  firstName: z
    .string()
    .trim()
    .min(1, "Informe o primeiro nome."),
  lastName: z.string().trim().min(1, "Informe o sobrenome."),
  cpf: z.string().trim().refine(IsValidCpf, {
    message: "Informe um CPF válido.",
  }),
  role: z.string().trim().min(1, "Selecione o perfil."),
})

// Validates the user edit form fields with **Zod**.
const USER_EDIT_FORM_SCHEMA = z.object({
  name: z.string().trim().min(1, "Informe o nome."),
  firstName: z
    .string()
    .trim()
    .min(1, "Informe o primeiro nome."),
  lastName: z.string().trim().min(1, "Informe o sobrenome."),
})

// Values of the user add form fields.
type UserAddFormValues = z.infer<typeof USER_ADD_FORM_SCHEMA>

// Values of the user edit form fields.
type UserEditFormValues = z.infer<typeof USER_EDIT_FORM_SCHEMA>

export {
  USER_ADD_FORM_SCHEMA,
  USER_EDIT_FORM_SCHEMA,
  type UserAddFormValues,
  type UserEditFormValues,
}
