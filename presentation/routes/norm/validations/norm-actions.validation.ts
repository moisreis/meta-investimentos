import { z } from "zod"

import { ID_SCHEMA } from "@/lib/validation/common.validation"

import { NORM_FORM_SCHEMA } from "./norm-form.validation"

/**
 * @summary
 * The payload accepted by the create norm action. The
 * form and the action share this schema, so the client
 * check and the server check can never drift apart.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
const CREATE_NORM_SCHEMA = NORM_FORM_SCHEMA

// Values of the create norm action payload.
type CreateNormValues = z.infer<typeof CREATE_NORM_SCHEMA>

// The payload accepted by the update norm action.
const UPDATE_NORM_SCHEMA = NORM_FORM_SCHEMA.extend({
  normId: ID_SCHEMA,
})

// Values of the update norm action payload.
type UpdateNormValues = z.infer<typeof UPDATE_NORM_SCHEMA>

export {
  CREATE_NORM_SCHEMA,
  UPDATE_NORM_SCHEMA,
  type CreateNormValues,
  type UpdateNormValues,
}
