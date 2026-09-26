import { z } from "zod"

import { ID_SCHEMA } from "@/lib/validation/common.validation"

import {
  USER_ADD_FORM_SCHEMA,
  USER_EDIT_FORM_SCHEMA,
} from "./user-form.validations"

// The roles the create action accepts. Narrowing the form
// string here keeps a hand-crafted request from granting an
// arbitrary role, and the message matches the one the form
// already shows for an empty selection.
const USER_ROLE_SCHEMA = z.enum(["USER", "MANAGER"], {
  error: "Selecione o perfil.",
})

// The payload accepted by the create user action. The form
// fields and the action share this schema, so the client
// check and the server check can never drift apart. The
// **CPF** is accepted here and never echoed back: the action
// answers without a payload.
const CREATE_USER_SCHEMA = USER_ADD_FORM_SCHEMA.extend({
  role: USER_ROLE_SCHEMA,
})

// Values of the create user action payload.
type CreateUserValues = z.infer<typeof CREATE_USER_SCHEMA>

// The payload accepted by the update user action.
const UPDATE_USER_SCHEMA = USER_EDIT_FORM_SCHEMA.extend({
  userId: ID_SCHEMA,
})

// Values of the update user action payload.
type UpdateUserValues = z.infer<typeof UPDATE_USER_SCHEMA>

// The payload accepted by the delete user action.
const DELETE_USER_SCHEMA = z.object({
  userId: ID_SCHEMA,
})

// Values of the delete user action payload.
type DeleteUserValues = z.infer<typeof DELETE_USER_SCHEMA>

// The payload accepted by the bulk delete users action.
const BULK_DELETE_USERS_SCHEMA = z.object({
  userIds: z
    .array(ID_SCHEMA)
    .min(1, "Selecione ao menos um usuário.")
    .max(500, "Selecione menos de 500 usuários."),
})

// Values of the bulk delete users action payload.
type BulkDeleteUsersValues = z.infer<
  typeof BULK_DELETE_USERS_SCHEMA
>

export {
  BULK_DELETE_USERS_SCHEMA,
  CREATE_USER_SCHEMA,
  DELETE_USER_SCHEMA,
  UPDATE_USER_SCHEMA,
  type BulkDeleteUsersValues,
  type CreateUserValues,
  type DeleteUserValues,
  type UpdateUserValues,
}
