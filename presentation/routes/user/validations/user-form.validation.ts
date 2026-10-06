import { z } from "zod"

import { IsValidCpf } from "@/lib/validation/document.validation"
import { AVATAR_UPLOAD_MAX_DATA_URL_LENGTH } from "@/presentation/parts/settings/shared-avatar-upload.settings"

/**
 * @summary
 * The avatar a user record may carry.
 *
 * @remarks
 * Accepts a data URL, which is what the picker stores, and a
 * hosted URL, which is what records created before the picker
 * still carry. The empty string is part of the contract
 * rather than an absent optional, because a form holds an
 * untouched field as an empty string and "no avatar" is a
 * legitimate state, not a missing value.
 *
 * The length ceiling is the server's half of the size the
 * picker enforces: the client check is a courtesy, and this is
 * what stops a hand-crafted request from writing a photo into
 * a text column.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
const USER_IMAGE_SCHEMA = z
  .union([z.literal(""), z.url()])
  .refine(
    (value) =>
      (value?.length ?? 0) <= AVATAR_UPLOAD_MAX_DATA_URL_LENGTH,
    { message: "A imagem é muito grande. Selecione uma menor." }
  )
  .nullable()
  .optional()

/**
 * @summary
 * Validates the user add form fields with **Zod**.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
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
  image: USER_IMAGE_SCHEMA,
})

// Validates the user edit form fields with **Zod**.
const USER_EDIT_FORM_SCHEMA = z.object({
  name: z.string().trim().min(1, "Informe o nome."),
  firstName: z
    .string()
    .trim()
    .min(1, "Informe o primeiro nome."),
  lastName: z.string().trim().min(1, "Informe o sobrenome."),
  image: USER_IMAGE_SCHEMA,
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
