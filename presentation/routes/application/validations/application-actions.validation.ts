import { z } from "zod"

import { ID_SCHEMA } from "@/lib/validation/common.validation"

import {
  APPLICATION_FORM_SCHEMA,
  APPLICATION_EDIT_FORM_SCHEMA,
} from "./application-form.validation"
/**
 * @summary
 * The payload accepted by the create application action. The
 * form and the action share this schema, so the client check and
 * the server check can never drift apart.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
const CREATE_APPLICATION_SCHEMA = APPLICATION_FORM_SCHEMA

// Alias for backward compatibility with add-application.action
const ADD_APPLICATION_SCHEMA = CREATE_APPLICATION_SCHEMA

// Values of the create application action payload.
type CreateApplicationValues = z.infer<typeof CREATE_APPLICATION_SCHEMA>

// The payload accepted by the update application action. It
// extends the edit form schema, which carries only the
// editable fields, and adds the target id.
const UPDATE_APPLICATION_SCHEMA =
  APPLICATION_EDIT_FORM_SCHEMA.extend({
    applicationId: ID_SCHEMA,
  })

// Values of the update application action payload.
type UpdateApplicationValues = z.infer<typeof UPDATE_APPLICATION_SCHEMA>

// The payload accepted by the delete application action.
const DELETE_APPLICATION_SCHEMA = z.object({
  applicationId: ID_SCHEMA,
})

// Values of the delete application action payload.
type DeleteApplicationValues = z.infer<typeof DELETE_APPLICATION_SCHEMA>

// The payload accepted by the reverse application action.
const REVERSE_APPLICATION_SCHEMA = z.object({
  applicationId: ID_SCHEMA,
})

// Values of the reverse application action payload.
type ReverseApplicationValues = z.infer<typeof REVERSE_APPLICATION_SCHEMA>

// The payload accepted by the bulk delete applications action.
const BULK_DELETE_APPLICATIONS_SCHEMA = z.object({
  applicationIds: z
    .array(ID_SCHEMA)
    .min(1, "Selecione ao menos uma aplicação.")
    .max(500, "Selecione menos de 500 aplicações."),
})

// Values of the bulk delete applications action payload.
type BulkDeleteApplicationsValues = z.infer<
  typeof BULK_DELETE_APPLICATIONS_SCHEMA
>

export {
  ADD_APPLICATION_SCHEMA,
  BULK_DELETE_APPLICATIONS_SCHEMA,
  CREATE_APPLICATION_SCHEMA,
  DELETE_APPLICATION_SCHEMA,
  REVERSE_APPLICATION_SCHEMA,
  UPDATE_APPLICATION_SCHEMA,
  type BulkDeleteApplicationsValues,
  type CreateApplicationValues,
  type DeleteApplicationValues,
  type ReverseApplicationValues,
  type UpdateApplicationValues,
}